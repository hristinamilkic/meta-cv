import mongoose, { Schema } from "mongoose";

const experienceSchema = new Schema({
  jobTitle: String,
  company: String,
  city: String,
  startDate: Date,
  endDate: Date,
  currentlyWorkHere: Boolean,
  description: String,
});

const educationSchema = new Schema({
  school: String,
  degree: String,
  city: String,
  startDate: Date,
  endDate: Date,
  currentlyStudyHere: Boolean,
  description: String,
});

const skillSchema = new Schema({
  skillName: String,
  level: String,
});

const languageSchema = new Schema({
  languageName: String,
  level: String,
});

const courseSchema = new Schema({
  courseName: String,
  institution: String,
});

const cvSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  templateId: { type: Schema.Types.ObjectId, ref: "Template" },
  sections: {
    personalDetails: {
      firstName: String,
      lastName: String,
      phone: String,
      country: String,
      jobTitle: String,
      city: String,
      emailAddress: String,
      dateOfBirth: Date,
      photoUrl: String,
      professionalSummary: String,
    },
    experience: [experienceSchema],
    education: [educationSchema],
    websites: [String],
    skills: [skillSchema],
    languages: [languageSchema],
    courses: [courseSchema],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["draft", "completed"], default: "draft" },
});

export const CV = mongoose.model("CV", cvSchema);
