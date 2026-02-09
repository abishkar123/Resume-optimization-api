import dotenv from "dotenv";
import express, { Express } from "express";

import cors from "cors";

import helmet from "helmet";
import morgan from "morgan";
import { generalLimiter } from "./middleware/rateLimiter";

const app: Express = express();
dotenv.config();

console.log("Environment check:");
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- PORT:", process.env.PORT);
console.log("- MONGO_URL configured:", !!process.env.MONGO_URL);

const PORT = process.env.PORT || 8000;

//dbc connection
import { connectDB } from "./config/dbConfig";

console.log("Connecting to Database...");
connectDB();

//middleware
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

// route
import resumeRoutes from "./route/resumeRoute";

app.use("/api/v1/resumes", resumeRoutes);

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
