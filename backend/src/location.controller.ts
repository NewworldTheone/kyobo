import { Request, Response, NextFunction } from 'express';
import { prisma } from './index';
import { AppError } from './error.middleware'; // Import AppError
import { Prisma } from '@prisma/client'; // Import Prisma

// 매장/창고 레이아웃 관련 컨트롤러
export const getLayouts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const layouts = await prisma.storeLayout.findMany({
      orderBy: { updatedAt: 'desc' }
    });

    return res.status(200).json({
      status: 'success',
      data: layouts
    });
  } catch (error) {
    next(error);
  }
};

export const getLayoutById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const layout = await prisma.storeLayout.findUnique({
      where: { id }
    });

    if (!layout) {
      throw new AppError('레이아웃을 찾을 수 없습니다.', 404);
    }

    return res.status(200).json({
      status: 'success',
      data: layout
    });
  } catch (error) {
    next(error);
  }
};

export const createLayout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, width, height, sections, imageUrl } = req.body;

    const layout = await prisma.storeLayout.create({
      data: {
        name,
        description,
        width: parseInt(width) || 20,
        height: parseInt(height) || 20,
        sections: sections || {},
        imageUrl: imageUrl || null
      }
    });

    return res.status(201).json({
      status: 'success',
      message: '레이아웃이 성공적으로 생성되었습니다.',
      data: layout
    });
  } catch (error) {
    next(error);
  }
};

export const updateLayout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, width, height, sections, imageUrl } = req.body;

    const layout = await prisma.storeLayout.findUnique({
      where: { id }
    });

    if (!layout) {
      throw new AppError('레이아웃을 찾을 수 없습니다.', 404);
    }

    const updatedLayout = await prisma.storeLayout.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description || undefined,
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
        sections: sections || undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined
      }
    });

    return res.status(200).json({
      status: 'success',
      message: '레이아웃이 성공적으로 업데이트되었습니다.',
      data: updatedLayout
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLayout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const layout = await prisma.storeLayout.findUnique({
      where: { id }
    });

    if (!layout) {
      throw new AppError('레이아웃을 찾을 수 없습니다.', 404);
    }

    await prisma.storeLayout.delete({
      where: { id }
    });

    return res.status(200).json({
      status: 'success',
      message: '레이아웃이 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    next(error);
  }
};

// 제품 위치 관리 컨트롤러
export const updateProductLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { location, coordinates } = req.body as { location: string; coordinates: Record<string, any> | null | undefined }; // Explicitly type coordinates
    const userId = req.user!.id; // 인증 미들웨어에서 설정된 사용자 ID

    // 제품 존재 여부 확인
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      throw new AppError('제품을 찾을 수 없습니다.', 404);
    }

    // 위치 이력 생성
    await prisma.locationHistory.create({
      data: {
        productId: id,
        userId,
        fromLocation: product.location,
        toLocation: location,
        fromCoordinates: product.coordinates ?? undefined,
        toCoordinates: coordinates === null ? Prisma.JsonNull : coordinates, // Explicitly handle null for history
      }
    });

    // 제품 위치 업데이트
    const updateData: Prisma.ProductUpdateInput = {
      location,
    };

    if (coordinates !== undefined) {
      if (coordinates === null) {
        updateData.coordinates = Prisma.JsonNull;
      } else {
        updateData.coordinates = coordinates;
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      status: 'success',
      message: '제품 위치가 성공적으로 업데이트되었습니다.',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

export const getProductLocationHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { limit } = req.query;

    // 제품 존재 여부 확인
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      throw new AppError('제품을 찾을 수 없습니다.', 404);
    }

    // 위치 이력 조회
    const history = await prisma.locationHistory.findMany({
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
      take: limit ? parseInt(limit as string) : undefined
    });

    return res.status(200).json({
      status: 'success',
      data: history
    });
  } catch (error) {
    next(error);
  }
};

// 매장/창고 내 제품 위치 조회
export const getProductsByLayout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { layoutId } = req.params;

    const layout = await prisma.storeLayout.findUnique({
      where: { id: layoutId },
    });

    if (!layout) {
      throw new AppError('레이아웃을 찾을 수 없습니다.', 404);
    }

    const products = await prisma.product.findMany({
      where: {
        location: layout.name, // 레이아웃 이름과 제품 위치를 연결
        coordinates: { not: Prisma.JsonNull }, // 좌표 정보가 있는 제품만
      },
    });

    return res.status(200).json({
      status: 'success',
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
