import User from "../src/models/user.model";
import { connectDB } from "../src/database";

async function createAdmins() {
  try {
    await connectDB();

    const admin1 = await User.create({
      firstName: "Miroslav",
      lastName: "Mikić",
      email: "mmikic@gmail.com",
      password: "miroslav123",
      isAdmin: true,
      isPremium: true,
    });

    const admin2 = await User.create({
      firstName: "Jelena",
      lastName: "Jasminić",
      email: "jjasminic@gmail.com",
      password: "jelena123",
      isAdmin: true,
      isPremium: true,
    });

    console.log("Admins user created:", admin1, admin2);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmins();
