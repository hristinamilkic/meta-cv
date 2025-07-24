"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = require("dotenv");
const database_1 = require("./database");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const template_routes_1 = __importDefault(require("./routes/template.routes"));
const cv_routes_1 = __importDefault(require("./routes/cv.routes"));
(0, dotenv_1.config)();
const requiredEnvVars = ["PORT", "MONGO_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}
const app = (0, express_1.default)();
(0, database_1.connectDB)();
app.use((0, helmet_1.default)());
console.log("CORS allowed origin:", process.env.FRONTEND_URL);
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: "20mb" }));
app.use(express_1.default.urlencoded({ limit: "20mb", extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Meta CV API",
        version: "1.0.0",
    });
});
app.use("/api/users", user_routes_1.default);
app.use("/api/templates", template_routes_1.default);
app.use("/api/cv", cv_routes_1.default);
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
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection:", err);
    server.close(() => process.exit(1));
});
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    server.close(() => process.exit(1));
});
//# sourceMappingURL=index.js.map