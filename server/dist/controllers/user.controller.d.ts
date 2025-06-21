import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
export declare const getAllUsers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProfile: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateProfile: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateUserRole: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deactivateUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const userController: {
    createUser(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCurrentUser(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAllUsers(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateUser(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    changePassword(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    requestPasswordReset(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    resetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=user.controller.d.ts.map