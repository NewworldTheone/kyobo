import express from 'express';
import { uploadProductImage, uploadLayoutImage, deleteImage, upload } from './image.controller';
import { authenticate, authorize } from './auth.middleware';

const router = express.Router();

// 제품 이미지 업로드 (제품 사진 또는 위치 사진)
router.post(
  '/product',
  authenticate,
  upload.single('image'),
  uploadProductImage
);

// 매장/창고 레이아웃 이미지 업로드
router.post(
  '/layout',
  authenticate,
  authorize(['admin']),
  upload.single('image'),
  uploadLayoutImage
);

// 이미지 삭제
router.delete(
  '/',
  authenticate,
  deleteImage
);

export default router;
