"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = express_1.default.Router();
router.post("/register", user_controller_1.register);
router.post("/login", user_controller_1.userController.login);
router.post("/logout", user_controller_1.userController.logout);
router.post("/forgot-password", user_controller_1.userController.requestPasswordReset);
router.post("/reset-password", user_controller_1.userController.resetPassword);
router.post("/verify-reset-code", user_controller_1.userController.verifyResetCode);
router.get("/me", auth_middleware_1.requireAuth, user_controller_1.userController.getCurrentUser);
router.put("/profile", auth_middleware_1.requireAuth, user_controller_1.userController.updateProfile);
router.put("/password", auth_middleware_1.requireAuth, user_controller_1.userController.changePassword);
router.post("/create", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, user_controller_1.userController.createUser);
router.get("/all", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, user_controller_1.userController.getAllUsers);
router.put("/:userId", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, user_controller_1.userController.updateUser);
router.put("/:userId/password", auth_middleware_1.requireAuth, admin_middleware_1.requireRoot, user_controller_1.userController.updateUserPasswordByRoot);
router.post("/create-admin", auth_middleware_1.requireAuth, admin_middleware_1.requireRoot, user_controller_1.userController.createAdminByRoot);
router.delete("/:userId", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map