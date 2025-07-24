import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "dotenv";
import { connectDB } from "./database";
import userRoutes from "./routes/user.routes";
import templateRoutes from "./routes/template.routes";
import cvRoutes from "./routes/cv.routes";

config();

const requiredEnvVars = ["PORT", "MONGO_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

const app = express();

connectDB();

// Middleware
app.use(helmet()); // Security headers

// CORS configuration for production
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [process.env.FRONTEND_URL || "https://meta-cv-lac.vercel.app/"]
      : ["http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions)); // Enable CORS
app.use(express.json({ limit: "20mb" })); // Parse JSON bodies with increased limit
app.use(express.urlencoded({ limit: "20mb", extended: true })); // Parse URL-encoded bodies with increased limit
app.use(morgan("dev")); // Logging

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Meta CV API",
    version: "1.0.0",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/cv", cvRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});
