"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const logger_1 = __importDefault(require("./logger"));
// 사용자 정의 에러 클래스
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// 에러 핸들러 미들웨어
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // 개발 환경에서는 자세한 오류 정보 제공
    if (process.env.NODE_ENV === 'development') {
        logger_1.default.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        logger_1.default.error(err.stack);
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    // 프로덕션 환경에서는 최소한의 오류 정보만 제공
    if (err.isOperational) {
        logger_1.default.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    // 프로그래밍 오류 등 예상치 못한 오류는 일반적인 오류 메시지 제공
    logger_1.default.error('예상치 못한 오류 발생:', err);
    return res.status(500).json({
        status: 'error',
        message: '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.'
    });
};
exports.errorHandler = errorHandler;
