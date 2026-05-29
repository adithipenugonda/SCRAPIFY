const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");
const Admin = require("../models/User");

// Load Environment Variables from backend/.env
dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in your backend/.env file.");
  process.exit(1);
}

// Parse Command Line Arguments
// Usage: node createAdmin.js name="Admin User" email="admin@scrapify.com" password="adminpassword" phone="9876543210"
const args = {};
process.argv.slice(2).forEach((val) => {
  const [key, value] = val.split("=");
  if (key && value) {
    args[key.trim()] = value.trim();
  }
});

const name = args.name || "Admin User";
const email = args.email || "admin@scrapify.com";
const password = args.password || "admin123";
const phone = args.phone || "9999999999";

const seedAdmin = async () => {
  try {
    // Connect DB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected successfully.");

    // Check if Admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`Admin account with email "${email}" already exists.`);
      process.exit(0);
    }

    // Hash Password
    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "admin",
      permissions: {
        manageUsers: true,
        manageCollectors: true,
        manageScrapPrices: true,
        manageRewards: true,
        managePickups: true,
        viewAnalytics: true,
      },
      isSuperAdmin: true,
    });

    console.log("\n==============================================");
    console.log("SUCCESS: Admin User Created Manually in MongoDB!");
    console.log("----------------------------------------------");
    console.log(`Name:     ${admin.name}`);
    console.log(`Email:    ${admin.email}`);
    console.log(`Password: ${password} (stored securely hashed)`);
    console.log(`Phone:    ${admin.phone}`);
    console.log(`Role:     ${admin.role}`);
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
