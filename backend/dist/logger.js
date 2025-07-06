"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
// 로그 레벨 정의
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
// 현재 환경에 따라 로그 레벨 설정
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'development' ? 'debug' : 'warn';
};
// 로그 색상 설정
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
winston_1.default.addColors(colors);
// 로그 포맷 설정
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
// 로그 저장 위치 설정
const transports = [
    // 콘솔에 출력
    new winston_1.default.transports.Console(),
    // error.log 파일에 에러 로그 저장
    new winston_1.default.transports.File({
        filename: path_1.default.join('logs', 'error.log'),
        level: 'error',
    }),
    // all.log 파일에 모든 로그 저장
    new winston_1.default.transports.File({ filename: path_1.default.join('logs', 'all.log') }),
];
// Winston 로거 생성
const logger = winston_1.default.createLogger({
    level: level(),
    levels,
    format,
    transports,
});
exports.default = logger;
