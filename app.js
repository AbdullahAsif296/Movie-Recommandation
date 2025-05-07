import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { ensureDirectoryExists, UPLOAD_PATHS } from "./utils/fileUtils.js";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import ratingReviewRoutes from "./routes/ratingReviewRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import userListRoutes from "./routes/userListRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import boxOfficeRoutes from "./routes/boxOfficeRoutes.js";
import awardRoutes from "./routes/awardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import crewRoutes from "./routes/crewRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import newsArticleRoutes from "./routes/newsArticleRoutes.js";
import imageUploadRoutes from "./routes/imageUploadRoutes.js";

import "./utils/cronJobs.js";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let swaggerDocument;
try {
  swaggerDocument = JSON.parse(
    readFileSync(join(__dirname, "swagger.json"), "utf8")
  );
} catch (error) {
  console.error("Error reading swagger file:", error);
  swaggerDocument = {}; // Provide a default empty configuration
}

dotenv.config();

// Verify email configuration on startup
console.log("Email Configuration:", {
  EMAIL_USER: process.env.EMAIL_USER ? "Set" : "Missing",
  EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD ? "Set" : "Missing",
  EMAIL_FROM: process.env.EMAIL_FROM,
});

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

// Create upload directories
Object.values(UPLOAD_PATHS).forEach((uploadPath) => {
  const fullPath = path.join(__dirname, uploadPath);
  ensureDirectoryExists(fullPath);
});

// Make uploads directory static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api", ratingReviewRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api", userListRoutes);
app.use("/api", searchRoutes);
app.use("/api", notificationRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/boxOffice", boxOfficeRoutes);
app.use("/api", awardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/crew", crewRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/newsArticle", newsArticleRoutes);
app.use("/api/images", imageUploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
