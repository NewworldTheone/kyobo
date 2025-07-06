import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { prisma } from './index';
import { AppError } from './error.middleware';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('이메일과 비밀번호를 입력해주세요.', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('이메일 또는 비밀번호가 올바르지 않습니다.', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('이메일 또는 비밀번호가 올바르지 않습니다.', 401);
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      (process.env.JWT_SECRET || ''),
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } as SignOptions
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      (process.env.JWT_REFRESH_SECRET || ''),
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } as SignOptions
    );

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
      // 프로덕션 환경에서는 이 경우 애플리케이션이 시작되지 않도록 해야 합니다.
      // 개발 환경에서는 임시 조치로 계속 진행할 수 있지만, 보안 위험이 있습니다.
      // throw new Error('JWT_SECRET is not defined'); // 이 오류를 던지도록 수정
    }

    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('리프레시 토큰이 필요합니다.', 400);
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || ''
    ) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new AppError('유효하지 않은 토큰입니다.', 401);
    }

    if (!process.env.JWT_REFRESH_SECRET) {
      console.error('JWT_REFRESH_SECRET 환경 변수가 설정되지 않았습니다.');
      // 프로덕션 환경에서는 이 경우 애플리케이션이 시작되지 않도록 해야 합니다.
      // 개발 환경에서는 임시 조치로 계속 진행할 수 있지만, 보안 위험이 있습니다.
      // throw new Error('JWT_REFRESH_SECRET is not defined'); // 이 오류를 던지도록 수정
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      (process.env.JWT_SECRET || ''),
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } as SignOptions
    );

    return res.status(200).json({
      status: 'success',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      throw new AppError('인증이 필요합니다.', 401);
    }

    return res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
