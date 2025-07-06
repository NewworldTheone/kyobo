"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.refreshToken = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("./index");
const error_middleware_1 = require("./error.middleware");
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new error_middleware_1.AppError('이메일과 비밀번호를 입력해주세요.', 400);
        }
        const user = await index_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new error_middleware_1.AppError('이메일 또는 비밀번호가 올바르지 않습니다.', 401);
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new error_middleware_1.AppError('이메일 또는 비밀번호가 올바르지 않습니다.', 401);
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, (process.env.JWT_SECRET || ''), { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, (process.env.JWT_REFRESH_SECRET || ''), { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });
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
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new error_middleware_1.AppError('리프레시 토큰이 필요합니다.', 400);
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || '');
        const user = await index_1.prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            throw new error_middleware_1.AppError('유효하지 않은 토큰입니다.', 401);
        }
        if (!process.env.JWT_REFRESH_SECRET) {
            console.error('JWT_REFRESH_SECRET 환경 변수가 설정되지 않았습니다.');
            // 프로덕션 환경에서는 이 경우 애플리케이션이 시작되지 않도록 해야 합니다.
            // 개발 환경에서는 임시 조치로 계속 진행할 수 있지만, 보안 위험이 있습니다.
            // throw new Error('JWT_REFRESH_SECRET is not defined'); // 이 오류를 던지도록 수정
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, (process.env.JWT_SECRET || ''), { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
        return res.status(200).json({
            status: 'success',
            data: {
                accessToken,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
const getCurrentUser = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new error_middleware_1.AppError('인증이 필요합니다.', 401);
        }
        return res.status(200).json({
            status: 'success',
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCurrentUser = getCurrentUser;
