import { Request, Response, NextFunction } from 'express';
import { prisma } from './index';
import { Prisma } from '@prisma/client';
import { AppError } from './error.middleware';

// Types
interface SalesFilter {
  startDate?: string;
  endDate?: string;
  productId?: string;
  category?: string;
  brand?: string;
}

interface SalesRecord {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  amount: number;
  saleDate: Date;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  safetyStock: number;
  category: string;
  brand: string;
  salesRecords: Array<{
    quantity: number;
    saleDate: Date;
  }>;
  inventoryAdjustments: Array<{
    quantity: number;
    createdAt: Date;
  }>;
}

interface SystemSetting {
  id: string;
  settingKey: string;
  settingValue: string;
  settingType: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Utility functions
const validateDate = (dateStr: string): Date | null => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) ? date : null;
};

const validateNumber = (value: any, fieldName: string): number => {
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    throw new AppError(`유효하지 않은 ${fieldName}입니다.`, 400);
  }
  return num;
};

// 판매 데이터 관련 컨트롤러
export const getSalesData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, productId, category, brand } = req.query as SalesFilter;
    
    const where: Prisma.SalesRecordWhereInput = {};
    const include: Prisma.SalesRecordInclude = {
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
        if (start) where.saleDate.gte = start;
      }
      if (endDate) {
        const end = validateDate(endDate);
        if (end) where.saleDate.lte = end;
      }
    }
    
    // 제품 필터
    if (productId) where.productId = productId;
    
    if (category || brand) {
      where.product = {};
      if (category) where.product.category = category;
      if (brand) where.product.brand = brand;
    }
    
    const salesData = await prisma.salesRecord.findMany({
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
  } catch (error) {
    next(error);
  }
};

export const createSalesRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity, amount, saleDate } = req.body;
    const userId = req.user!.id;
    
    // 입력값 검증
    const parsedQuantity = validateNumber(quantity, '수량');
    const parsedAmount = validateNumber(amount, '금액');
    
    // 제품 확인
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      throw new AppError('제품을 찾을 수 없습니다.', 404);
    }
    
    if (product.quantity < parsedQuantity) {
      throw new AppError('재고가 부족합니다.', 400);
    }
    
    // 트랜잭션으로 처리
    const [salesRecord, updatedProduct] = await prisma.$transaction([
      prisma.salesRecord.create({
        data: {
          productId,
          userId,
          quantity: parsedQuantity,
          amount: parsedAmount,
          saleDate: saleDate ? new Date(saleDate) : new Date()
        }
      }),
      prisma.product.update({
        where: { id: productId },
        data: {
          quantity: {
            decrement: parsedQuantity
          }
        }
      }),
      prisma.inventoryAdjustment.create({
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
  } catch (error) {
    next(error);
  }
};

export const deleteSalesRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const salesRecord = await prisma.salesRecord.findUnique({
      where: { id }
    });
    
    if (!salesRecord) {
      throw new AppError('판매 기록을 찾을 수 없습니다.', 404);
    }
    
    // 트랜잭션으로 처리
    const [_, updatedProduct] = await prisma.$transaction([
      prisma.salesRecord.delete({
        where: { id }
      }),
      prisma.product.update({
        where: { id: salesRecord.productId },
        data: {
          quantity: {
            increment: salesRecord.quantity
          }
        }
      }),
      prisma.inventoryAdjustment.create({
        data: {
          productId: salesRecord.productId,
          userId: req.user!.id,
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
  } catch (error) {
    next(error);
  }
};

export const getInventoryPrediction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, days = '30', category } = req.query;
    const lookAheadDays = parseInt(days as string);

    if (isNaN(lookAheadDays) || lookAheadDays <= 0) {
      throw new AppError('유효한 예측 기간(days)이 필요합니다.', 400);
    }

    // 단일 제품 예측
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId as string },
        include: {
          salesRecords: {
            orderBy: { saleDate: 'desc' },
            take: 90,
          },
        },
      });

      if (!product) {
        throw new AppError('제품을 찾을 수 없습니다.', 404);
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
    const where: Prisma.ProductWhereInput = {};
    if (category) {
      where.category = category as string;
    }

    const products = await prisma.product.findMany({
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
  } catch (error) {
    next(error);
  }
};

export const getSystemSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await prisma.systemSettings.findMany({});

    // 프론트엔드에서 기대하는 객체 형태로 변환
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.settingKey] = {
        value: setting.settingValue,
        type: setting.settingType,
        description: setting.description
      };
      return acc;
    }, {} as Record<string, any>);

    return res.status(200).json({
      status: 'success',
      data: settingsObject,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSystemSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    const { value, description, type } = req.body;

    // upsert를 사용하여 설정이 없으면 생성, 있으면 업데이트
    const updatedSetting = await prisma.systemSettings.upsert({
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
  } catch (error) {
    next(error);
  }
};

export const deleteSystemSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;

    const existingSetting = await prisma.systemSettings.findUnique({
      where: { settingKey: key },
    });

    if (!existingSetting) {
      throw new AppError('설정 키를 찾을 수 없습니다.', 404);
    }

    await prisma.systemSettings.delete({
      where: { settingKey: key },
    });

    return res.status(200).json({
      status: 'success',
      message: '설정이 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, startDate, endDate } = req.query;
    
    if (!type) {
      throw new AppError('리포트 타입이 필요합니다.', 400);
    }
    
    let reportData;
    
    switch (type) {
      case 'sales':
        // 판매 리포트
        reportData = await prisma.salesRecord.findMany({
          where: {
            saleDate: {
              gte: startDate ? new Date(startDate as string) : undefined,
              lte: endDate ? new Date(endDate as string) : undefined,
            },
          },
          include: {
            product: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            saleDate: 'desc',
          },
        });
        break;
        
      case 'inventory':
        // 재고 리포트
        reportData = await prisma.product.findMany({
          where: {
            ...(startDate || endDate ? {
              inventoryAdjustments: {
                some: {
                  createdAt: {
                    gte: startDate ? new Date(startDate as string) : undefined,
                    lte: endDate ? new Date(endDate as string) : undefined,
                  },
                },
              },
            } : {}),
          },
          include: {
            inventoryAdjustments: {
              where: {
                createdAt: {
                  gte: startDate ? new Date(startDate as string) : undefined,
                  lte: endDate ? new Date(endDate as string) : undefined,
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
            // Remove location include since it's not defined in the Prisma schema
          },
        });
        break;
        
      default:
        throw new AppError('지원하지 않는 리포트 타입입니다.', 400);
    }
    
    return res.status(200).json({
      status: 'success',
      data: reportData,
    });
  } catch (error) {
    next(error);
  }
};

