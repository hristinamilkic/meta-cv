import { Router } from 'express';
import {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate
} from '../controllers/template.controller';
import { auth, requireRole, requirePremium } from '../middleware/auth';
import { UserRole } from '../enums/user.roles';

const router = Router();

// Public routes
router.get('/', getAllTemplates);
router.get('/:id', getTemplateById);

// Protected routes (admin only)
router.post('/', auth, requireRole([UserRole.ADMIN]), createTemplate);
router.put('/:id', auth, requireRole([UserRole.ADMIN]), updateTemplate);
router.delete('/:id', auth, requireRole([UserRole.ADMIN]), deleteTemplate);

export default router; 