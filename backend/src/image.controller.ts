import { Request, Response } from 'express';
import { prisma } from './index';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import multer from 'multer';

// 이미지 저장 디렉토리 설정
const UPLOAD_DIR = path.join(__dirname, '../../uploads');
const PRODUCT_IMAGES_DIR = path.join(UPLOAD_DIR, 'products');
const LOCATION_IMAGES_DIR = path.join(UPLOAD_DIR, 'locations');

// 디렉토리가 없으면 생성
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(PRODUCT_IMAGES_DIR)) {
  fs.mkdirSync(PRODUCT_IMAGES_DIR, { recursive: true });
}
if (!fs.existsSync(LOCATION_IMAGES_DIR)) {
  fs.mkdirSync(LOCATION_IMAGES_DIR, { recursive: true });
}

// 이미지 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const imageType = req.body.imageType || 'product';
    const destDir = imageType === 'location' ? LOCATION_IMAGES_DIR : PRODUCT_IMAGES_DIR;
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
  fileFilter: (req, file, cb) => {
    // 이미지 파일만 허용
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
    cb(null, true);
  }
});

// 이미지 리사이징 및 저장 함수
const resizeAndSaveImage = async (file: Express.Multer.File, width: number = 800): Promise<string> => {
  const resizedFilename = `resized-${file.filename}`;
  const resizedPath = path.join(path.dirname(file.path), resizedFilename);
  
  await sharp(file.path)
    .resize(width)
    .jpeg({ quality: 80 })
    .toFile(resizedPath);
  
  // 원본 파일 삭제
  fs.unlinkSync(file.path);
  
  return resizedFilename;
};

// 제품 이미지 업로드 컨트롤러
export const uploadProductImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: '이미지 파일이 업로드되지 않았습니다.'
      });
    }

    const { productId, imageType } = req.body;

    if (!productId) {
      // 파일 삭제
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        status: 'error',
        message: '제품 ID가 필요합니다.'
      });
    }

    // 제품 존재 여부 확인
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      // 파일 삭제
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        status: 'error',
        message: '제품을 찾을 수 없습니다.'
      });
    }

    // 이미지 리사이징
    const resizedFilename = await resizeAndSaveImage(req.file);
    
    // 이미지 타입에 따라 DB 업데이트
    const isLocationImage = imageType === 'location';
    const updateData = isLocationImage 
      ? { locationImage: resizedFilename }
      : { productImage: resizedFilename };
    
    // 제품 정보 업데이트
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData
    });

    return res.status(200).json({
      status: 'success',
      message: '이미지가 성공적으로 업로드되었습니다.',
      data: {
        product: updatedProduct,
        imageUrl: `/uploads/${isLocationImage ? 'locations' : 'products'}/${resizedFilename}`
      }
    });
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    // 에러 발생 시 파일이 존재하면 삭제
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      status: 'error',
      message: '이미지 업로드 중 오류가 발생했습니다.'
    });
  }
};

// 매장/창고 레이아웃 이미지 업로드 컨트롤러
export const uploadLayoutImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: '이미지 파일이 업로드되지 않았습니다.'
      });
    }

    const { layoutId, name, description, width, height } = req.body;

    // 이미지 리사이징 (레이아웃은 더 큰 해상도로 유지)
    const resizedFilename = await resizeAndSaveImage(req.file, 1200);
    
    let storeLayout;
    
    if (layoutId) {
      // 기존 레이아웃 업데이트
      storeLayout = await prisma.storeLayout.update({
        where: { id: layoutId },
        data: {
          name: name || undefined,
          description: description || undefined,
          imageUrl: resizedFilename,
          width: width ? parseInt(width) : undefined,
          height: height ? parseInt(height) : undefined,
        }
      });
    } else {
      // 새 레이아웃 생성
      storeLayout = await prisma.storeLayout.create({
        data: {
          name: name || '새 레이아웃',
          description: description || '',
          imageUrl: resizedFilename,
          width: width ? parseInt(width) : 20,
          height: height ? parseInt(height) : 20,
          sections: {} // 빈 섹션으로 시작
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      message: '레이아웃 이미지가 성공적으로 업로드되었습니다.',
      data: {
        layout: storeLayout,
        imageUrl: `/uploads/locations/${resizedFilename}`
      }
    });
  } catch (error) {
    console.error('레이아웃 이미지 업로드 오류:', error);
    // 에러 발생 시 파일이 존재하면 삭제
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      status: 'error',
      message: '레이아웃 이미지 업로드 중 오류가 발생했습니다.'
    });
  }
};

// 이미지 삭제 컨트롤러
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { productId, imageType } = req.body;

    if (!productId || !imageType) {
      return res.status(400).json({
        status: 'error',
        message: '제품 ID와 이미지 타입이 필요합니다.'
      });
    }

    // 제품 존재 여부 확인
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: '제품을 찾을 수 없습니다.'
      });
    }

    // 이미지 타입에 따라 처리
    const isLocationImage = imageType === 'location';
    const imageFilename = isLocationImage ? product.locationImage : product.productImage;
    
    if (!imageFilename) {
      return res.status(404).json({
        status: 'error',
        message: '삭제할 이미지가 없습니다.'
      });
    }

    // 이미지 파일 삭제
    const imagePath = path.join(
      isLocationImage ? LOCATION_IMAGES_DIR : PRODUCT_IMAGES_DIR,
      imageFilename
    );
    
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // DB 업데이트
    const updateData = isLocationImage 
      ? { locationImage: null }
      : { productImage: null };
    
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData
    });

    return res.status(200).json({
      status: 'success',
      message: '이미지가 성공적으로 삭제되었습니다.',
      data: {
        product: updatedProduct
      }
    });
  } catch (error) {
    console.error('이미지 삭제 오류:', error);
    return res.status(500).json({
      status: 'error',
      message: '이미지 삭제 중 오류가 발생했습니다.'
    });
  }
};
