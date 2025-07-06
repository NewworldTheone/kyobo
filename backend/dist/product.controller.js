"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportProducts = exports.getLocationHistory = exports.moveProductLocation = exports.adjustInventory = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const index_1 = require("./index");
const email_1 = require("./email");
const error_middleware_1 = require("./error.middleware");
const client_1 = require("@prisma/client");
const getAllProducts = async (req, res, next) => {
    try {
        const { search, category, brand, location, lowStock } = req.query;
        const filters = {};
        if (search) {
            filters.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (category) {
            filters.category = category;
        }
        if (brand) {
            filters.brand = brand;
        }
        if (location) {
            filters.location = location;
        }
        if (lowStock === 'true') {
            // Use raw query for column comparison
            const lowStockProducts = await index_1.prisma.$queryRaw `
        SELECT * FROM "Product" 
        WHERE quantity <= "safetyStock"
        ${search ? client_1.Prisma.sql `AND (name ILIKE ${`%${search}%`} OR sku ILIKE ${`%${search}%`})` : client_1.Prisma.empty}
        ${category ? client_1.Prisma.sql `AND category = ${category}` : client_1.Prisma.empty}
        ${brand ? client_1.Prisma.sql `AND brand = ${brand}` : client_1.Prisma.empty}
        ${location ? client_1.Prisma.sql `AND location = ${location}` : client_1.Prisma.empty}
        ORDER BY "updatedAt" DESC
      `;
            return res.status(200).json({
                status: 'success',
                data: lowStockProducts
            });
        }
        const products = await index_1.prisma.product.findMany({
            where: filters,
            orderBy: { updatedAt: 'desc' }
        });
        return res.status(200).json({
            status: 'success',
            data: products
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await index_1.prisma.product.findUnique({
            where: { id }
        });
        if (!product) {
            throw new error_middleware_1.AppError('제품을 찾을 수 없습니다.', 404);
        }
        return res.status(200).json({
            status: 'success',
            data: product
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res, next) => {
    try {
        const { name, sku, category, brand, location, quantity, safetyStock, price } = req.body;
        // SKU 중복 확인
        const existingProduct = await index_1.prisma.product.findUnique({
            where: { sku }
        });
        if (existingProduct) {
            throw new error_middleware_1.AppError('이미 존재하는 SKU입니다.', 400);
        }
        const newProduct = await index_1.prisma.product.create({
            data: {
                name,
                sku,
                category,
                brand,
                location,
                quantity: parseInt(quantity),
                safetyStock: parseInt(safetyStock),
                price: parseFloat(price)
            }
        });
        return res.status(201).json({
            status: 'success',
            data: newProduct
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, category, brand, location, quantity, safetyStock, price } = req.body;
        // 제품 존재 확인
        const existingProduct = await index_1.prisma.product.findUnique({
            where: { id }
        });
        if (!existingProduct) {
            throw new error_middleware_1.AppError('제품을 찾을 수 없습니다.', 404);
        }
        const updatedProduct = await index_1.prisma.product.update({
            where: { id },
            data: {
                name,
                category,
                brand,
                location,
                quantity: parseInt(quantity),
                safetyStock: parseInt(safetyStock),
                price: parseFloat(price)
            }
        });
        return res.status(200).json({
            status: 'success',
            data: updatedProduct
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        // 제품 존재 확인
        const existingProduct = await index_1.prisma.product.findUnique({
            where: { id }
        });
        if (!existingProduct) {
            throw new error_middleware_1.AppError('제품을 찾을 수 없습니다.', 404);
        }
        // 관련 이력 삭제
        await index_1.prisma.inventoryAdjustment.deleteMany({
            where: { productId: id }
        });
        await index_1.prisma.locationHistory.deleteMany({
            where: { productId: id }
        });
        // 제품 삭제
        await index_1.prisma.product.delete({
            where: { id }
        });
        return res.status(200).json({
            status: 'success',
            message: '제품이 성공적으로 삭제되었습니다.'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
const adjustInventory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity, memo } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            throw new error_middleware_1.AppError('인증이 필요합니다.', 401);
        }
        // 제품 존재 확인
        const product = await index_1.prisma.product.findUnique({
            where: { id }
        });
        if (!product) {
            throw new error_middleware_1.AppError('제품을 찾을 수 없습니다.', 404);
        }
        const adjustmentQuantity = parseInt(quantity);
        const newQuantity = product.quantity + adjustmentQuantity;
        if (newQuantity < 0) {
            throw new error_middleware_1.AppError('재고는 0 미만이 될 수 없습니다.', 400);
        }
        // 트랜잭션으로 재고 조정 및 이력 생성
        const [updatedProduct, adjustment] = await index_1.prisma.$transaction([
            index_1.prisma.product.update({
                where: { id },
                data: { quantity: newQuantity }
            }),
            index_1.prisma.inventoryAdjustment.create({
                data: {
                    productId: id,
                    userId,
                    quantity: adjustmentQuantity,
                    memo: memo || '재고 조정',
                    adjustmentType: adjustmentQuantity > 0 ? '입고' : '출고',
                }
            })
        ]);
        // 안전 재고 이하로 떨어졌는지 확인하고 알림 발송
        if (updatedProduct.quantity <= updatedProduct.safetyStock) {
            await (0, email_1.sendLowStockAlert)(updatedProduct.name, updatedProduct.sku, updatedProduct.quantity, updatedProduct.safetyStock);
        }
        return res.status(200).json({
            status: 'success',
            message: '재고가 성공적으로 조정되었습니다.',
            data: updatedProduct,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.adjustInventory = adjustInventory;
const moveProductLocation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { toLocation } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            throw new error_middleware_1.AppError('인증이 필요합니다.', 401);
        }
        // 제품 존재 확인
        const product = await index_1.prisma.product.findUnique({
            where: { id }
        });
        if (!product) {
            throw new error_middleware_1.AppError('제품을 찾을 수 없습니다.', 404);
        }
        const fromLocation = product.location;
        // 위치가 같으면 변경 불필요
        if (fromLocation === toLocation) {
            return res.status(400).json({
                status: 'error',
                message: '현재 위치와 동일합니다.'
            });
        }
        // 트랜잭션으로 위치 변경 및 이력 생성
        const [updatedProduct, locationHistory] = await index_1.prisma.$transaction([
            index_1.prisma.product.update({
                where: { id },
                data: { location: toLocation }
            }),
            index_1.prisma.locationHistory.create({
                data: {
                    productId: id,
                    userId,
                    fromLocation,
                    toLocation
                }
            })
        ]);
        return res.status(200).json({
            status: 'success',
            data: {
                product: updatedProduct,
                locationHistory
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.moveProductLocation = moveProductLocation;
const getLocationHistory = async (req, res, next) => {
    try {
        const { id } = req.params;
        // 제품 존재 확인
        const product = await index_1.prisma.product.findUnique({
            where: { id }
        });
        if (!product) {
            throw new error_middleware_1.AppError('제품을 찾을 수 없습니다.', 404);
        }
        // 위치 이력 조회
        const locationHistory = await index_1.prisma.locationHistory.findMany({
            where: { productId: id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { movedAt: 'desc' }
        });
        return res.status(200).json({
            status: 'success',
            data: locationHistory
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getLocationHistory = getLocationHistory;
const exportProducts = async (req, res, next) => {
    try {
        const { search, category, brand, location, lowStock } = req.query;
        const filters = {};
        if (search) {
            filters.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (category) {
            filters.category = category;
        }
        if (brand) {
            filters.brand = brand;
        }
        if (location) {
            filters.location = location;
        }
        if (lowStock === 'true') {
            filters.quantity = {
                lte: index_1.prisma.product.fields.safetyStock
            };
        }
        const products = await index_1.prisma.product.findMany({
            where: filters,
            orderBy: { updatedAt: 'desc' }
        });
        // CSV 형식으로 변환
        const header = 'ID,SKU,상품명,카테고리,브랜드,위치,수량,안전재고,단가,생성일,수정일\n';
        const rows = products.map((product) => {
            return `${product.id},${product.sku},"${product.name}",${product.category},${product.brand},${product.location},${product.quantity},${product.safetyStock},${product.price},${product.createdAt.toISOString()},${product.updatedAt.toISOString()}`;
        }).join('\n');
        const csv = header + rows;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
        return res.status(200).send(csv);
    }
    catch (error) {
        next(error);
    }
};
exports.exportProducts = exportProducts;
