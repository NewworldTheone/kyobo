"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsByLayout = exports.getProductLocationHistory = exports.updateProductLocation = exports.deleteLayout = exports.updateLayout = exports.createLayout = exports.getLayoutById = exports.getLayouts = void 0;
const index_1 = require("./index");
const error_middleware_1 = require("./error.middleware"); // Import AppError
const client_1 = require("@prisma/client"); // Import Prisma
// 매장/창고 레이아웃 관련 컨트롤러
const getLayouts = async (req, res, next) => {
    try {
        const layouts = await index_1.prisma.storeLayout.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        return res.status(200).json({
            status: 'success',
            data: layouts
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getLayouts = getLayouts;
const getLayoutById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const layout = await index_1.prisma.storeLayout.findUnique({
            where: { id }
        });
        if (!layout) {
            throw new error_middleware_1.AppError('레이아웃을 찾을 수 없습니다.', 404);
        }
        return res.status(200).json({
            status: 'success',
            data: layout
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getLayoutById = getLayoutById;
const createLayout = async (req, res, next) => {
    try {
        const { name, description, width, height, sections } = req.body;
        const layout = await index_1.prisma.storeLayout.create({
            data: {
                name,
                description,
                width: parseInt(width) || 20,
                height: parseInt(height) || 20,
                sections: sections || {},
                imageUrl: null
            }
        });
        return res.status(201).json({
            status: 'success',
            message: '레이아웃이 성공적으로 생성되었습니다.',
            data: layout
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createLayout = createLayout;
const updateLayout = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, width, height, sections } = req.body;
        const layout = await index_1.prisma.storeLayout.findUnique({
            where: { id }
        });
        if (!layout) {
            throw new error_middleware_1.AppError('레이아웃을 찾을 수 없습니다.', 404);
        }
        const updatedLayout = await index_1.prisma.storeLayout.update({
            where: { id },
            data: {
                name: name || undefined,
                description: description || undefined,
                width: width ? parseInt(width) : undefined,
                height: height ? parseInt(height) : undefined,
                sections: sections || undefined
            }
        });
        return res.status(200).json({
            status: 'success',
            message: '레이아웃이 성공적으로 업데이트되었습니다.',
            data: updatedLayout
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateLayout = updateLayout;
const deleteLayout = async (req, res, next) => {
    try {
        const { id } = req.params;
        const layout = await index_1.prisma.storeLayout.findUnique({
            where: { id }
        });
        if (!layout) {
            throw new error_middleware_1.AppError('레이아웃을 찾을 수 없습니다.', 404);
        }
        await index_1.prisma.storeLayout.delete({
            where: { id }
        });
        return res.status(200).json({
            status: 'success',
            message: '레이아웃이 성공적으로 삭제되었습니다.'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteLayout = deleteLayout;
// 제품 위치 관리 컨트롤러
const updateProductLocation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { location, coordinates } = req.body; // Explicitly type coordinates
        const userId = req.user.id; // 인증 미들웨어에서 설정된 사용자 ID
        // 제품 존재 여부 확인
        const product = await index_1.prisma.product.findUnique({
            where: { id }
        });
        if (!product) {
            throw new error_middleware_1.AppError('제품을 찾을 수 없습니다.', 404);
        }
        // 위치 이력 생성
        await index_1.prisma.locationHistory.create({
            data: {
                productId: id,
                userId,
                fromLocation: product.location,
                toLocation: location,
                fromCoordinates: product.coordinates ?? undefined,
                toCoordinates: coordinates === null ? client_1.Prisma.JsonNull : coordinates, // Explicitly handle null for history
            }
        });
        // 제품 위치 업데이트
        const updateData = {
            location,
        };
        if (coordinates !== undefined) {
            if (coordinates === null) {
                updateData.coordinates = client_1.Prisma.JsonNull;
            }
            else {
                updateData.coordinates = coordinates;
            }
        }
        const updatedProduct = await index_1.prisma.product.update({
            where: { id },
            data: updateData,
        });
        return res.status(200).json({
            status: 'success',
            message: '제품 위치가 성공적으로 업데이트되었습니다.',
            data: updatedProduct
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProductLocation = updateProductLocation;
const getProductLocationHistory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { limit } = req.query;
        // 제품 존재 여부 확인
        const product = await index_1.prisma.product.findUnique({
            where: { id }
        });
        if (!product) {
            throw new error_middleware_1.AppError('제품을 찾을 수 없습니다.', 404);
        }
        // 위치 이력 조회
        const history = await index_1.prisma.locationHistory.findMany({
            where: { productId: id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { movedAt: 'desc' },
            take: limit ? parseInt(limit) : undefined
        });
        return res.status(200).json({
            status: 'success',
            data: history
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductLocationHistory = getProductLocationHistory;
// 매장/창고 내 제품 위치 조회
const getProductsByLayout = async (req, res, next) => {
    try {
        const { layoutId } = req.params;
        const layout = await index_1.prisma.storeLayout.findUnique({
            where: { id: layoutId },
        });
        if (!layout) {
            throw new error_middleware_1.AppError('레이아웃을 찾을 수 없습니다.', 404);
        }
        const products = await index_1.prisma.product.findMany({
            where: {
                location: layout.name, // 레이아웃 이름과 제품 위치를 연결
                coordinates: { not: client_1.Prisma.JsonNull }, // 좌표 정보가 있는 제품만
            },
        });
        return res.status(200).json({
            status: 'success',
            data: products,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductsByLayout = getProductsByLayout;
