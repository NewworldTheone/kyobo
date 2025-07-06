import { Request, Response, NextFunction } from 'express';
import { prisma } from './index';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';

interface BulkUploadResponse {
  status: 'success' | 'error';
  data?: {
    success: number;
    failed: number;
    errors?: string[];
  };
  message?: string;
  error?: string;
}

export const bulkUploadProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Bulk upload request received');
    console.log('Request file:', req.file);
    console.log('User:', req.user);
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({
        status: 'error',
        error: '파일이 업로드되지 않았습니다.',
        message: '파일을 선택해주세요.'
      } as BulkUploadResponse);
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    
    let products: any[] = [];
    
    try {
      // 파일 형식에 따라 처리
      if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        // Excel 파일 처리
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        products = XLSX.utils.sheet_to_json(worksheet);
      } else if (fileExtension === '.csv') {
        // CSV 파일 처리
        products = await new Promise((resolve, reject) => {
          const results: any[] = [];
          fs.createReadStream(filePath)
            .pipe(csvParser({
              mapHeaders: ({ header }) => header.trim(),
              mapValues: ({ value }) => value.trim()
            }))
            .on('data', (data: any) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error: Error) => reject(error));
        });
      } else {
        return res.status(400).json({
          status: 'error',
          error: '지원되지 않는 파일 형식입니다.',
          message: 'CSV 파일만 업로드 가능합니다.'
        } as BulkUploadResponse);
      }
    } finally {
      // 파일 삭제
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    if (products.length === 0) {
      return res.status(400).json({
        status: 'error',
        error: '파일에 데이터가 없습니다.',
        message: '파일 내용을 확인해주세요.'
      } as BulkUploadResponse);
    }
    
    // 데이터 유효성 검사 및 변환
    const validProducts = [];
    const errors = [];
    let successCount = 0;
    let failedCount = 0;
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const rowNumber = i + 2; // 헤더 행과 0-인덱스 고려
      
      // 필수 필드 확인
      if (!product.name || !product.sku || !product.category || !product.brand || 
          !product.location || product.quantity === undefined || 
          product.safetyStock === undefined || product.price === undefined) {
        errors.push(`${rowNumber}행: 필수 필드가 누락되었습니다.`);
        failedCount++;
        continue;
      }
      
      // 데이터 타입 변환
      try {
        const quantity = parseInt(product.quantity);
        const safetyStock = parseInt(product.safetyStock);
        const price = parseFloat(product.price);
        
        if (isNaN(quantity) || isNaN(safetyStock) || isNaN(price)) {
          errors.push(`${rowNumber}행: 숫자 형식이 올바르지 않습니다.`);
          failedCount++;
          continue;
        }
        
        if (quantity < 0 || safetyStock < 0 || price < 0) {
          errors.push(`${rowNumber}행: 음수 값은 허용되지 않습니다.`);
          failedCount++;
          continue;
        }
        
        validProducts.push({
          name: String(product.name).trim(),
          sku: String(product.sku).trim(),
          category: String(product.category).trim(),
          brand: String(product.brand).trim(),
          location: String(product.location).trim(),
          quantity: quantity,
          safetyStock: safetyStock,
          price: price,
          description: product.description ? String(product.description).trim() : null
        });
      } catch (error) {
        errors.push(`${rowNumber}행: 데이터 형식이 올바르지 않습니다.`);
        failedCount++;
      }
    }
    
    if (validProducts.length === 0) {
      return res.status(400).json({
        status: 'error',
        error: '유효한 제품 데이터가 없습니다.',
        message: 'CSV 파일 형식을 확인해주세요.',
        data: {
          success: 0,
          failed: failedCount,
          errors: errors.slice(0, 10)
        }
      } as BulkUploadResponse);
    }
    
    // 제품 대량 업로드 (upsert)
    for (const product of validProducts) {
      try {
        const existingProduct = await prisma.product.findUnique({
          where: { sku: product.sku }
        });
        
        if (existingProduct) {
          // 기존 제품 업데이트
          await prisma.product.update({
            where: { sku: product.sku },
            data: {
              name: product.name,
              category: product.category,
              brand: product.brand,
              location: product.location,
              quantity: product.quantity,
              safetyStock: product.safetyStock,
              price: product.price,
              description: product.description
            }
          });
          successCount++;
        } else {
          // 새 제품 생성
          await prisma.product.create({
            data: product
          });
          successCount++;
        }
      } catch (error: any) {
        errors.push(`SKU ${product.sku}: ${error.message}`);
        failedCount++;
      }
    }
    
    // 응답 - 클라이언트가 기대하는 형식으로
    return res.status(200).json({
      status: 'success',
      data: {
        success: successCount,
        failed: failedCount,
        errors: errors.slice(0, 100) // 최대 100개의 에러만 반환
      }
    } as BulkUploadResponse);
    
  } catch (error) {
    console.error('대량 업로드 오류:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // next(error); // 에러 미들웨어로 전달
    return res.status(500).json({
      status: 'error',
      error: '제품을 대량 업로드하는 중 오류가 발생했습니다.',
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    } as BulkUploadResponse);
  }
};