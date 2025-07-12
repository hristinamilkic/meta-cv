import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User.model";
export interface AuthRequest extends Request {
    user?: IUser;
}
export declare const requireAuth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const checkPremium: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.middleware.d.ts.map