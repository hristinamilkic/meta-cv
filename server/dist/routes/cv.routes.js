"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cv_controller_1 = require("../controllers/cv.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.requireAuth);
router.post("/", cv_controller_1.createCV);
router.get("/", cv_controller_1.getUserCVs);
router.get("/analytics", cv_controller_1.getCVAnalytics);
router.get("/:id", cv_controller_1.getCVById);
router.put("/:id", cv_controller_1.updateCV);
router.delete("/:id", cv_controller_1.deleteCV);
router.get("/:id/download", cv_controller_1.downloadCV);
exports.default = router;
//# sourceMappingURL=cv.routes.js.map