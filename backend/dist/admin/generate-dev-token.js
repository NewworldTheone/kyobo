"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
// .env 파일 로드
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
async function generateDevToken() {
    try {
        // 관리자 계정 찾기
        const admin = await prisma.user.findFirst({
            where: { role: 'admin' }
        });
        if (!admin) {
            console.log('관리자 계정이 없습니다. 먼저 관리자 계정을 생성해주세요.');
            console.log('npm run seed 명령어를 실행하세요.');
            return;
        }
        // JWT 토큰 생성
        const token = jsonwebtoken_1.default.sign({
            userId: admin.id,
            role: admin.role
        }, process.env.JWT_SECRET || 'dev-secret-key-for-testing-purposes-only', { expiresIn: '24h' });
        console.log('개발용 JWT 토큰이 생성되었습니다:');
        console.log(token);
        console.log('\n이 토큰을 프론트엔드의 localStorage에 저장하세요:');
        console.log(`localStorage.setItem('token', '${token}');`);
    }
    catch (error) {
        console.error('토큰 생성 중 오류 발생:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
generateDevToken();
