import express from "express";
import { uploadMiddleware } from "../middleware/uploadMiddleware";
import {
  getUserHistory,
  optimizeResume,
  uploadResume,
} from "../controllers/resumeController";

const router = express.Router();

router.post("/upload", uploadMiddleware, uploadResume);
router.post("/", optimizeResume);
router.get("/history/:email", getUserHistory);

export default router;
