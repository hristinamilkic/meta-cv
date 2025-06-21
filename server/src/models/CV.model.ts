import mongoose, { Schema } from "mongoose";

const EducationSchema = new Schema(
  {
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
  },
  { _id: false }
);

const ExperienceSchema = new Schema(
  {
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
  },
  { _id: false }
);

const SkillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate",
    },
  },
  { _id: false }
);

const LanguageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    proficiency: {
      type: String,
      enum: ["Basic", "Conversational", "Fluent", "Native"],
      default: "Conversational",
    },
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
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
  },
  { _id: false }
);

const CertificationSchema = new Schema(
  {
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
  },
  { _id: false }
);

const CVSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    template: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

CVSchema.index({ userId: 1 });
CVSchema.index({ title: 1 });
CVSchema.index({ isPublic: 1 });
CVSchema.index({ "personalDetails.email": 1 });

CVSchema.pre("save", function (next) {
  this.lastModified = new Date();
  next();
});

export default mongoose.model("CV", CVSchema);
