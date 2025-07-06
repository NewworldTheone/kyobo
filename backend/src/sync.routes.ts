import express from 'express';
import { authenticate } from './auth.middleware';
import { syncOfflineActions } from './sync.controller';

const router = express.Router();

router.post('/sync', authenticate, syncOfflineActions);

export default router;
