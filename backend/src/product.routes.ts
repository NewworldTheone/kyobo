import express, { NextFunction } from 'express';
import { authenticate, authorizeAdmin } from './auth.middleware';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustInventory,
  moveProductLocation,
  getLocationHistory,
  exportProducts
} from './product.controller';
import { bulkUploadProducts } from './upload.controller';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// uploads 디렉토리가 없으면 생성
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer 설정 - 메모리 스토리지로 변경 (작은 파일에 적합)
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // MIME 타입 체크
    const allowedMimeTypes = ['text/csv', 'application/csv', 'application/vnd.ms-excel', 'text/plain'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedMimeTypes.includes(file.mimetype) || fileExtension === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('CSV 파일만 업로드 가능합니다.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB 제한
  }
});

// 샘플 CSV 다운로드 - 정적 라우트를 먼저 배치
router.get('/sample-csv', (req, res) => {
  const csvContent = `name,sku,category,brand,location,quantity,safetyStock,price,description
샘플상품1,SKU001,전자제품,삼성,창고A,100,10,50000,샘플 상품 설명1
샘플상품2,SKU002,가전제품,LG,창고B,50,5,75000,샘플 상품 설명2
샘플상품3,SKU003,의류,나이키,창고C,200,20,120000,샘플 상품 설명3`;
  
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="products_sample.csv"');
  res.setHeader('Cache-Control', 'no-cache');
  res.send('\uFEFF' + csvContent); // BOM 추가로 한글 인코딩 문제 해결
});

// 대량 업로드 - /bulk 경로로 변경하고 동적 라우트보다 먼저 배치
router.post('/bulk', authenticate, authorizeAdmin, upload.single('file'), async (req, res, next: NextFunction) => {
  try {
    console.log('Bulk upload endpoint hit');
    console.log('File:', req.file);
    console.log('Headers:', req.headers);
    
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: '파일이 업로드되지 않았습니다.',
        error: '파일을 선택해주세요.'
      });
    }

    // 메모리에서 파일 저장
    const tempFilePath = path.join(uploadsDir, `temp-${Date.now()}-${req.file.originalname}`);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    // req.file.path를 설정 (upload.controller.ts에서 사용)
    req.file.path = tempFilePath;

    // bulkUploadProducts 함수 호출
    await bulkUploadProducts(req, res, next); // next 추가
  } catch (error: any) {
    console.error('Bulk upload route error:', error);

    // 오류 발생 시 임시 파일 삭제
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          status: 'error',
          message: '파일 크기가 너무 큽니다.',
          error: '파일 크기는 10MB를 초과할 수 없습니다.'
        });
      }
      return res.status(400).json({
        status: 'error',
        message: '파일 업로드 오류',
        error: error.message
      });
    }
    
    // next(error); // 에러 미들웨어로 전달
    return res.status(500).json({
      status: 'error',
      message: '대량 업로드 중 오류가 발생했습니다.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 제품 조회 및 검색
router.get('/', authenticate, getAllProducts);
router.get('/export', authenticate, exportProducts);

// 동적 라우트는 정적 라우트 뒤에 배치
router.get('/:id', authenticate, getProductById);
router.get('/:id/location-history', authenticate, getLocationHistory);

// 제품 생성, 수정, 삭제 (관리자 권한 필요)
router.post('/', authenticate, authorizeAdmin, createProduct);
router.put('/:id', authenticate, authorizeAdmin, updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

// 재고 조정 및 위치 변경
router.post('/:id/adjust', authenticate, adjustInventory);
router.post('/:id/move', authenticate, moveProductLocation);

export default router;