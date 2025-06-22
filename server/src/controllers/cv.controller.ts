import { Request, Response } from "express";
import { IUser } from "../interfaces/user.interface";
import CV from "../models/CV.model";
import { PDFService } from "../services/pdf.service";
import templateModel from "../models/template.model";
import { ICV } from "../interfaces/cv.interface";
import { ITemplate } from "../interfaces/template.interface";

interface AuthRequest extends Request {
  user?: IUser;
}

interface PopulatedCV extends ICV {
  template: ITemplate;
}

export const createCV = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const { templateId, data } = req.body;

    const template = await templateModel.findById(templateId);
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

    // Map client data structure to server structure
    const personalDetails = data.personalDetails || data.personalInfo || {};
    const title =
      data.title ||
      personalDetails.fullName ||
      personalDetails.firstName ||
      "Untitled CV";

    const cv = await CV.create({
      userId: req.user._id,
      title,
      personalDetails,
      education: data.education || [],
      experience: data.experience || [],
      skills: data.skills || [],
      languages: data.languages || [],
      projects: data.projects || [],
      certifications: data.certifications || [],
      isPublic: data.isPublic ?? false,
      template: templateId,
    });

    res.status(201).json({
      success: true,
      data: cv,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating CV",
      error: error instanceof Error ? error.message : "Unknown error",
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

    const cvs = await CV.find({ userId: req.user._id })
      .populate("template", "name thumbnail")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: cvs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching CVs",
      error: error instanceof Error ? error.message : "Unknown error",
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching CV",
      error: error instanceof Error ? error.message : "Unknown error",
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

    const { data, title } = req.body;

    // Map client data structure to server structure
    const updateData: any = {};

    if (data) {
      // Handle personal details mapping
      if (data.personalDetails || data.personalInfo) {
        updateData.personalDetails = data.personalDetails || data.personalInfo;
      }

      // Handle other fields
      if (data.education) updateData.education = data.education;
      if (data.experience) updateData.experience = data.experience;
      if (data.skills) updateData.skills = data.skills;
      if (data.languages) updateData.languages = data.languages;
      if (data.projects) updateData.projects = data.projects;
      if (data.certifications) updateData.certifications = data.certifications;
      if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;
    }

    if (title) {
      updateData.title = title;
    }

    const cv = await CV.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateData,
      { new: true }
    ).populate("template");

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating CV",
      error: error instanceof Error ? error.message : "Unknown error",
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

    res.json({
      success: true,
      message: "CV deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting CV",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
  return;
};

export const downloadCV = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const cv = (await CV.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("template")) as PopulatedCV | null;

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

    // Convert to plain object and ensure proper structure
    const cvData = cv.toObject();
    const templateData = cv.template.toObject();

    // Ensure all required fields exist
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

    const pdfBuffer = await PDFService.generatePDF(
      structuredCVData,
      templateData
    );

    // Sanitize filename for Content-Disposition header
    let safeTitle = (cv.title || "CV").replace(/[^a-zA-Z0-9-_\. ]/g, "_");
    if (!safeTitle.trim()) safeTitle = "CV";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeTitle}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Download CV error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating PDF",
      error: error instanceof Error ? error.message : "Unknown error",
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
    const lastWeekCVs = await CV.countDocuments({
      userId: req.user._id,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    const templateUsage = await CV.aggregate([
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching CV analytics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
  return;
};
