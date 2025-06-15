import express from "express";
import { templateController } from "../controllers/template.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = express.Router();

// protected routes - admin only
router.use(requireAuth);

// public routes - basic and premium user
router.get("/", templateController.getTemplates);
router.get("/:id", templateController.getTemplate);

// protected routes - admin only
router.post("/", templateController.createTemplate);
router.put("/:id", templateController.updateTemplate);
router.delete("/:id", templateController.deleteTemplate);

export default router;
