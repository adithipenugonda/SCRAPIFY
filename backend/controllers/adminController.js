const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");
const User = require("../models/User");
const Collector = require("../models/Collector");
const Pickup = require("../models/Pickup");
const ScrapPrice = require("../models/ScrapPrice");
const Reward = require("../models/Reward");

const generateToken = require("../utils/generateToken");


// ==========================================
// REGISTER ADMIN
// ==========================================
const registerAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
    } = req.body;

    // Check Existing Admin
    const existingAdmin = await Admin.findOne({
      email,
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // Create Admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    // Generate Token
    const token = generateToken(
      admin._id,
      admin.role
    );

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",

      token,

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// LOGIN ADMIN
// ==========================================
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find Admin
    const admin = await Admin.findOne({
      email,
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update Last Login
    admin.lastLogin = Date.now();

    await admin.save();

    // Generate Token
    const token = generateToken(
      admin._id,
      admin.role
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",

      token,

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ADMIN DASHBOARD
// ==========================================
const getAdminDashboard = async (
  req,
  res
) => {
  try {
    // Counts
    const totalUsers =
      await User.countDocuments();

    const totalCollectors =
      await Collector.countDocuments();

    const totalPickups =
      await Pickup.countDocuments();

    const totalRewards =
      await Reward.countDocuments();

    // Pickup Status Analytics
    const pendingPickups =
      await Pickup.countDocuments({
        status: "Pending",
      });

    const completedPickups =
      await Pickup.countDocuments({
        status: "Completed",
      });

    // Revenue
    const completedPickupData =
      await Pickup.find({
        status: "Completed",
      });

    let totalRevenue = 0;

    completedPickupData.forEach((pickup) => {
      totalRevenue += pickup.totalAmount;
    });

    // Recent Pickups
    const recentPickups = await Pickup.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name")
      .populate("collector", "name");

    // Scrap Prices
    const scrapPrices =
      await ScrapPrice.find();

    res.status(200).json({
      success: true,

      dashboard: {
        analytics: {
          totalUsers,
          totalCollectors,
          totalPickups,
          totalRewards,
          pendingPickups,
          completedPickups,
          totalRevenue,
        },

        recentPickups,

        scrapPrices,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL USERS
// ==========================================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: users.length,

      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL COLLECTORS
// ==========================================
const getAllCollectors = async (
  req,
  res
) => {
  try {
    const collectors =
      await Collector.find().sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: collectors.length,

      collectors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// BLOCK / UNBLOCK USER
// ==========================================
const toggleUserBlock = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked
        ? "User blocked"
        : "User unblocked",

      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminDashboard,
  getAllUsers,
  getAllCollectors,
  toggleUserBlock,
};