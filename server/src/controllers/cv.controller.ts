import { Request, Response } from "express";
import { IUser } from "../interfaces/user.interface";
import CV from "../models/cv.model";
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

    const cv = await CV.create({
      user: req.user._id,
      template: templateId,
      data,
      title: data.personalInfo?.fullName || "Untitled CV",
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

    const cvs = await CV.find({ user: req.user._id })
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
      user: req.user._id,
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

    const cv = await CV.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { data, title },
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
      user: req.user._id,
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
      user: req.user._id,
    }).populate("template")) as PopulatedCV | null;

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }

    const cvData = cv.toObject();
    if (!cv.template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    const templateData = cv.template.toObject();
    const pdfBuffer = await PDFService.generatePDF(cvData, templateData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${cv.title}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
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

    const totalCVs = await CV.countDocuments({ user: req.user._id });
    const lastWeekCVs = await CV.countDocuments({
      user: req.user._id,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    const templateUsage = await CV.aggregate([
      { $match: { user: req.user._id } },
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
