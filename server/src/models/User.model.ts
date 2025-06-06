import mongoose, { Schema } from "mongoose";
import { UserRole } from "../enums/roles.enum";

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.BASIC_USER,
  },
  createdCVs: [{ type: Schema.Types.ObjectId, ref: "CV" }],
  dashboardAnalytics: {
    cvHistory: [Schema.Types.Mixed],
    graphicalData: Schema.Types.Mixed,
  },
});

export const User = mongoose.model("User", userSchema);
