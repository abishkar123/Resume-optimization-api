import express from "express";
import {
  optimizeUserResume,
  uploadResume,
} from "../controllers/resumeController";
import { upload } from "../server";
const router = express.Router();

router.post("/upload", upload.single("resume"), uploadResume);
router.post("/optimize", optimizeUserResume);

export default router;
