import express from "express";
import { uploadMiddleware } from "../middleware/uploadMiddleware";
import { authenticateUser } from "../middleware/authMiddleware";
import {
  getUserHistory,
  optimizeResume,
  uploadResume,
} from "../controllers/resumeController";
import { aiLimiter, uploadLimiter } from "../middleware/rateLimiter";

const router = express.Router();

// Apply authentication to all routes in this router
router.use(authenticateUser);

router.post("/upload", uploadLimiter, uploadMiddleware, uploadResume);
router.post("/optimize-resume", aiLimiter, optimizeResume);
router.get("/history/:email", getUserHistory);

export default router;
