import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { generalLimiter } from "./middleware/rateLimiter";
import { getHealthStatus } from "./health";
import resumeRoutes from "./route/resumeRoute";

dotenv.config();

const app: Express = express();

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json(getHealthStatus());
});

app.use(generalLimiter);
app.use(helmet());
app.use(
  cors({
    origin: ["https://resume-optimizaton-client.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/v1/resumes", resumeRoutes);

app.use("/", (_req: Request, _res: Response, next: NextFunction) => {
  const error = {
    message: "You dont have promission here",
  };
  next(error);
});

app.use((error, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = Number(error.errorCode) || 404;
  res.status(statusCode).json({
    status: "error",
    message: error.message,
  });
});

export default app;
