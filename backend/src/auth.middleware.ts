import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from './index';
import { AppError } from './error.middleware';

// 인증 미들웨어
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('인증이 필요합니다.', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    // 토큰 검증
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || ''
    ) as { userId: string; role: string };
    
    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      throw new AppError('유효하지 않은 토큰입니다.', 401);
    }
    
    // 요청 객체에 사용자 정보 추가
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    
    next();
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('JWT Error:', error.message);
      next(new AppError(`JWT 오류: ${error.message}`, 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      console.error('JWT Token Expired:', error.message);
      next(new AppError('토큰이 만료되었습니다.', 401));
    } else if (error instanceof jwt.NotBeforeError) {
      console.error('JWT Not Before Error:', error.message);
      next(new AppError('토큰이 아직 유효하지 않습니다.', 401));
    } else {
      // Pass other errors to the next error handler
      next(error);
    }
  }
};

// 권한 검사 미들웨어
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('인증이 필요합니다.', 401);
    }
    
    if (!roles.includes(req.user.role)) {
      throw new AppError('접근 권한이 없습니다.', 403);
    }
    
    next();
  };
};

// 관리자 권한 검사 미들웨어
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  return authorize(['admin'])(req, res, next);
};

// 타입 확장
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}
