import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { prisma } from './index'; // prisma 임포트 추가
import logger from './logger';

dotenv.config();

// 이메일 전송을 위한 트랜스포터 설정
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // SMTP_HOST -> EMAIL_HOST
  port: parseInt(process.env.EMAIL_PORT || '587'), // SMTP_PORT -> EMAIL_PORT
  secure: process.env.EMAIL_SECURE === 'true', // SMTP_SECURE -> EMAIL_SECURE (추가)
  auth: {
    user: process.env.EMAIL_USER, // SMTP_USER -> EMAIL_USER
    pass: process.env.EMAIL_PASS, // SMTP_PASS -> EMAIL_PASS
  },
});

/**
 * 저재고 알림 이메일 전송
 * @param productName 제품명
 * @param sku 제품 SKU
 * @param currentQuantity 현재 수량
 * @param safetyStock 안전 재고
 */
export const sendLowStockAlert = async (productName: string, sku: string, currentStock: number, safetyStock: number) => {
  try {
    // 관리자 이메일 가져오기
    const admin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (!admin) {
      logger.error('관리자 계정을 찾을 수 없습니다.');
      return;
    }

    const adminEmail = admin.email;

    // 이메일 내용 (transporter 재정의 부분 삭제)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `[재고 알림] ${productName} 재고가 안전 재고 이하로 떨어졌습니다.`,
      html: `
        <h1>재고 부족 알림</h1>
        <p>다음 상품의 재고가 안전 재고 수준 이하로 떨어졌습니다:</p>
        <ul>
          <li><strong>상품명:</strong> ${productName}</li>
          <li><strong>SKU:</strong> ${sku}</li>
          <li><strong>현재 재고:</strong> ${currentStock}</li>
          <li><strong>안전 재고:</strong> ${safetyStock}</li>
        </ul>
        <p>재고를 보충해주세요.</p>
      `
    };

    // 이메일 전송
    await transporter.sendMail(mailOptions);
    logger.info(`저재고 알림 이메일이 ${adminEmail}로 전송되었습니다.`);
  } catch (error) {
    logger.error('이메일 전송 중 오류 발생:', error);
  }
};
