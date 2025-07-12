"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCVs = exports.getCVAnalytics = exports.downloadCV = exports.deleteCV = exports.updateCV = exports.getCVById = exports.getUserCVs = exports.createCV = void 0;
const CV_model_1 = __importDefault(require("../models/CV.model"));
const pdf_service_1 = require("../services/pdf.service");
const template_model_1 = __importDefault(require("../models/template.model"));
const template_thumbnail_service_1 = require("../services/template-thumbnail.service");
const createCV = async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g;
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
        const defaultData = template.defaultData || {};
        const mergedData = {
            ...defaultData,
            ...data,
            personalDetails: {
                ...defaultData.personalDetails,
                ...((data === null || data === void 0 ? void 0 : data.personalDetails) || {}),
            },
            education: (data === null || data === void 0 ? void 0 : data.education) || defaultData.education || [],
            experience: (data === null || data === void 0 ? void 0 : data.experience) || defaultData.experience || [],
            skills: (data === null || data === void 0 ? void 0 : data.skills) || defaultData.skills || [],
            languages: (data === null || data === void 0 ? void 0 : data.languages) || defaultData.languages || [],
            projects: (data === null || data === void 0 ? void 0 : data.projects) || defaultData.projects || [],
            certifications: (data === null || data === void 0 ? void 0 : data.certifications) || defaultData.certifications || [],
            isPublic: (_c = (_b = data === null || data === void 0 ? void 0 : data.isPublic) !== null && _b !== void 0 ? _b : defaultData.isPublic) !== null && _c !== void 0 ? _c : false,
        };
        const title = mergedData.title ||
            ((_d = mergedData.personalDetails) === null || _d === void 0 ? void 0 : _d.fullName) ||
            ((_e = mergedData.personalDetails) === null || _e === void 0 ? void 0 : _e.firstName) ||
            "Untitled CV";
        const requiredErrors = [];
        if (!((_f = mergedData.personalDetails) === null || _f === void 0 ? void 0 : _f.fullName))
            requiredErrors.push("Full name is required");
        if (!((_g = mergedData.personalDetails) === null || _g === void 0 ? void 0 : _g.email))
            requiredErrors.push("Email is required");
        (mergedData.education || []).forEach((edu, i) => {
            if (!edu.institution)
                requiredErrors.push(`Education[${i + 1}]: Institution is required`);
            if (!edu.degree)
                requiredErrors.push(`Education[${i + 1}]: Degree is required`);
        });
        (mergedData.experience || []).forEach((exp, i) => {
            if (!exp.company)
                requiredErrors.push(`Experience[${i + 1}]: Company is required`);
            if (!exp.position)
                requiredErrors.push(`Experience[${i + 1}]: Position is required`);
        });
        (mergedData.skills || []).forEach((skill, i) => {
            if (!skill.name)
                requiredErrors.push(`Skill[${i + 1}]: Name is required`);
        });
        (mergedData.languages || []).forEach((lang, i) => {
            if (!lang.name)
                requiredErrors.push(`Language[${i + 1}]: Name is required`);
        });
        (mergedData.projects || []).forEach((proj, i) => {
            if (!proj.name)
                requiredErrors.push(`Project[${i + 1}]: Name is required`);
        });
        (mergedData.certifications || []).forEach((cert, i) => {
            if (!cert.name)
                requiredErrors.push(`Certification[${i + 1}]: Name is required`);
            if (!cert.issuer)
                requiredErrors.push(`Certification[${i + 1}]: Issuer is required`);
        });
        if (requiredErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: requiredErrors,
            });
        }
        const cv = await CV_model_1.default.create({
            userId: req.user._id,
            title,
            personalDetails: mergedData.personalDetails,
            education: mergedData.education,
            experience: mergedData.experience,
            skills: mergedData.skills,
            languages: mergedData.languages,
            projects: mergedData.projects,
            certifications: mergedData.certifications,
            isPublic: mergedData.isPublic,
            template: templateId,
        });
        (0, template_thumbnail_service_1.generateCVThumbnail)(mergedData, template)
            .then((thumbnail) => {
            cv.thumbnail = thumbnail;
            return cv.save();
        })
            .catch((thumbErr) => {
            console.error("Failed to generate CV thumbnail:", thumbErr);
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
        const cvs = await CV_model_1.default.find({ userId: req.user._id })
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
        const cv = await CV_model_1.default.findOne({
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
        const cv = await CV_model_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, updateData, { new: true }).populate("template");
        if (!cv) {
            return res.status(404).json({
                success: false,
                message: "CV not found",
            });
        }
        (async () => {
            var _a, _b, _c;
            try {
                let templateObj = cv.template;
                if (!templateObj ||
                    typeof templateObj !== "object" ||
                    !("templateData" in templateObj) ||
                    !((_a = templateObj.templateData) === null || _a === void 0 ? void 0 : _a.html)) {
                    templateObj = await template_model_1.default.findById(((_c = (_b = cv.template) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b)) || cv.template);
                }
                if (templateObj &&
                    templateObj.templateData &&
                    templateObj.templateData.html) {
                    const latestCV = cv.toObject ? cv.toObject() : cv;
                    (0, template_thumbnail_service_1.generateCVThumbnail)(latestCV, templateObj)
                        .then((thumbnail) => {
                        cv.thumbnail = thumbnail;
                        return cv.save();
                    })
                        .catch((thumbErr) => {
                        console.error("Failed to regenerate CV thumbnail:", thumbErr);
                    });
                }
            }
            catch (thumbErr) {
                console.error("Failed to regenerate CV thumbnail:", thumbErr);
            }
        })();
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
        const filter = { _id: req.params.id };
        if (!req.user.isAdmin) {
            filter.userId = req.user._id;
        }
        const cv = await CV_model_1.default.findOneAndDelete(filter);
        if (!cv) {
            return res.status(404).json({
                success: false,
                message: "CV not found",
            });
        }
        return res.json({
            success: true,
            message: "CV deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting CV",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
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
        const cv = (await CV_model_1.default.findOne({
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
        const userId = req.user._id;
        const totalCVs = await CV_model_1.default.countDocuments({ userId });
        const lastWeekCVs = await CV_model_1.default.countDocuments({
            userId,
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        });
        const templateUsage = await CV_model_1.default.aggregate([
            { $match: { userId } },
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
        const skillAgg = await CV_model_1.default.aggregate([
            { $match: { userId } },
            { $unwind: "$skills" },
            { $group: { _id: "$skills.name", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);
        const mostCommonSkills = skillAgg.map((s) => ({
            name: s._id,
            count: s.count,
        }));
        const langAgg = await CV_model_1.default.aggregate([
            { $match: { userId } },
            { $unwind: "$languages" },
            { $group: { _id: "$languages.name", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);
        const mostCommonLanguages = langAgg.map((l) => ({
            name: l._id,
            count: l.count,
        }));
        const now = new Date();
        const lastYear = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
        const trendAgg = await CV_model_1.default.aggregate([
            { $match: { userId, createdAt: { $gte: lastYear } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const creationTrend = trendAgg.map((t) => ({
            month: t._id,
            count: t.count,
        }));
        const allCVs = await CV_model_1.default.find({ userId });
        let totalSections = 0;
        allCVs.forEach((cv) => {
            var _a, _b, _c, _d, _e, _f;
            totalSections +=
                (((_a = cv.education) === null || _a === void 0 ? void 0 : _a.length) ? 1 : 0) +
                    (((_b = cv.experience) === null || _b === void 0 ? void 0 : _b.length) ? 1 : 0) +
                    (((_c = cv.skills) === null || _c === void 0 ? void 0 : _c.length) ? 1 : 0) +
                    (((_d = cv.languages) === null || _d === void 0 ? void 0 : _d.length) ? 1 : 0) +
                    (((_e = cv.projects) === null || _e === void 0 ? void 0 : _e.length) ? 1 : 0) +
                    (((_f = cv.certifications) === null || _f === void 0 ? void 0 : _f.length) ? 1 : 0);
        });
        const avgSectionsPerCV = allCVs.length ? totalSections / allCVs.length : 0;
        const cvSectionCounts = allCVs.map((cv) => {
            var _a, _b, _c, _d, _e, _f;
            return ({
                id: cv._id,
                title: cv.title,
                sectionCount: (((_a = cv.education) === null || _a === void 0 ? void 0 : _a.length) ? 1 : 0) +
                    (((_b = cv.experience) === null || _b === void 0 ? void 0 : _b.length) ? 1 : 0) +
                    (((_c = cv.skills) === null || _c === void 0 ? void 0 : _c.length) ? 1 : 0) +
                    (((_d = cv.languages) === null || _d === void 0 ? void 0 : _d.length) ? 1 : 0) +
                    (((_e = cv.projects) === null || _e === void 0 ? void 0 : _e.length) ? 1 : 0) +
                    (((_f = cv.certifications) === null || _f === void 0 ? void 0 : _f.length) ? 1 : 0),
            });
        });
        cvSectionCounts.sort((a, b) => b.sectionCount - a.sectionCount);
        const mostSectionCVs = cvSectionCounts.slice(0, 5);
        res.json({
            success: true,
            data: {
                totalCVs,
                lastWeekCVs,
                templateUsage,
                mostCommonSkills,
                mostCommonLanguages,
                creationTrend,
                avgSectionsPerCV,
                mostSectionCVs,
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
const getAllCVs = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }
        const cvs = await CV_model_1.default.find().populate("userId", "firstName lastName email");
        return res.json({ success: true, data: cvs });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Error fetching CVs" });
    }
};
exports.getAllCVs = getAllCVs;
//# sourceMappingURL=cv.controller.js.map