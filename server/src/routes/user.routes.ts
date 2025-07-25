import express from "express";
import {
  userController,
  register,
  deleteUser,
} from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin, requireRoot } from "../middleware/admin.middleware";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/forgot-password", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);
router.post("/verify-reset-code", userController.verifyResetCode);

// Protected routes
router.get("/me", requireAuth, userController.getCurrentUser);
router.put("/profile", requireAuth, userController.updateProfile);
router.put("/password", requireAuth, userController.changePassword);

// Admin routes
router.post("/create", requireAuth, requireAdmin, userController.createUser);
router.get("/all", requireAuth, requireAdmin, userController.getAllUsers);
router.put("/:userId", requireAuth, requireAdmin, userController.updateUser);
router.put(
  "/:userId/password",
  requireAuth,
  requireRoot,
  userController.updateUserPasswordByRoot
);
router.post(
  "/create-admin",
  requireAuth,
  requireRoot,
  userController.createAdminByRoot
);
router.delete("/:userId", requireAuth, requireAdmin, deleteUser);

export default router;
