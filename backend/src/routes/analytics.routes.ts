
import express from 'express';
import {
  getDashboardStats,
  getCategoryDistribution,
  getSentimentTrends,
} from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/dashboard', authenticate, getDashboardStats);
router.get('/categories', authenticate, getCategoryDistribution);
router.get('/sentiment-trends', authenticate, getSentimentTrends);

export default router;
