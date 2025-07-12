"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateController = void 0;
const template_model_1 = __importDefault(require("../models/template.model"));
exports.templateController = {
    async getTemplates(req, res) {
        try {
            const templatesFromDb = await template_model_1.default.find()
                .select("name preview isPremium description")
                .sort({ isPremium: 1, name: 1 })
                .lean();
            const templates = templatesFromDb.map((t) => {
                var _a;
                return ({
                    _id: t._id,
                    name: t.name,
                    isPremium: t.isPremium,
                    description: t.description,
                    thumbnail: ((_a = t.preview) === null || _a === void 0 ? void 0 : _a.thumbnail) || "",
                });
            });
            res.json({
                success: true,
                data: templates,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Error fetching templates",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    },
    async getTemplate(req, res) {
        try {
            const template = await template_model_1.default.findById(req.params.id);
            if (!template) {
                return res.status(404).json({
                    success: false,
                    message: "Template not found",
                });
            }
            res.json({
                success: true,
                data: template,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Error fetching template",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
        return;
    },
    async createTemplate(req, res) {
        var _a;
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
                return res.status(403).json({
                    success: false,
                    message: "Not authorized to create templates",
                });
            }
            const template = await template_model_1.default.create(req.body);
            res.status(201).json({
                success: true,
                data: template,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Error creating template",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
        return;
    },
    async updateTemplate(req, res) {
        var _a;
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
                return res.status(403).json({
                    success: false,
                    message: "Not authorized to update templates",
                });
            }
            const template = await template_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!template) {
                return res.status(404).json({
                    success: false,
                    message: "Template not found",
                });
            }
            res.json({
                success: true,
                data: template,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Error updating template",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
        return;
    },
    async deleteTemplate(req, res) {
        var _a;
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
                return res.status(403).json({
                    success: false,
                    message: "Not authorized to delete templates",
                });
            }
            const template = await template_model_1.default.findByIdAndDelete(req.params.id);
            if (!template) {
                return res.status(404).json({
                    success: false,
                    message: "Template not found",
                });
            }
            res.json({
                success: true,
                message: "Template deleted successfully",
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Error deleting template",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
        return;
    },
};
//# sourceMappingURL=template.controller.js.map