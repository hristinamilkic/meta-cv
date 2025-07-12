"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const template_controller_1 = require("../controllers/template.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get("/", template_controller_1.templateController.getTemplates);
router.get("/:id", template_controller_1.templateController.getTemplate);
router.use(auth_middleware_1.requireAuth);
router.post("/", template_controller_1.templateController.createTemplate);
router.put("/:id", template_controller_1.templateController.updateTemplate);
router.delete("/:id", template_controller_1.templateController.deleteTemplate);
exports.default = router;
//# sourceMappingURL=template.routes.js.map