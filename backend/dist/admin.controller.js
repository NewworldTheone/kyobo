"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSystemSetting = exports.updateSystemSetting = exports.getSystemSettings = exports.getInventoryPrediction = exports.deleteSalesRecord = exports.createSalesRecord = exports.getSalesData = void 0;
const index_1 = require("./index");
const error_middleware_1 = require("./error.middleware");
// Utility functions
const validateDate = (dateStr) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) ? date : null;
};
const validateNumber = (value, fieldName) => {
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
        throw new error_middleware_1.AppError(`유효하지 않은 ${fieldName}입니다.`, 400);
    }
    return num;
};
// 판매 데이터 관련 컨트롤러
const getSalesData = async (req, res, next) => {
    try {
        const { startDate, endDate, productId, category, brand } = req.query;
        const where = {};
        const include = {
            product: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        };
        // 날짜 필터
        if (startDate || endDate) {
            where.saleDate = {};
            if (startDate) {
                const start = validateDate(startDate);
                if (start)
                    where.saleDate.gte = start;
            }
            if (endDate) {
                const end = validateDate(endDate);
                if (end)
                    where.saleDate.lte = end;
            }
        }
        // 제품 필터
        if (productId)
            where.productId = productId;
        if (category || brand) {
            where.product = {};
            if (category)
                where.product.category = category;
            if (brand)
                where.product.brand = brand;
        }
        const salesData = await index_1.prisma.salesRecord.findMany({
            where,
            include,
            orderBy: { saleDate: 'desc' }
        });
        const totalSales = salesData.reduce((sum, record) => sum + record.amount, 0);
        const totalQuantity = salesData.reduce((sum, record) => sum + record.quantity, 0);
        return res.status(200).json({
            status: 'success',
            data: {
                records: salesData,
                stats: {
                    totalSales,
                    totalQuantity,
                    recordCount: salesData.length
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getSalesData = getSalesData;
const createSalesRecord = async (req, res, next) => {
    try {
        const { productId, quantity, amount, saleDate } = req.body;
        const userId = req.user.id;
        // 입력값 검증
        const parsedQuantity = validateNumber(quantity, '수량');
        const parsedAmount = validateNumber(amount, '금액');
        // 제품 확인
        const product = await index_1.prisma.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new error_middleware_1.AppError('제품을 찾을 수 없습니다.', 404);
        }
        if (product.quantity < parsedQuantity) {
            throw new error_middleware_1.AppError('재고가 부족합니다.', 400);
        }
        // 트랜잭션으로 처리
        const [salesRecord, updatedProduct] = await index_1.prisma.$transaction([
            index_1.prisma.salesRecord.create({
                data: {
                    productId,
                    userId,
                    quantity: parsedQuantity,
                    amount: parsedAmount,
                    saleDate: saleDate ? new Date(saleDate) : new Date()
                }
            }),
            index_1.prisma.product.update({
                where: { id: productId },
                data: {
                    quantity: {
                        decrement: parsedQuantity
                    }
                }
            }),
            index_1.prisma.inventoryAdjustment.create({
                data: {
                    productId,
                    userId,
                    quantity: -parsedQuantity,
                    memo: `판매 기록 생성`,
                    adjustmentType: '판매',
                }
            })
        ]);
        return res.status(201).json({
            status: 'success',
            message: '판매 기록이 성공적으로 생성되었습니다.',
            data: {
                salesRecord,
                updatedProduct
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createSalesRecord = createSalesRecord;
const deleteSalesRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const salesRecord = await index_1.prisma.salesRecord.findUnique({
            where: { id }
        });
        if (!salesRecord) {
            throw new error_middleware_1.AppError('판매 기록을 찾을 수 없습니다.', 404);
        }
        // 트랜잭션으로 처리
        const [_, updatedProduct] = await index_1.prisma.$transaction([
            index_1.prisma.salesRecord.delete({
                where: { id }
            }),
            index_1.prisma.product.update({
                where: { id: salesRecord.productId },
                data: {
                    quantity: {
                        increment: salesRecord.quantity
                    }
                }
            }),
            index_1.prisma.inventoryAdjustment.create({
                data: {
                    productId: salesRecord.productId,
                    userId: req.user.id,
                    quantity: salesRecord.quantity,
                    memo: `판매 취소: ${id}`,
                    adjustmentType: '판매 취소',
                }
            })
        ]);
        return res.status(200).json({
            status: 'success',
            message: '판매 기록이 성공적으로 삭제되었습니다. 재고가 복원되었습니다.',
            data: updatedProduct
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSalesRecord = deleteSalesRecord;
const getInventoryPrediction = async (req, res, next) => {
    try {
        const { productId, days = '30', category } = req.query;
        const lookAheadDays = parseInt(days);
        if (isNaN(lookAheadDays) || lookAheadDays <= 0) {
            throw new error_middleware_1.AppError('유효한 예측 기간(days)이 필요합니다.', 400);
        }
        // 단일 제품 예측
        if (productId) {
            const product = await index_1.prisma.product.findUnique({
                where: { id: productId },
                include: {
                    salesRecords: {
                        orderBy: { saleDate: 'desc' },
                        take: 90,
                    },
                },
            });
            if (!product) {
                throw new error_middleware_1.AppError('제품을 찾을 수 없습니다.', 404);
            }
            const salesQuantities = product.salesRecords.map(record => record.quantity);
            if (salesQuantities.length === 0) {
                return res.status(200).json({
                    status: 'success',
                    data: {
                        productId: product.id,
                        productName: product.name,
                        predictedDemand: 0,
                        currentStock: product.quantity,
                        suggestedOrderQuantity: 0,
                        needsReorder: false,
                    },
                });
            }
            const avgDailySales = salesQuantities.reduce((sum, q) => sum + q, 0) / salesQuantities.length;
            const predictedDemand = Math.ceil(avgDailySales * lookAheadDays);
            const suggestedOrderQuantity = Math.max(0, predictedDemand - product.quantity + product.safetyStock);
            const needsReorder = product.quantity <= product.safetyStock || suggestedOrderQuantity > 0;
            return res.status(200).json({
                status: 'success',
                data: {
                    productId: product.id,
                    productName: product.name,
                    predictedDemand,
                    currentStock: product.quantity,
                    suggestedOrderQuantity,
                    needsReorder,
                },
            });
        }
        // 모든 제품 예측
        const where = {};
        if (category) {
            where.category = category;
        }
        const products = await index_1.prisma.product.findMany({
            where,
            include: {
                salesRecords: {
                    orderBy: { saleDate: 'desc' },
                    take: 90,
                },
            },
        });
        const predictions = products.map(product => {
            const salesQuantities = product.salesRecords.map(record => record.quantity);
            if (salesQuantities.length === 0) {
                return {
                    productId: product.id,
                    productName: product.name,
                    category: product.category,
                    predictedDemand: 0,
                    currentStock: product.quantity,
                    suggestedOrderQuantity: 0,
                    needsReorder: product.quantity <= product.safetyStock,
                };
            }
            const avgDailySales = salesQuantities.reduce((sum, q) => sum + q, 0) / salesQuantities.length;
            const predictedDemand = Math.ceil(avgDailySales * lookAheadDays);
            const suggestedOrderQuantity = Math.max(0, predictedDemand - product.quantity + product.safetyStock);
            const needsReorder = product.quantity <= product.safetyStock || suggestedOrderQuantity > 0;
            return {
                productId: product.id,
                productName: product.name,
                category: product.category,
                predictedDemand,
                currentStock: product.quantity,
                suggestedOrderQuantity,
                needsReorder,
            };
        });
        return res.status(200).json({
            status: 'success',
            data: predictions,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getInventoryPrediction = getInventoryPrediction;
const getSystemSettings = async (req, res, next) => {
    try {
        const settings = await index_1.prisma.systemSettings.findMany({});
        // 프론트엔드에서 기대하는 객체 형태로 변환
        const settingsObject = settings.reduce((acc, setting) => {
            acc[setting.settingKey] = {
                value: setting.settingValue,
                type: setting.settingType,
                description: setting.description
            };
            return acc;
        }, {});
        return res.status(200).json({
            status: 'success',
            data: settingsObject,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getSystemSettings = getSystemSettings;
const updateSystemSetting = async (req, res, next) => {
    try {
        const { key } = req.params;
        const { value, description, type } = req.body;
        // upsert를 사용하여 설정이 없으면 생성, 있으면 업데이트
        const updatedSetting = await index_1.prisma.systemSettings.upsert({
            where: { settingKey: key },
            update: {
                settingValue: String(value),
                description: description ?? undefined,
                settingType: type ?? 'string',
            },
            create: {
                settingKey: key,
                settingValue: String(value),
                description: description ?? undefined,
                settingType: type ?? 'string',
            },
        });
        return res.status(200).json({
            status: 'success',
            message: '설정이 성공적으로 업데이트되었습니다.',
            data: updatedSetting,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSystemSetting = updateSystemSetting;
const deleteSystemSetting = async (req, res, next) => {
    try {
        const { key } = req.params;
        const existingSetting = await index_1.prisma.systemSettings.findUnique({
            where: { settingKey: key },
        });
        if (!existingSetting) {
            throw new error_middleware_1.AppError('설정 키를 찾을 수 없습니다.', 404);
        }
        await index_1.prisma.systemSettings.delete({
            where: { settingKey: key },
        });
        return res.status(200).json({
            status: 'success',
            message: '설정이 성공적으로 삭제되었습니다.',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSystemSetting = deleteSystemSetting;
