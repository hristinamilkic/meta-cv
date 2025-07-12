import { Request, Response, NextFunction } from "express";
interface AuthRequest extends Request {
    user?: any;
}
export declare const requireAdmin: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireRoot: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=admin.middleware.d.ts.map