import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import imageRoutes from './image.routes';
import locationRoutes from './location.routes';
import adminRoutes from './admin.routes';
import syncRoutes from './sync.routes'; // 추가된 라인
import { errorHandler } from './error.middleware';
import path from 'path';
import logger from './logger';
import fs from 'fs';

// 환경 변수 로드
dotenv.config();

// logs 디렉토리 생성 (없는 경우)
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Prisma 클라이언트 초기화
export const prisma = new PrismaClient();

// Express 앱 초기화
const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// CORS 설정
const allowedOrigins = [
  'http://localhost:3000',  // 프론트엔드 서버 (Python HTTP 서버)
  'http://localhost:3002',  // 프론트엔드 개발 서버
  'http://localhost:3001',  // 백엔드 서버
  process.env.FRONTEND_URL  // 프로덕션 프론트엔드 URL
].filter(Boolean);

// 미들웨어
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', adminRoutes); // reports 라우트 추가
app.use('/api/sync', syncRoutes); // 추가된 라인

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: '교보문고 핫트랙스 송도점 재고관리 시스템 API',
    version: '2.0.0',
    status: 'running'
  });
});

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

// 종료 시 Prisma 연결 해제
process.on('SIGINT', async () => {
  logger.info('서버가 종료됩니다...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('서버가 종료됩니다...');
  await prisma.$disconnect();
  process.exit(0);
});
