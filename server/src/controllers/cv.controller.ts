import { Request, Response } from "express";
import { IUser } from "../interfaces/user.interface";
import CV from "../models/CV.model";
import { PDFService } from "../services/pdf.service";
import templateModel from "../models/template.model";
import { ICV } from "../interfaces/cv.interface";
import { ITemplate } from "../interfaces/template.interface";
import { generateCVThumbnail } from "../services/template-thumbnail.service";

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

    const defaultData = template.defaultData || {};
    const mergedData = {
      ...defaultData,
      ...data,
      personalDetails: {
        ...defaultData.personalDetails,
        ...(data?.personalDetails || {}),
      },
      education: data?.education || defaultData.education || [],
      experience: data?.experience || defaultData.experience || [],
      skills: data?.skills || defaultData.skills || [],
      languages: data?.languages || defaultData.languages || [],
      projects: data?.projects || defaultData.projects || [],
      certifications: data?.certifications || defaultData.certifications || [],
      isPublic: data?.isPublic ?? defaultData.isPublic ?? false,
    };

    const title =
      mergedData.title ||
      mergedData.personalDetails?.fullName ||
      mergedData.personalDetails?.firstName ||
      "Untitled CV";

    const requiredErrors: string[] = [];
    if (!mergedData.personalDetails?.fullName)
      requiredErrors.push("Full name is required");
    if (!mergedData.personalDetails?.email)
      requiredErrors.push("Email is required");
    (mergedData.education || []).forEach((edu: any, i: number) => {
      if (!edu.institution)
        requiredErrors.push(`Education[${i + 1}]: Institution is required`);
      if (!edu.degree)
        requiredErrors.push(`Education[${i + 1}]: Degree is required`);
    });
    (mergedData.experience || []).forEach((exp: any, i: number) => {
      if (!exp.company)
        requiredErrors.push(`Experience[${i + 1}]: Company is required`);
      if (!exp.position)
        requiredErrors.push(`Experience[${i + 1}]: Position is required`);
    });
    (mergedData.skills || []).forEach((skill: any, i: number) => {
      if (!skill.name) requiredErrors.push(`Skill[${i + 1}]: Name is required`);
    });
    (mergedData.languages || []).forEach((lang: any, i: number) => {
      if (!lang.name)
        requiredErrors.push(`Language[${i + 1}]: Name is required`);
    });
    (mergedData.projects || []).forEach((proj: any, i: number) => {
      if (!proj.name)
        requiredErrors.push(`Project[${i + 1}]: Name is required`);
    });
    (mergedData.certifications || []).forEach((cert: any, i: number) => {
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

    const cv = await CV.create({
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

    generateCVThumbnail(mergedData, template)
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

    const updateData: any = {};

    if (data) {
      if (data.personalDetails || data.personalInfo) {
        updateData.personalDetails = data.personalDetails || data.personalInfo;
      }

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

    (async () => {
      try {
        let templateObj: any = cv.template;
        if (
          !templateObj ||
          typeof templateObj !== "object" ||
          !("templateData" in templateObj) ||
          !templateObj.templateData?.html
        ) {
          templateObj = await templateModel.findById(
            cv.template?.toString?.() || cv.template
          );
        }
        if (
          templateObj &&
          templateObj.templateData &&
          templateObj.templateData.html
        ) {
          const latestCV = cv.toObject ? cv.toObject() : cv;
          generateCVThumbnail(latestCV, templateObj)
            .then((thumbnail) => {
              cv.thumbnail = thumbnail;
              return cv.save();
            })
            .catch((thumbErr) => {
              console.error("Failed to regenerate CV thumbnail:", thumbErr);
            });
        }
      } catch (thumbErr) {
        console.error("Failed to regenerate CV thumbnail:", thumbErr);
      }
    })();

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
    const filter: any = { _id: req.params.id };
    if (!req.user.isAdmin) {
      filter.userId = req.user._id;
    }
    const cv = await CV.findOneAndDelete(filter);
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting CV",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
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

    const pdfBuffer = await PDFService.generatePDF(
      structuredCVData,
      templateData
    );

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

    const userId = req.user._id;

    // Total CVs
    const totalCVs = await CV.countDocuments({ userId });
    // CVs created in the last week
    const lastWeekCVs = await CV.countDocuments({
      userId,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    // Template usage
    const templateUsage = await CV.aggregate([
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

    // Most common skills
    const skillAgg = await CV.aggregate([
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

    // Most common languages
    const langAgg = await CV.aggregate([
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

    // CV creation trend (per month for last 12 months)
    const now = new Date();
    const lastYear = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
    const trendAgg = await CV.aggregate([
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

    // Average number of sections per CV
    const allCVs = await CV.find({ userId });
    let totalSections = 0;
    allCVs.forEach((cv) => {
      totalSections +=
        (cv.education?.length ? 1 : 0) +
        (cv.experience?.length ? 1 : 0) +
        (cv.skills?.length ? 1 : 0) +
        (cv.languages?.length ? 1 : 0) +
        (cv.projects?.length ? 1 : 0) +
        (cv.certifications?.length ? 1 : 0);
    });
    const avgSectionsPerCV = allCVs.length ? totalSections / allCVs.length : 0;

    // CVs with the most sections
    const cvSectionCounts = allCVs.map((cv) => ({
      id: cv._id,
      title: cv.title,
      sectionCount:
        (cv.education?.length ? 1 : 0) +
        (cv.experience?.length ? 1 : 0) +
        (cv.skills?.length ? 1 : 0) +
        (cv.languages?.length ? 1 : 0) +
        (cv.projects?.length ? 1 : 0) +
        (cv.certifications?.length ? 1 : 0),
    }));
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching CV analytics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
  return;
};

export const getAllCVs = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const cvs = await CV.find().populate("userId", "firstName lastName email");
    return res.json({ success: true, data: cvs });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error fetching CVs" });
  }
};
