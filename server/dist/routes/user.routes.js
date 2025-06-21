"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const user_controller_2 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = express_1.default.Router();
router.post("/register", user_controller_2.register);
router.post("/login", user_controller_1.userController.login);
router.post("/forgot-password", user_controller_1.userController.requestPasswordReset);
router.post("/reset-password", user_controller_1.userController.resetPassword);
router.get("/me", auth_middleware_1.requireAuth, user_controller_1.userController.getCurrentUser);
router.put("/profile", user_controller_1.userController.updateProfile);
router.put("/password", user_controller_1.userController.changePassword);
router.post("/create", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, user_controller_1.userController.createUser);
router.get("/all", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, user_controller_1.userController.getAllUsers);
router.put("/:userId", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, user_controller_1.userController.updateUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map