import { Request, Response } from "express";
import { IUser } from "../interfaces/user.interface";
interface AuthRequest extends Request {
    user?: IUser;
}
export declare const templateController: {
    getTemplates(req: AuthRequest, res: Response): Promise<void>;
    getTemplate(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createTemplate(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateTemplate(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteTemplate(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
export {};
//# sourceMappingURL=template.controller.d.ts.map