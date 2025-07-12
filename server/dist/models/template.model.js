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
const SectionLayoutSchema = new mongoose_1.Schema({
    position: {
        type: String,
        enum: ["left", "right", "full"],
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    width: String,
    margin: String,
    padding: String,
    backgroundColor: String,
    textColor: String,
    fontSize: String,
    fontFamily: String,
    customStyles: {
        type: Map,
        of: String,
    },
}, { _id: false });
const SectionSchema = new mongoose_1.Schema({
    enabled: {
        type: Boolean,
        required: true,
        default: true,
    },
    layout: {
        type: SectionLayoutSchema,
        required: true,
    },
    required: {
        type: Boolean,
        default: false,
    },
    maxItems: Number,
    allowMultiple: {
        type: Boolean,
        default: true,
    },
}, { _id: false });
const TemplateSectionsSchema = new mongoose_1.Schema({
    personalDetails: {
        type: SectionSchema,
        required: true,
    },
    experience: {
        type: SectionSchema,
        required: true,
    },
    education: {
        type: SectionSchema,
        required: true,
    },
    websites: {
        type: SectionSchema,
        required: true,
    },
    skills: {
        type: SectionSchema,
        required: true,
    },
    languages: {
        type: SectionSchema,
        required: true,
    },
    courses: {
        type: SectionSchema,
        required: true,
    },
    projects: SectionSchema,
    certifications: SectionSchema,
    achievements: SectionSchema,
    references: SectionSchema,
    customSections: {
        type: Map,
        of: SectionSchema,
    },
}, { _id: false });
const TemplateStylesSchema = new mongoose_1.Schema({
    primaryColor: {
        type: String,
        required: true,
    },
    colorOptions: {
        type: [String],
    },
    secondaryColor: {
        type: String,
        required: true,
    },
    backgroundColor: {
        type: String,
        required: true,
    },
    fontFamily: {
        type: String,
        required: true,
    },
    fontSize: {
        type: String,
        required: true,
    },
    spacing: {
        type: String,
        required: true,
    },
    borderRadius: {
        type: String,
        required: true,
    },
    boxShadow: {
        type: String,
        required: true,
    },
    customStyles: {
        type: Map,
        of: String,
    },
}, { _id: false });
const TemplatePreviewSchema = new mongoose_1.Schema({
    thumbnail: {
        type: String,
        required: true,
    },
    previewImages: [
        {
            type: String,
            required: true,
        },
    ],
    demoUrl: String,
}, { _id: false });
const TemplateDataSchema = new mongoose_1.Schema({
    html: {
        type: String,
        required: true,
    },
    css: {
        type: String,
        required: true,
    },
    js: String,
}, { _id: false });
const TemplateDefaultDataSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    personalDetails: { type: Object, required: true },
    education: { type: [Object], required: true },
    experience: { type: [Object], required: true },
    skills: { type: [Object], required: true },
    languages: { type: [Object], required: true },
    projects: { type: [Object], required: true },
    certifications: { type: [Object], required: true },
    isPublic: { type: Boolean, required: true },
}, { _id: false });
const TemplateMetadataSchema = new mongoose_1.Schema({
    author: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    tags: [
        {
            type: String,
        },
    ],
    category: {
        type: String,
        required: true,
    },
    compatibility: [
        {
            type: String,
        },
    ],
}, { _id: false });
const TemplateUsageSchema = new mongoose_1.Schema({
    totalUses: {
        type: Number,
        default: 0,
    },
    lastUsed: Date,
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
}, { _id: false });
const TemplateSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    version: {
        type: String,
        required: true,
        default: "1.0.0",
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    sections: {
        type: TemplateSectionsSchema,
        required: true,
    },
    styles: {
        type: TemplateStylesSchema,
        required: true,
    },
    preview: {
        type: TemplatePreviewSchema,
        required: true,
    },
    templateData: {
        type: TemplateDataSchema,
        required: true,
    },
    defaultData: {
        type: TemplateDefaultDataSchema,
        required: true,
    },
    metadata: {
        type: TemplateMetadataSchema,
        required: true,
    },
    usage: {
        type: TemplateUsageSchema,
        default: () => ({}),
    },
}, {
    timestamps: true,
});
TemplateSchema.index({ name: 1 });
TemplateSchema.index({ "metadata.tags": 1 });
TemplateSchema.index({ "metadata.category": 1 });
TemplateSchema.index({ isPremium: 1 });
TemplateSchema.index({ isActive: 1 });
TemplateSchema.pre("save", function (next) {
    this.metadata.updatedAt = new Date();
    next();
});
exports.default = mongoose_1.default.model("Template", TemplateSchema);
//# sourceMappingURL=template.model.js.map