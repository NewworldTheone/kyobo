"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustInventory = exports.moveProductLocation = void 0;
const index_1 = require("./index");
const email_1 = require("./email");
const error_middleware_1 = require("./error.middleware");
/**
 * 제품 위치 변경 서비스
 * @param productId 제품 ID
 * @param userId 사용자 ID
 * @param toLocation 새 위치
 * @returns 업데이트된 제품 및 위치 이력
 */
const moveProductLocation = async (productId, userId, toLocation) => {
    // 제품 존재 확인
    const product = await index_1.prisma.product.findUnique({
        where: { id: productId }
    });
    if (!product) {
        throw new error_middleware_1.AppError('제품을 찾을 수 없습니다.', 404);
    }
    const fromLocation = product.location;
    // 위치가 같으면 변경 불필요
    if (fromLocation === toLocation) {
        throw new error_middleware_1.AppError('현재 위치와 동일합니다.', 400);
    }
    // 트랜잭션으로 위치 변경 및 이력 생성
    const [updatedProduct, locationHistory] = await index_1.prisma.$transaction([
        index_1.prisma.product.update({
            where: { id: productId },
            data: { location: toLocation }
        }),
        index_1.prisma.locationHistory.create({
            data: {
                productId,
                userId,
                fromLocation,
                toLocation
            }
        })
    ]);
    return {
        product: updatedProduct,
        locationHistory
    };
};
exports.moveProductLocation = moveProductLocation;
/**
 * 재고 조정 서비스
 * @param productId 제품 ID
 * @param userId 사용자 ID
 * @param quantity 조정 수량 (양수: 입고, 음수: 출고)
 * @param memo 메모
 * @returns 업데이트된 제품 및 재고 조정 이력
 */
const adjustInventory = async (productId, userId, quantity, memo) => {
    // 제품 존재 확인
    const product = await index_1.prisma.product.findUnique({
        where: { id: productId }
    });
    if (!product) {
        throw new error_middleware_1.AppError('제품을 찾을 수 없습니다.', 404);
    }
    const newQuantity = product.quantity + quantity;
    if (newQuantity < 0) {
        throw new error_middleware_1.AppError('재고가 부족합니다.', 400);
    }
    // 트랜잭션으로 재고 조정 및 이력 생성
    const [updatedProduct, adjustment] = await index_1.prisma.$transaction([
        index_1.prisma.product.update({
            where: { id: productId },
            data: { quantity: newQuantity }
        }),
        index_1.prisma.inventoryAdjustment.create({
            data: {
                productId,
                userId,
                quantity,
                memo,
                adjustmentType: quantity > 0 ? '입고' : '출고',
            }
        })
    ]);
    // 안전 재고 이하로 떨어졌는지 확인하고 알림 발송
    if (newQuantity <= product.safetyStock) {
        await (0, email_1.sendLowStockAlert)(product.name, product.sku, newQuantity, product.safetyStock);
    }
    return {
        product: updatedProduct,
        adjustment
    };
};
exports.adjustInventory = adjustInventory;
