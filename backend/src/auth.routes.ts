import express from 'express';
import { login, refreshToken, getCurrentUser } from './auth.controller';
import { authenticate } from './auth.middleware';

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getCurrentUser);

export default router;
