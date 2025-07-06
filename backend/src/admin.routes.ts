import express from 'express';
import { 
  getSalesData, 
  createSalesRecord, 
  deleteSalesRecord,
  getInventoryPrediction,
  getSystemSettings,
  updateSystemSetting,
  deleteSystemSetting,
  getReports
} from './admin.controller';
import { authenticate, authorize } from './auth.middleware';

const router = express.Router();

// 판매 데이터 관련 라우트
router.get('/sales', authenticate, getSalesData);
router.post('/sales', authenticate, createSalesRecord);
router.delete('/sales/:id', authenticate, authorize(['admin']), deleteSalesRecord);

// 재고 예측 관련 라우트
router.get('/predictions', authenticate, getInventoryPrediction);

// 시스템 설정 관련 라우트
router.get('/settings', authenticate, authorize(['admin']), getSystemSettings);
router.put('/settings/:key', authenticate, authorize(['admin']), updateSystemSetting);
router.delete('/settings/:key', authenticate, authorize(['admin']), deleteSystemSetting);

// 리포트 관련 라우트
router.get('/reports', authenticate, getReports);

export default router;
