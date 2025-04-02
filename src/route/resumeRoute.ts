import express from 'express';
import { uploadResume } from '../controllers/resumeController';
import { upload } from '../server';
const router = express.Router();

router.post('/upload', upload.single('resume'), uploadResume)

export default router;