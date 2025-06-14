import { Request, Response } from "express";
import { IUser } from "../interfaces/user.interface";
import Template from "../models/template.model";

interface AuthRequest extends Request {
  user?: IUser;
}

export const templateController = {
  async getTemplates(req: AuthRequest, res: Response) {
    try {
      const templates = await Template.find()
        .select("name thumbnail isPremium description")
        .sort({ isPremium: 1, name: 1 });

      res.json({
        success: true,
        data: templates,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching templates",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },

  async getTemplate(req: AuthRequest, res: Response) {
    try {
      const template = await Template.findById(req.params.id);

      if (!template) {
        return res.status(404).json({
          success: false,
          message: "Template not found",
        });
      }

      if (template.isPremium && (!req.user || !req.user.isPremium)) {
        return res.json({
          success: true,
          data: {
            _id: template._id,
            name: template.name,
            isPremium: true,
            description: template.description,
            preview: template.preview,
          },
        });
      }

      res.json({
        success: true,
        data: template,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching template",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
    return;
  },

  async createTemplate(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to create templates",
        });
      }

      const template = await Template.create(req.body);

      res.status(201).json({
        success: true,
        data: template,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating template",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
    return;
  },

  async updateTemplate(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update templates",
        });
      }

      const template = await Template.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!template) {
        return res.status(404).json({
          success: false,
          message: "Template not found",
        });
      }

      res.json({
        success: true,
        data: template,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating template",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
    return;
  },

  async deleteTemplate(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete templates",
        });
      }

      const template = await Template.findByIdAndDelete(req.params.id);

      if (!template) {
        return res.status(404).json({
          success: false,
          message: "Template not found",
        });
      }

      res.json({
        success: true,
        message: "Template deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting template",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
    return;
  },
};
