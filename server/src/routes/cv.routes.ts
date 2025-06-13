import { Router } from 'express';
import {
  createCV,
  getUserCVs,
  getCVById,
  updateCV,
  deleteCV,
  getCVAnalytics
} from '../controllers/cv.controller';
import { auth, requirePremium } from '../middleware/auth';

const router = Router();

// All CV routes require authentication
router.use(auth);

// Basic CV operations
router.post('/', createCV);
router.get('/', getUserCVs);
router.get('/:id', getCVById);
router.put('/:id', updateCV);
router.delete('/:id', deleteCV);

// Analytics (premium feature)
router.get('/analytics/overview', requirePremium, getCVAnalytics);

export default router; 