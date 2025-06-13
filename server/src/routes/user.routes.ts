import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserRole,
  deactivateUser
} from '../controllers/user.controller';
import { auth, requireRole } from '../middleware/auth';
import { UserRole } from '../enums/user.roles';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Admin routes
router.get('/users', auth, requireRole([UserRole.ADMIN]), getAllUsers);
router.put('/users/:userId/role', auth, requireRole([UserRole.ADMIN]), updateUserRole);
router.put('/users/:userId/deactivate', auth, requireRole([UserRole.ADMIN]), deactivateUser);

export default router;
