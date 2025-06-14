import User from "../src/models/user.model";
import { connectDB } from "../src/database";

async function createAdmin() {
  try {
    await connectDB();

    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin-password",
      isAdmin: true,
      isPremium: true,
    });

    console.log("Admin user created:", admin);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
