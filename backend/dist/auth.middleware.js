"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("./index");
const error_middleware_1 = require("./error.middleware");
// 인증 미들웨어
const authenticate = async (req, res, next) => {
    try {
        // Authorization 헤더에서 토큰 추출
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new error_middleware_1.AppError('인증이 필요합니다.', 401);
        }
        const token = authHeader.split(' ')[1];
        // 토큰 검증
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
        // 사용자 조회
        const user = await index_1.prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user) {
            throw new error_middleware_1.AppError('유효하지 않은 토큰입니다.', 401);
        }
        // 요청 객체에 사용자 정보 추가
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
// 권한 검사 미들웨어
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new error_middleware_1.AppError('인증이 필요합니다.', 401);
        }
        if (!roles.includes(req.user.role)) {
            throw new error_middleware_1.AppError('접근 권한이 없습니다.', 403);
        }
        next();
    };
};
exports.authorize = authorize;
// 관리자 권한 검사 미들웨어
const authorizeAdmin = (req, res, next) => {
    return (0, exports.authorize)(['admin'])(req, res, next);
};
exports.authorizeAdmin = authorizeAdmin;
