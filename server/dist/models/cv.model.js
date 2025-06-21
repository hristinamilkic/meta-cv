"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const EducationSchema = new mongoose_1.Schema({
    institution: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    description: String,
    location: String,
}, { _id: false });
const ExperienceSchema = new mongoose_1.Schema({
    company: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    startDate: Date,
    endDate: Date,
    description: String,
    location: String,
    highlights: [String],
}, { _id: false });
const SkillSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
        default: "Intermediate",
    },
}, { _id: false });
const LanguageSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    proficiency: {
        type: String,
        enum: ["Basic", "Conversational", "Fluent", "Native"],
        default: "Conversational",
    },
}, { _id: false });
const ProjectSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    startDate: Date,
    endDate: Date,
    url: String,
    technologies: [String],
    highlights: [String],
}, { _id: false });
const CertificationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    issuer: {
        type: String,
        required: true,
    },
    date: Date,
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String,
}, { _id: false });
const CVSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    template: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Template",
        required: false,
    },
    personalDetails: {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: String,
        location: String,
        website: String,
        linkedin: String,
        github: String,
        summary: String,
    },
    education: [EducationSchema],
    experience: [ExperienceSchema],
    skills: [SkillSchema],
    languages: [LanguageSchema],
    projects: [ProjectSchema],
    certifications: [CertificationSchema],
    isPublic: {
        type: Boolean,
        default: false,
    },
    lastModified: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
CVSchema.index({ userId: 1 });
CVSchema.index({ title: 1 });
CVSchema.index({ isPublic: 1 });
CVSchema.index({ "personalDetails.email": 1 });
CVSchema.pre("save", function (next) {
    this.lastModified = new Date();
    next();
});
exports.default = mongoose_1.default.model("CV", CVSchema);
//# sourceMappingURL=cv.model.js.map