"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const image_routes_1 = __importDefault(require("./image.routes"));
const location_routes_1 = __importDefault(require("./location.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const sync_routes_1 = __importDefault(require("./sync.routes")); // 추가된 라인
const error_middleware_1 = require("./error.middleware");
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("./logger"));
const fs_1 = __importDefault(require("fs"));
// 환경 변수 로드
dotenv_1.default.config();
// logs 디렉토리 생성 (없는 경우)
if (!fs_1.default.existsSync('logs')) {
    fs_1.default.mkdirSync('logs');
}
// Prisma 클라이언트 초기화
exports.prisma = new client_1.PrismaClient();
// Express 앱 초기화
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '3001', 10);
// CORS 설정
const allowedOrigins = [
    'http://localhost:3002', // 프론트엔드 개발 서버
    'http://localhost:3001', // 백엔드 서버
    process.env.FRONTEND_URL // 프로덕션 프론트엔드 URL
].filter(Boolean);
// 미들웨어
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 정적 파일 제공
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// API 라우트
app.use('/api/auth', auth_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/images', image_routes_1.default);
app.use('/api/locations', location_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/sync', sync_routes_1.default); // 추가된 라인
// 기본 라우트
app.get('/', (req, res) => {
    res.json({
        message: '교보문고 핫트랙스 송도점 재고관리 시스템 API',
        version: '2.0.0',
        status: 'running'
    });
});
// 에러 핸들러
app.use(error_middleware_1.errorHandler);
// 서버 시작
app.listen(PORT, '0.0.0.0', () => {
    logger_1.default.info(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
// 종료 시 Prisma 연결 해제
process.on('SIGINT', async () => {
    logger_1.default.info('서버가 종료됩니다...');
    await exports.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    logger_1.default.info('서버가 종료됩니다...');
    await exports.prisma.$disconnect();
    process.exit(0);
});
