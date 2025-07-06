"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function createAdmin() {
    try {
        // 기존 관리자가 있는지 확인
        const existingAdmin = await prisma.user.findFirst({
            where: { role: 'admin' }
        });
        if (existingAdmin) {
            console.log('관리자 계정이 이미 존재합니다.');
            return;
        }
        // 관리자 계정 생성
        const hashedPassword = await bcrypt_1.default.hash('admin123', 10);
        const admin = await prisma.user.create({
            data: {
                email: 'admin@kyobobook.com',
                password: hashedPassword,
                name: '관리자',
                role: 'admin'
            }
        });
        console.log('관리자 계정이 성공적으로 생성되었습니다.');
        // 민감한 정보(이메일, 비밀번호)는 로그에 출력하지 않음
    }
    catch (error) {
        console.error('관리자 계정 생성 중 오류 발생:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
createAdmin();
