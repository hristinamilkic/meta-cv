import { Document } from "mongoose";
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isPremium: boolean;
    isAdmin: boolean;
    isActive: boolean;
    lastLogin?: Date;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generatePasswordResetToken(): string;
}
declare const _default: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=user.model.d.ts.map