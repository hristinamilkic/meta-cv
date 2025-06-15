import express from "express";
import {
  createCV,
  getUserCVs,
  getCVAnalytics,
  getCVById,
  updateCV,
  deleteCV,
  downloadCV,
} from "../controllers/cv.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = express.Router();

// all routes are protected
router.use(requireAuth);

// CV management routes
router.post("/", createCV);
router.get("/", getUserCVs);
router.get("/analytics", getCVAnalytics);
router.get("/:id", getCVById);
router.put("/:id", updateCV);
router.delete("/:id", deleteCV);
router.get("/:id/download", downloadCV);

export default router;
