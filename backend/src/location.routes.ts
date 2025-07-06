import express from 'express';
import { 
  getLayouts, 
  getLayoutById, 
  createLayout, 
  updateLayout, 
  deleteLayout,
  updateProductLocation,
  getProductLocationHistory,
  getProductsByLayout
} from './location.controller';
import { authenticate, authorize } from './auth.middleware';

const router = express.Router();

// 레이아웃 관련 라우트
router.get('/layouts', authenticate, getLayouts);
router.get('/layouts/:id', authenticate, getLayoutById);
router.post('/layouts', authenticate, authorize(['admin']), createLayout);
router.put('/layouts/:id', authenticate, authorize(['admin']), updateLayout);
router.delete('/layouts/:id', authenticate, authorize(['admin']), deleteLayout);

// 제품 위치 관련 라우트
router.put('/products/:id/location', authenticate, updateProductLocation);
router.get('/products/:id/history', authenticate, getProductLocationHistory);
router.get('/layouts/:layoutId/products', authenticate, getProductsByLayout);

export default router;
