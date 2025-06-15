import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.API_URL || "http://localhost:3001/api";

const testAdmin = async () => {
  try {
    // 1. Test admin login
    console.log("\n1. Testing admin login...");
    const loginResponse = await axios.post(`${API_URL}/users/login`, {
      email: "milkichristina@gmail.com",
      password: "hristinaAdminPassword",
    });

    const token = loginResponse.data.token;
    console.log("Login successful! Token received.");

    // Set auth header for subsequent requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // 2. Test getting user profile
    console.log("\n2. Testing get user profile...");
    const profileResponse = await axios.get(`${API_URL}/users/me`);
    console.log("User profile:", profileResponse.data);

    // 3. Test admin-only route (getting all users)
    console.log("\n3. Testing admin-only route...");
    const usersResponse = await axios.get(`${API_URL}/users/all`);
    console.log("All users:", usersResponse.data);

    console.log("\nAll admin tests completed successfully!");
  } catch (error: any) {
    console.error(
      "Error during testing:",
      error.response?.data || error.message
    );
    process.exit(1);
  }
};

testAdmin();
