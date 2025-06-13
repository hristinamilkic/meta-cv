import { Request, Response } from "express";
// import { IUser } from "../interfaces/user.interface";
import Template from "../models/template.model";

// interface AuthRequest extends Request {
//   user?: IUser;
// }

export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await Template.find();
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching templates", error });
  }
};

export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ message: "Error fetching template", error });
  }
  return;
};

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const template = new Template(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: "Error creating template", error });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const template = await Template.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ message: "Error updating template", error });
  }
  return;
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.status(200).json({ message: "Template deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting template", error });
  }
  return;
};
