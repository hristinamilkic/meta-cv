"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPremium = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../models/User.model"));
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const requireAuth = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_model_1.default.findById(decoded.userId);
        if (!user || !user.isActive) {
            return res.status(401).json({ message: "User not found or inactive" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
    return;
};
exports.requireAuth = requireAuth;
const checkPremium = async (req, res, next) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isPremium)) {
            return res.status(403).json({
                success: false,
                message: "Premium subscription required to access this feature",
            });
        }
        next();
    }
    catch (error) {
        next(error);
    }
    return;
};
exports.checkPremium = checkPremium;
//# sourceMappingURL=auth.middleware.js.map