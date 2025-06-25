import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: any;
}

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
  return;
};

export const requireRoot = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isRoot) {
    return res.status(403).json({
      success: false,
      message: "Root admin access required",
    });
  }
  next();
  return;
};
