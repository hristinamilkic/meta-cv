"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.deactivateUser = exports.updateUserRole = exports.updateProfile = exports.getProfile = exports.login = exports.register = exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../models/User.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const email_service_1 = require("../services/email.service");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const getAllUsers = async (req, res) => {
    try {
        const users = await User_model_1.default.find({}).select("-password");
        return res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return res
            .status(500)
            .json({ success: false, message: "Error fetching users" });
    }
};
exports.getAllUsers = getAllUsers;
const createUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName, isAdmin, isPremium } = req.body;
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }
        if (isAdmin && !(req.user && req.user.isRoot)) {
            return res.status(403).json({
                success: false,
                message: "Only root admins can create admin users. Use /create-admin.",
            });
        }
        const existingUser = await User_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }
        const user = new User_model_1.default({
            email,
            password,
            firstName,
            lastName,
            isAdmin: false,
            isPremium: !!isPremium,
        });
        await user.save();
        return res.status(201).json({
            success: true,
            data: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin,
                isPremium: user.isPremium,
                isRoot: user.isRoot,
            },
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res
            .status(500)
            .json({ success: false, message: "Error creating user" });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }
        const user = await User_model_1.default.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        delete updates.password;
        delete updates.isAdmin;
        delete updates.isActive;
        const updatedUser = await User_model_1.default.findByIdAndUpdate(id, updates, {
            new: true,
        }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found after update",
            });
        }
        return res.status(200).json({
            success: true,
            data: {
                id: updatedUser._id,
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                isAdmin: updatedUser.isAdmin,
                isPremium: updatedUser.isPremium,
                isRoot: updatedUser.isRoot,
            },
        });
    }
    catch (error) {
        console.error("Error updating user:", error);
        return res
            .status(500)
            .json({ success: false, message: "Error updating user" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    var _a;
    try {
        const { userId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }
        const user = await User_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (user.isRoot) {
            return res
                .status(403)
                .json({ success: false, message: "Cannot delete root admin." });
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id.toString()) === user.id.toString()) {
            return res
                .status(403)
                .json({ success: false, message: "You cannot delete yourself." });
        }
        await User_model_1.default.findByIdAndDelete(userId);
        return res
            .status(200)
            .json({ success: true, message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        return res
            .status(500)
            .json({ success: false, message: "Error deleting user" });
    }
};
exports.deleteUser = deleteUser;
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }
        const existingUser = await User_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }
        const user = new User_model_1.default({
            email,
            password,
            firstName,
            lastName,
            isAdmin: false,
            isPremium: false,
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: "24h" });
        return res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isAdmin: user.isAdmin,
                    isPremium: user.isPremium,
                    isRoot: user.isRoot,
                },
            },
        });
    }
    catch (error) {
        console.error("Error registering user:", error);
        return res
            .status(500)
            .json({ success: false, message: "Error registering user" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }
        const user = await User_model_1.default.findOne({ email }).select("+password");
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        user.lastLogin = new Date();
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: "24h" });
        return res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isAdmin: user.isAdmin,
                    isPremium: user.isPremium,
                    isRoot: user.isRoot,
                },
            },
        });
    }
    catch (error) {
        console.error("Error logging in:", error);
        return res
            .status(500)
            .json({ success: false, message: "Error logging in" });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }
        const user = await User_model_1.default.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.json({ success: true, data: user });
    }
    catch (error) {
        console.error("Error fetching profile:", error);
        return res
            .status(500)
            .json({ success: false, message: "Error fetching profile" });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const { firstName, lastName, phone, currentPassword, newPassword } = req.body;
        const user = await User_model_1.default.findById(req.user._id).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (firstName)
            user.firstName = firstName;
        if (lastName)
            user.lastName = lastName;
        if (phone !== undefined)
            user.phone = phone;
        if (currentPassword && newPassword) {
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ message: "Current password is incorrect" });
            }
            user.password = newPassword;
        }
        await user.save();
        const userResponse = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            isPremium: user.isPremium,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        res.json({
            message: "Profile updated successfully",
            user: userResponse,
        });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile" });
    }
    return;
};
exports.updateProfile = updateProfile;
const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isAdmin, isPremium } = req.body;
        const user = await User_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (typeof isAdmin === "boolean")
            user.isAdmin = isAdmin;
        if (typeof isPremium === "boolean")
            user.isPremium = isPremium;
        await user.save();
        return res.json({
            success: true,
            message: "User role updated successfully",
        });
    }
    catch (error) {
        console.error("Error updating user role:", error);
        return res
            .status(500)
            .json({ success: false, message: "Error updating user role" });
    }
};
exports.updateUserRole = updateUserRole;
const deactivateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        user.isActive = false;
        await user.save();
        return res.json({
            success: true,
            message: "User deactivated successfully",
        });
    }
    catch (error) {
        console.error("Error deactivating user:", error);
        return res
            .status(500)
            .json({ success: false, message: "Error deactivating user" });
    }
};
exports.deactivateUser = deactivateUser;
exports.userController = {
    async createUser(req, res) {
        var _a;
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
                return res
                    .status(403)
                    .json({ message: "Only admins can create users" });
            }
            if (req.body.isAdmin && !req.user.isRoot) {
                return res.status(403).json({
                    success: false,
                    message: "Only root admins can create admin users. Use /create-admin.",
                });
            }
            const { firstName, lastName, email, password, isPremium } = req.body;
            const existingUser = await User_model_1.default.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(password, salt);
            const user = new User_model_1.default({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                isPremium: isPremium || false,
                isAdmin: false,
            });
            await user.save();
            res.status(201).json({
                message: "User created successfully",
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isPremium: user.isPremium,
                    isAdmin: user.isAdmin,
                    isRoot: user.isRoot,
                },
            });
        }
        catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ message: "Error creating user" });
        }
        return;
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User_model_1.default.findOne({ email }).select("+password");
            if (!user || !user.isActive) {
                return res.status(400).json({ message: "Invalid credentials" });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }
            user.lastLogin = new Date();
            await user.save();
            const token = jsonwebtoken_1.default.sign({ userId: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: "24h" });
            res.json({
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isPremium: user.isPremium,
                    isAdmin: user.isAdmin,
                    isRoot: user.isRoot,
                },
            });
        }
        catch (error) {
            console.error("Error logging in:", error);
            res.status(500).json({ message: "Error logging in" });
        }
        return;
    },
    async getCurrentUser(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Not authenticated" });
            }
            const user = await User_model_1.default.findById(req.user._id).select("-password");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isPremium: user.isPremium,
                isAdmin: user.isAdmin,
                isRoot: user.isRoot,
            });
        }
        catch (error) {
            console.error("Error getting user:", error);
            res.status(500).json({ message: "Error getting user" });
        }
        return;
    },
    async getAllUsers(req, res) {
        var _a;
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
                return res
                    .status(403)
                    .json({ message: "Only admins can view all users" });
            }
            const users = await User_model_1.default.find().select("-password");
            res.json(users);
        }
        catch (error) {
            console.error("Error getting users:", error);
            res.status(500).json({ message: "Error getting users" });
        }
        return;
    },
    async updateUser(req, res) {
        var _a;
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
                return res
                    .status(403)
                    .json({ message: "Only admins can update users" });
            }
            const { userId } = req.params;
            const { firstName, lastName, email, isPremium } = req.body;
            const user = await User_model_1.default.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (firstName)
                user.firstName = firstName;
            if (lastName)
                user.lastName = lastName;
            if (email)
                user.email = email;
            if (typeof isPremium === "boolean")
                user.isPremium = isPremium;
            await user.save();
            res.json({
                message: "User updated successfully",
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isPremium: user.isPremium,
                    isAdmin: user.isAdmin,
                    isRoot: user.isRoot,
                },
            });
        }
        catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ message: "Error updating user" });
        }
        return;
    },
    async updateProfile(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Not authenticated" });
            }
            const { firstName, lastName, phone, currentPassword, newPassword } = req.body;
            const user = await User_model_1.default.findById(req.user._id).select("+password");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (firstName)
                user.firstName = firstName;
            if (lastName)
                user.lastName = lastName;
            if (phone !== undefined)
                user.phone = phone;
            if (currentPassword && newPassword) {
                const isMatch = await user.comparePassword(currentPassword);
                if (!isMatch) {
                    return res
                        .status(401)
                        .json({ message: "Current password is incorrect" });
                }
                user.password = newPassword;
            }
            await user.save();
            const userResponse = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                isPremium: user.isPremium,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isRoot: user.isRoot,
            };
            res.json({
                message: "Profile updated successfully",
                user: userResponse,
            });
        }
        catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).json({ message: "Error updating profile" });
        }
        return;
    },
    async changePassword(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Not authenticated" });
            }
            const { currentPassword, newPassword } = req.body;
            const user = await User_model_1.default.findById(req.user._id).select("+password");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ message: "Current password is incorrect" });
            }
            user.password = newPassword;
            await user.save();
            res.json({ message: "Password updated successfully" });
        }
        catch (error) {
            console.error("Error changing password:", error);
            res.status(500).json({ message: "Error changing password" });
        }
        return;
    },
    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            const user = await User_model_1.default.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const resetToken = user.generatePasswordResetToken();
            await user.save();
            try {
                await email_service_1.emailService.sendPasswordResetEmail(email, resetToken);
                res.json({
                    message: "Password reset email sent successfully",
                });
            }
            catch (emailError) {
                console.error("Error sending email:", emailError);
                res.status(500).json({
                    message: "Error sending password reset email. Please try again later.",
                });
            }
        }
        catch (error) {
            console.error("Error requesting password reset:", error);
            res.status(500).json({ message: "Error requesting password reset" });
        }
        return;
    },
    async resetPassword(req, res) {
        try {
            const { code, "new-password": newPassword } = req.body;
            if (!code || !newPassword) {
                return res.status(400).json({
                    message: "Code and new-password are required",
                });
            }
            const resetPasswordToken = crypto_1.default
                .createHash("sha256")
                .update(code)
                .digest("hex");
            const user = await User_model_1.default.findOne({
                resetPasswordToken,
                resetPasswordExpire: { $gt: Date.now() },
            });
            if (!user) {
                return res
                    .status(400)
                    .json({ message: "Invalid or expired reset code" });
            }
            user.password = newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.json({ message: "Password reset successful" });
        }
        catch (error) {
            console.error("Error resetting password:", error);
            res.status(500).json({ message: "Error resetting password" });
        }
        return;
    },
    async logout(req, res) {
        try {
            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
            });
            res.json({ message: "Logged out successfully" });
        }
        catch (error) {
            console.error("Error during logout:", error);
            res.status(500).json({ message: "Error during logout" });
        }
        return;
    },
    async verifyResetCode(req, res) {
        try {
            const { code } = req.body;
            if (!code) {
                return res
                    .status(400)
                    .json({ valid: false, message: "Code is required" });
            }
            const resetPasswordToken = crypto_1.default
                .createHash("sha256")
                .update(code)
                .digest("hex");
            const user = await User_model_1.default.findOne({
                resetPasswordToken,
                resetPasswordExpire: { $gt: Date.now() },
            });
            if (!user) {
                return res
                    .status(400)
                    .json({ valid: false, message: "Invalid or expired reset code" });
            }
            return res.json({ valid: true });
        }
        catch (error) {
            console.error("Error verifying reset code:", error);
            return res
                .status(500)
                .json({ valid: false, message: "Error verifying reset code" });
        }
    },
    async updateUserPasswordByRoot(req, res) {
        var _a;
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isRoot)) {
                return res
                    .status(403)
                    .json({ success: false, message: "Root admin access required" });
            }
            const { userId } = req.params;
            const { newPassword } = req.body;
            if (!newPassword) {
                return res
                    .status(400)
                    .json({ success: false, message: "New password is required" });
            }
            const user = await User_model_1.default.findById(userId);
            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, message: "User not found" });
            }
            user.password = newPassword;
            await user.save();
            return res.status(200).json({
                success: true,
                message: "Password updated successfully by root admin",
            });
        }
        catch (error) {
            console.error("Error updating user password by root:", error);
            return res
                .status(500)
                .json({ success: false, message: "Error updating user password" });
        }
    },
    async createAdminByRoot(req, res) {
        var _a;
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isRoot)) {
                return res
                    .status(403)
                    .json({ success: false, message: "Root admin access required" });
            }
            const { firstName, lastName, email, password } = req.body;
            if (!firstName || !lastName || !email || !password) {
                return res
                    .status(400)
                    .json({ success: false, message: "All fields are required" });
            }
            const existingUser = await User_model_1.default.findOne({ email });
            if (existingUser) {
                return res
                    .status(400)
                    .json({ success: false, message: "Email already registered" });
            }
            const user = new User_model_1.default({
                firstName,
                lastName,
                email,
                password,
                isAdmin: true,
                isPremium: true,
            });
            await user.save();
            return res.status(201).json({
                success: true,
                message: "Admin created successfully",
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    isPremium: user.isPremium,
                    isRoot: user.isRoot,
                },
            });
        }
        catch (error) {
            console.error("Error creating admin by root:", error);
            return res
                .status(500)
                .json({ success: false, message: "Error creating admin" });
        }
    },
};
//# sourceMappingURL=user.controller.js.map