import { Request, Response } from "express";
// import { ICV } from "../interfaces/cv.interface";
import { IUser } from "../interfaces/user.interface";
import CV from "../models/cv.model";

interface AuthRequest extends Request {
  user?: IUser;
}

export const createCV = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const cv = new CV({
      ...req.body,
      userId: req.user._id,
    });

    await cv.save();
    res.status(201).json({
      success: true,
      data: cv,
    });
  } catch (error) {
    console.error("Error creating CV:", error);
    res.status(500).json({
      success: false,
      message: "Error creating CV",
    });
  }
  return;
};

export const getUserCVs = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const cvs = await CV.find({ userId: req.user._id }).sort({
      lastModified: -1,
    });

    res.status(200).json({
      success: true,
      data: cvs,
    });
  } catch (error) {
    console.error("Error fetching CVs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching CVs",
    });
  }
  return;
};

export const getCVById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const cv = await CV.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }

    res.status(200).json({
      success: true,
      data: cv,
    });
  } catch (error) {
    console.error("Error fetching CV:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching CV",
    });
  }
  return;
};

export const updateCV = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const cv = await CV.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, lastModified: new Date() },
      { new: true }
    );

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }

    res.status(200).json({
      success: true,
      data: cv,
    });
  } catch (error) {
    console.error("Error updating CV:", error);
    res.status(500).json({
      success: false,
      message: "Error updating CV",
    });
  }
  return;
};

export const deleteCV = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const cv = await CV.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "CV deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting CV:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting CV",
    });
  }
  return;
};

export const getCVAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const totalCVs = await CV.countDocuments({ userId: req.user._id });
    const lastMonthCVs = await CV.countDocuments({
      userId: req.user._id,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    const publicCVs = await CV.countDocuments({
      userId: req.user._id,
      isPublic: true,
    });

    res.status(200).json({
      success: true,
      data: {
        totalCVs,
        lastMonthCVs,
        publicCVs,
      },
    });
  } catch (error) {
    console.error("Error fetching CV analytics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching CV analytics",
    });
  }
  return;
};
