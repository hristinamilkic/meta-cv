"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const API_URL = process.env.API_URL || "http://localhost:3001/api";
const testAdmin = async () => {
    var _a;
    try {
        console.log("\n1. Testing admin login...");
        const loginResponse = await axios_1.default.post(`${API_URL}/users/login`, {
            email: "milkichristina@gmail.com",
            password: "hristinaAdminPassword",
        });
        const token = loginResponse.data.token;
        console.log("Login successful! Token received.");
        axios_1.default.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("\n2. Testing get user profile...");
        const profileResponse = await axios_1.default.get(`${API_URL}/users/me`);
        console.log("User profile:", profileResponse.data);
        console.log("\n3. Testing admin-only route...");
        const usersResponse = await axios_1.default.get(`${API_URL}/users/all`);
        console.log("All users:", usersResponse.data);
        console.log("\nAll admin tests completed successfully!");
    }
    catch (error) {
        console.error("Error during testing:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        process.exit(1);
    }
};
testAdmin();
//# sourceMappingURL=testAdmin.js.map