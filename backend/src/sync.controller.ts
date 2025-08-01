import { Request, Response, NextFunction } from 'express';
import { prisma } from './index';
import { AppError } from './error.middleware';

// 오프라인 모드에서 저장된 작업을 동기화하는 API
export const syncOfflineActions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { actions } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError('인증이 필요합니다.', 401);
    }
    
    if (!Array.isArray(actions) || actions.length === 0) {
      throw new AppError('동기화할 작업이 없습니다.', 400);
    }
    
    const results = [];
    const errors = [];
    
    // 각 작업을 순차적으로 처리
    for (const action of actions) {
      try {
        const { type, data, timestamp } = action;
        
        switch (type) {
          case 'ADJUST_INVENTORY': {
            const { productId, quantity, memo } = data;
            
            // 제품 존재 확인
            const product = await prisma.product.findUnique({
              where: { id: productId }
            });
            
            if (!product) {
              errors.push({
                action,
                error: new AppError(`제품 ID ${productId}를 찾을 수 없습니다.`, 404)
              });
              continue;
            }
            
            const adjustmentQuantity = parseFloat(quantity);

            if (isNaN(adjustmentQuantity)) {
              errors.push({
                action,
                error: new AppError('수량이 올바르지 않습니다.', 400)
              });
              continue;
            }

            const newQuantity = product.quantity + adjustmentQuantity;
            
            if (newQuantity < 0) {
              errors.push({
                action,
                error: new AppError('재고가 부족합니다.', 400)
              });
              continue;
            }
            
            // 트랜잭션으로 재고 조정 및 이력 생성
            const [updatedProduct, adjustment] = await prisma.$transaction([
              prisma.product.update({
                where: { id: productId },
                data: { quantity: newQuantity }
              }),
              prisma.inventoryAdjustment.create({
                data: {
                  productId,
                  userId,
                  quantity: adjustmentQuantity,
                  memo,
                  adjustmentType: adjustmentQuantity > 0 ? '입고' : '출고',
                  createdAt: new Date(timestamp)
                }
              })
            ]);
            
            results.push({
              type,
              data: { product: updatedProduct, adjustment },
              success: true
            });
            break;
          }
          
          case 'MOVE_LOCATION': {
            const { productId, toLocation } = data;
            
            // 제품 존재 확인
            const product = await prisma.product.findUnique({
              where: { id: productId }
            });
            
            if (!product) {
              errors.push({
                action,
                error: new AppError(`제품 ID ${productId}를 찾을 수 없습니다.`, 404)
              });
              continue;
            }
            
            const fromLocation = product.location;
            
            // 위치가 같으면 변경 불필요
            if (fromLocation === toLocation) {
              results.push({
                type,
                data: { product, locationHistory: null },
                success: true,
                message: '현재 위치와 동일하여 변경하지 않았습니다.'
              });
              continue;
            }
            
            // 트랜잭션으로 위치 변경 및 이력 생성
            const [updatedProduct, locationHistory] = await prisma.$transaction([
              prisma.product.update({
                where: { id: productId },
                data: { location: toLocation }
              }),
              prisma.locationHistory.create({
                data: {
                  productId,
                  userId,
                  fromLocation,
                  toLocation,
                  movedAt: new Date(timestamp)
                }
              })
            ]);
            
            results.push({
              type,
              data: { product: updatedProduct, locationHistory },
              success: true
            });
            break;
          }
          
          default:
            errors.push({
              action,
              error: new AppError(`알 수 없는 작업 유형: ${type}`, 400)
            });
        }
      } catch (error) {
        console.error('작업 처리 오류:', error);
        errors.push({
          action,
          error: new AppError('작업 처리 중 오류가 발생했습니다.', 500)
        });
      }
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        successCount: results.length,
        errorCount: errors.length,
        results,
        errors: errors.length > 0 ? errors : undefined
      }
    });
  } catch (error) {
    next(error);
  }
};
