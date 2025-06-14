import mongoose, { Schema } from "mongoose";
import { ITemplate } from "../interfaces/template.interface";

const SectionLayoutSchema = new Schema(
  {
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
  },
  { _id: false }
);

const SectionSchema = new Schema(
  {
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
  },
  { _id: false }
);

const TemplateSectionsSchema = new Schema(
  {
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
  },
  { _id: false }
);

const TemplateStylesSchema = new Schema(
  {
    primaryColor: {
      type: String,
      required: true,
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
  },
  { _id: false }
);

const TemplatePreviewSchema = new Schema(
  {
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
  },
  { _id: false }
);

const TemplateDataSchema = new Schema(
  {
    html: {
      type: String,
      required: true,
    },
    css: {
      type: String,
      required: true,
    },
    js: String,
  },
  { _id: false }
);

const TemplateMetadataSchema = new Schema(
  {
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
  },
  { _id: false }
);

const TemplateUsageSchema = new Schema(
  {
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
  },
  { _id: false }
);

const TemplateSchema = new Schema(
  {
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
    metadata: {
      type: TemplateMetadataSchema,
      required: true,
    },
    usage: {
      type: TemplateUsageSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
TemplateSchema.index({ name: 1 });
TemplateSchema.index({ "metadata.tags": 1 });
TemplateSchema.index({ "metadata.category": 1 });
TemplateSchema.index({ isPremium: 1 });
TemplateSchema.index({ isActive: 1 });

TemplateSchema.pre("save", function (next) {
  this.metadata.updatedAt = new Date();
  next();
});

export default mongoose.model<ITemplate>("Template", TemplateSchema);
