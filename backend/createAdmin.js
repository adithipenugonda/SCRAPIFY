const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");
const User = require("./models/User");

// Load Environment Variables from backend/.env
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in your backend/.env file.");
  process.exit(1);
}

// Credentials from User Request
const name = "System Admin";
const email = "adminn@gmail.com";
const password = "12345678";
const phone = "9999999999"; // Default phone since it is a required field

const seedAdmin = async () => {
  try {
    // Connect DB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected successfully.");

    // Check if Admin exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log(`Admin account with email "${email}" already exists in the users collection.`);
      mongoose.connection.close();
      process.exit(0);
    }

    // Hash Password
    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Admin in unified users collection
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "admin",
      isSuperAdmin: true,
      permissions: {
        manageUsers: true,
        manageCollectors: true,
        manageScrapPrices: true,
        manageRewards: true,
        managePickups: true,
        viewAnalytics: true,
      },
    });

    console.log("\n==============================================");
    console.log("SUCCESS: Admin User Created in Users Collection!");
    console.log("----------------------------------------------");
    console.log(`Name:     ${admin.name}`);
    console.log(`Email:    ${admin.email}`);
    console.log(`Password: ${password} (stored securely hashed)`);
    console.log(`Role:     ${admin.role}`);
    console.log(`SuperAdmin: ${admin.isSuperAdmin}`);
    console.log("==============================================\n");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error.message);
    if (mongoose.connection.readyState !== 0) {
      mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedAdmin();
