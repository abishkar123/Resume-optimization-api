import dotenv from "dotenv";
import express, { Express } from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import fs from "fs";
import helmet from "helmet";

const app: Express = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

//dbc connection
import { connectDB } from "./config/dbConfig";
connectDB();

//middleware

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "./uploads/");
  },

  filename: (req, file, cd) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cd(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedFileTypes = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only PDF, DOC, and DOCX files are allowed.")
    );
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

import resumeRoutes from "./route/resumeRoute";

// route
app.use("/api/v1/resumes/upload", resumeRoutes);

app.use("/", (req, res, next) => {
  const error = {
    message: "You dont have promission here",
  };
  next(error);
});

//global error handleer
app.use((error, req, res, next) => {
  const statusCode = Number(error.errorCode) || 404;
  res.status(statusCode).json({
    status: "error",
    message: error.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
