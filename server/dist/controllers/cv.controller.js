"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCVAnalytics = exports.downloadCV = exports.deleteCV = exports.updateCV = exports.getCVById = exports.getUserCVs = exports.createCV = void 0;
const cv_model_1 = __importDefault(require("../models/cv.model"));
const pdf_service_1 = require("../services/pdf.service");
const template_model_1 = __importDefault(require("../models/template.model"));
const createCV = async (req, res) => {
    var _a, _b;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }
        const { templateId, data } = req.body;
        const template = await template_model_1.default.findById(templateId);
        if (!template) {
            return res.status(404).json({
                success: false,
                message: "Template not found",
            });
        }
        if (template.isPremium && !req.user.isPremium) {
            return res.status(403).json({
                success: false,
                message: "Premium template requires premium subscription",
            });
        }
        const personalDetails = data.personalDetails || data.personalInfo || {};
        const title = data.title ||
            personalDetails.fullName ||
            personalDetails.firstName ||
            "Untitled CV";
        const cv = await cv_model_1.default.create({
            userId: req.user._id,
            title,
            personalDetails,
            education: data.education || [],
            experience: data.experience || [],
            skills: data.skills || [],
            languages: data.languages || [],
            projects: data.projects || [],
            certifications: data.certifications || [],
            isPublic: (_b = data.isPublic) !== null && _b !== void 0 ? _b : false,
            template: templateId,
        });
        res.status(201).json({
            success: true,
            data: cv,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating CV",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
    return;
};
exports.createCV = createCV;
const getUserCVs = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }
        const cvs = await cv_model_1.default.find({ userId: req.user._id })
            .populate("template", "name thumbnail")
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            data: cvs,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching CVs",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
    return;
};
exports.getUserCVs = getUserCVs;
const getCVById = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }
        const cv = await cv_model_1.default.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate("template");
        if (!cv) {
            return res.status(404).json({
                success: false,
                message: "CV not found",
            });
        }
        res.json({
            success: true,
            data: cv,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching CV",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
    return;
};
exports.getCVById = getCVById;
const updateCV = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }
        const { data, title } = req.body;
        const updateData = {};
        if (data) {
            if (data.personalDetails || data.personalInfo) {
                updateData.personalDetails = data.personalDetails || data.personalInfo;
            }
            if (data.education)
                updateData.education = data.education;
            if (data.experience)
                updateData.experience = data.experience;
            if (data.skills)
                updateData.skills = data.skills;
            if (data.languages)
                updateData.languages = data.languages;
            if (data.projects)
                updateData.projects = data.projects;
            if (data.certifications)
                updateData.certifications = data.certifications;
            if (data.isPublic !== undefined)
                updateData.isPublic = data.isPublic;
        }
        if (title) {
            updateData.title = title;
        }
        const cv = await cv_model_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, updateData, { new: true }).populate("template");
        if (!cv) {
            return res.status(404).json({
                success: false,
                message: "CV not found",
            });
        }
        res.json({
            success: true,
            data: cv,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating CV",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
    return;
};
exports.updateCV = updateCV;
const deleteCV = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }
        const cv = await cv_model_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!cv) {
            return res.status(404).json({
                success: false,
                message: "CV not found",
            });
        }
        res.json({
            success: true,
            message: "CV deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting CV",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
    return;
};
exports.deleteCV = deleteCV;
const downloadCV = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }
        const cv = (await cv_model_1.default.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate("template"));
        if (!cv) {
            return res.status(404).json({
                success: false,
                message: "CV not found",
            });
        }
        if (!cv.template) {
            return res.status(404).json({
                success: false,
                message: "Template not found",
            });
        }
        const cvData = cv.toObject();
        const templateData = cv.template.toObject();
        const structuredCVData = {
            personalDetails: cvData.personalDetails || {},
            education: cvData.education || [],
            experience: cvData.experience || [],
            skills: cvData.skills || [],
            languages: cvData.languages || [],
            projects: cvData.projects || [],
            certifications: cvData.certifications || [],
            title: cvData.title || "CV",
        };
        console.log("Generating PDF for CV:", cvData._id);
        console.log("Template:", templateData.name);
        const pdfBuffer = await pdf_service_1.PDFService.generatePDF(structuredCVData, templateData);
        let safeTitle = (cv.title || "CV").replace(/[^a-zA-Z0-9-_\. ]/g, "_");
        if (!safeTitle.trim())
            safeTitle = "CV";
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.pdf"`);
        res.send(pdfBuffer);
    }
    catch (error) {
        console.error("Download CV error:", error);
        res.status(500).json({
            success: false,
            message: "Error generating PDF",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
    return;
};
exports.downloadCV = downloadCV;
const getCVAnalytics = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }
        const totalCVs = await cv_model_1.default.countDocuments({ userId: req.user._id });
        const lastWeekCVs = await cv_model_1.default.countDocuments({
            userId: req.user._id,
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        });
        const templateUsage = await cv_model_1.default.aggregate([
            { $match: { userId: req.user._id } },
            { $group: { _id: "$template", count: { $sum: 1 } } },
            {
                $lookup: {
                    from: "templates",
                    localField: "_id",
                    foreignField: "_id",
                    as: "template",
                },
            },
            { $unwind: "$template" },
            { $project: { templateName: "$template.name", count: 1, _id: 0 } },
        ]);
        res.json({
            success: true,
            data: {
                totalCVs,
                lastWeekCVs,
                templateUsage,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching CV analytics",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
    return;
};
exports.getCVAnalytics = getCVAnalytics;
//# sourceMappingURL=cv.controller.js.map