import User from "../src/models/user.model";
import { connectDB } from "../src/database";

async function createAdmin() {
  try {
    await connectDB();

    const admin = await User.create({
      firstName: "Hristina",
      lastName: "Milkić",
      email: "milkichristina@gmail.com",
      password: "hristina123",
      isAdmin: true,
      isPremium: true,
      isRoot: true,
    });
    

    console.log("Admin user created:", admin);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
