const bcrypt = require("bcryptjs");

const Admin = require("../models/User");
const User = require("../models/User");
const Collector = require("../models/User");
const Pickup = require("../models/Pickup");
const ScrapPrice = require("../models/ScrapPrice");
const Reward = require("../models/Reward");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");

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
      await User.countDocuments({ role: "user" });

    const totalCollectors =
      await Collector.countDocuments({ role: "collector" });

    const totalPickups =
      await Pickup.countDocuments();

    const totalRewards =
      await Reward.countDocuments();

    // Pickup Status Analytics
    const pendingPickups =
      await Pickup.countDocuments({
        status: "Pending",
      });

    const acceptedPickups =
      await Pickup.countDocuments({
        status: "Accepted",
      });

    const completedPickups =
      await Pickup.countDocuments({
        status: "Completed",
      });

    // Fetch Transaction Analytics
    const totalTransactionsCount = await Transaction.countDocuments();
    const successfulPaymentsCount = await Transaction.countDocuments({ paymentStatus: "Success" });
    const failedPaymentsCount = await Transaction.countDocuments({ paymentStatus: "Failed" });

    // Revenue & Green Points Generated
    const completedPickupData =
      await Pickup.find({
        status: "Completed",
      });

    let totalRevenue = 0;
    let totalGreenPointsGenerated = 0;

    completedPickupData.forEach((pickup) => {
      totalRevenue += (pickup.totalAmount || 0);
      totalGreenPointsGenerated += (pickup.greenPointsEarned || 0);
    });

    // Recent Pickups
    const recentPickups = await Pickup.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name")
      .populate("collector", "name");

    // Scrap Prices
    const scrapPrices = await ScrapPrice.find();

    // Fetch last 7 days of pickup data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const pickupsLast7Days = await Pickup.find({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Initialize dailyStats map for last 7 days
    const dailyStats = {};
    const daysName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = daysName[d.getDay()] + " " + d.getDate();
      dailyStats[dateStr] = { 
        date: dateStr, 
        name: dayLabel,
        pickups: 0, 
        earnings: 0 
      };
    }

    pickupsLast7Days.forEach(p => {
      const dateStr = p.createdAt.toISOString().split("T")[0];
      if (dailyStats[dateStr]) {
        dailyStats[dateStr].pickups += 1;
        if (p.status === "Completed") {
          dailyStats[dateStr].earnings += (p.totalAmount || 0);
        }
      }
    });

    const chartData = Object.values(dailyStats);

    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name")
      .populate("pickup", "pickupId totalWeight");

    res.status(200).json({
      success: true,

      dashboard: {
        analytics: {
          totalUsers,
          totalCollectors,
          totalPickups,
          totalRewards,
          pendingPickups,
          acceptedPickups,
          completedPickups,
          totalRevenue,
          totalGreenPointsGenerated,
          totalTransactionsCount,
          successfulPaymentsCount,
          failedPaymentsCount,
        },

        chartData,

        recentPickups,
        recentTransactions,

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
    const users = await User.find({ role: "user" }).sort({
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
      await Collector.find({ role: "collector" }).sort({
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


// ==========================================
// BLOCK / UNBLOCK COLLECTOR
// ==========================================
const toggleCollectorBlock = async (req, res) => {
  try {
    const collector = await Collector.findById(req.params.id);

    if (!collector) {
      return res.status(404).json({
        success: false,
        message: "Collector not found",
      });
    }

    collector.isBlocked = !collector.isBlocked;

    await collector.save();

    res.status(200).json({
      success: true,
      message: collector.isBlocked
        ? "Collector blocked"
        : "Collector unblocked",
      collector,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL PICKUPS (ADMIN)
// ==========================================
const getAllPickupsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;

    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search query construction
    if (search) {
      const matchingUsers = await User.find({ role: "user", name: { $regex: search, $options: "i" } }).select("_id");
      const userIds = matchingUsers.map(u => u._id);

      const matchingCollectors = await User.find({ role: "collector", name: { $regex: search, $options: "i" } }).select("_id");
      const collectorIds = matchingCollectors.map(c => c._id);

      query.$or = [
        { pickupId: { $regex: search, $options: "i" } },
        { user: { $in: userIds } },
        { collector: { $in: collectorIds } }
      ];
    }

    const totalPickups = await Pickup.countDocuments(query);

    const pickups = await Pickup.find(query)
      .populate("user", "name email phone")
      .populate("collector", "name email phone")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: pickups.length,
      totalPages: Math.ceil(totalPickups / limit),
      currentPage: parseInt(page),
      totalPickups,
      pickups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE PICKUP STATUS (ADMIN)
// ==========================================
const updatePickupStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body;
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found",
      });
    }

    pickup.status = status;

    if (status === "Completed") {
      if (pickup.paymentMethod === "Cash" || pickup.paymentMethod === "Cash on Pickup" || pickup.paymentMethod === "Pay Later") {
        pickup.paymentStatus = "Paid";
        
        // Log Transaction for Offline Payment
        await Transaction.create({
          user: pickup.user,
          pickup: pickup._id,
          transactionId: `TXN-${Date.now()}`,
          amount: pickup.totalAmount,
          paymentMethod: pickup.paymentMethod,
          paymentStatus: "Success",
          transactionType: "Pickup Payment",
          notes: `Paid via ${pickup.paymentMethod} upon pickup (Admin Action)`,
        });

        // Send Notification to User
        await Notification.create({
          user: pickup.user,
          userModel: "User",
          title: "Payment Successful",
          message: `Your pickup ${pickup.pickupId} was marked as completed by Admin. Payment of ₹${pickup.totalAmount} via ${pickup.paymentMethod} recorded.`,
          notificationType: "Payment",
        });
      }
      if (pickup.collector) {
        await Collector.findByIdAndUpdate(pickup.collector, {
          $inc: {
            completedPickups: 1,
            totalEarnings: pickup.totalAmount || 0,
            monthlyEarnings: pickup.totalAmount || 0,
          },
        });
      }
    }

    await pickup.save();

    res.status(200).json({
      success: true,
      message: "Pickup status updated successfully by Admin",
      pickup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// DELETE PICKUP REQUEST (ADMIN)
// ==========================================
const deletePickupAdmin = async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found",
      });
    }

    await pickup.deleteOne();

    res.status(200).json({
      success: true,
      message: "Pickup request deleted successfully by Admin",
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
  toggleCollectorBlock,
  getAllPickupsAdmin,
  updatePickupStatusAdmin,
  deletePickupAdmin,
};