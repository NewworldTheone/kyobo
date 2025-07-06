import winston from 'winston';
import path from 'path';

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

winston.addColors(colors);

// 로그 포맷 설정
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// 로그 저장 위치 설정
const transports = [
  // 콘솔에 출력
  new winston.transports.Console(),
  // error.log 파일에 에러 로그 저장
  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
  }),
  // all.log 파일에 모든 로그 저장
  new winston.transports.File({ filename: path.join('logs', 'all.log') }),
];

// Winston 로거 생성
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger;