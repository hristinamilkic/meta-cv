"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRoot = exports.requireAdmin = void 0;
const requireAdmin = (req, res, next) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
        return res.status(403).json({
            success: false,
            message: "Admin access required",
        });
    }
    next();
    return;
};
exports.requireAdmin = requireAdmin;
const requireRoot = (req, res, next) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isRoot)) {
        return res.status(403).json({
            success: false,
            message: "Root admin access required",
        });
    }
    next();
    return;
};
exports.requireRoot = requireRoot;
//# sourceMappingURL=admin.middleware.js.map