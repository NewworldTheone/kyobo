import { Request, Response, NextFunction } from 'express';
import logger from './logger';

// 사용자 정의 에러 클래스
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// 에러 핸들러 미들웨어
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof TokenExpiredError) {
    logger.warn(`Token expired: ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(401).json({
      status: 'fail',
      message: '토큰이 만료되었습니다. 다시 로그인해주세요.',
    });
  } else if (err instanceof JsonWebTokenError) {
    logger.warn(`Invalid token: ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(401).json({
      status: 'fail',
      message: '유효하지 않은 토큰입니다.',
    });
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 개발 환경에서는 자세한 오류 정보 제공
  if (process.env.NODE_ENV === 'development') {
    logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    logger.error(err.stack);

    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // 프로덕션 환경에서는 최소한의 오류 정보만 제공
  if (err.isOperational) {
    logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // 프로그래밍 오류 등 예상치 못한 오류는 일반적인 오류 메시지 제공
  logger.error('예상치 못한 오류 발생:', err);
  
  return res.status(500).json({
    status: 'error',
    message: '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.'
  });
};
