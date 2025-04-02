
import express from 'express';
import {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedbackStatus,
  addResponse,
} from '../controllers/feedback.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Public route for submitting feedback
router.post('/', createFeedback);

// Protected routes
router.get('/', authenticate, getAllFeedback);
router.get('/:id', authenticate, getFeedbackById);
router.patch('/:id/status', authenticate, authorize('admin', 'manager'), updateFeedbackStatus);
router.post('/:id/responses', authenticate, authorize('admin', 'manager', 'analyst'), addResponse);

export default router;
