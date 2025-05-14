import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app: Express = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

//dbc connection
import { connectDB } from "./config/dbConfig";
connectDB();

//middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// route
import resumeRoutes from "./route/resumeRoute";
import optimizeRoutes from "./route/resumeRoute";
import downloadRoutes from "./route/resumeRoute";

app.use("/api/v1/resumes", resumeRoutes);
app.use("/api/v1/resumes/optimize-resume", optimizeRoutes);
app.use("/api/v1/resumes", downloadRoutes);

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
