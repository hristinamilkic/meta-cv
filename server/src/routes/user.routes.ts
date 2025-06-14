import express from "express";
import { userController } from "../controllers/user.controller";
import { register } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", userController.login);
router.post("/forgot-password", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);

// Protected routes
router.get("/me", requireAuth, userController.getCurrentUser);
router.put("/profile", userController.updateProfile);
router.put("/password", userController.changePassword);

// Admin routes
router.post("/create", requireAuth, requireAdmin, userController.createUser);
router.get("/all", requireAuth, requireAdmin, userController.getAllUsers);
router.put("/:userId", requireAuth, requireAdmin, userController.updateUser);

export default router;
