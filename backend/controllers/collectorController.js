const bcrypt = require("bcryptjs");

const Collector = require("../models/User");
const Pickup = require("../models/Pickup");

const generateToken = require("../utils/generateToken");


// ==========================================
// REGISTER COLLECTOR
// ==========================================
const registerCollector = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      city,
      state,
      pincode,
      vehicleType,
      vehicleNumber,
    } = req.body;

    // Check Existing Collector
    const existingCollector = await Collector.findOne({
      email,
    });

    if (existingCollector) {
      return res.status(400).json({
        success: false,
        message: "Collector already exists",
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // Create Collector
    const collector = await Collector.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      city,
      state,
      pincode,
      vehicleType,
      vehicleNumber,
    });

    // Generate Token
    const token = generateToken(
      collector._id,
      collector.role
    );

    res.status(201).json({
      success: true,
      message: "Collector registered successfully",

      token,

      collector: {
        id: collector._id,
        name: collector.name,
        email: collector.email,
        role: collector.role,
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
// LOGIN COLLECTOR
// ==========================================
const loginCollector = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check Collector
    const collector = await Collector.findOne({
      email,
    });

    if (!collector) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(
      password,
      collector.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate Token
    const token = generateToken(
      collector._id,
      collector.role
    );

    res.status(200).json({
      success: true,
      message: "Collector login successful",

      token,

      collector: {
        id: collector._id,
        name: collector.name,
        email: collector.email,
        role: collector.role,
        availabilityStatus:
          collector.availabilityStatus,
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
// GET AVAILABLE PICKUPS
// ==========================================
const getAvailablePickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({
      status: "Pending",
    })
      .populate("user", "name phone address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pickups.length,
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
// ACCEPT PICKUP
// ==========================================
const acceptPickup = async (req, res) => {
  try {
    const pickup = await Pickup.findById(
      req.params.id
    );

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found",
      });
    }

    // Assign Collector
    pickup.collector = req.user._id;

    pickup.status = "Collector Assigned";

    await pickup.save();

    // Add Pickup To Collector
    await Collector.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          assignedPickups: pickup._id,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Pickup accepted successfully",

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
// MARK PICKUP COMPLETED
// ==========================================
const completePickup = async (req, res) => {
  try {
    const pickup = await Pickup.findById(
      req.params.id
    );

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found",
      });
    }

    pickup.status = "Completed";

    pickup.paymentStatus = "Paid";

    await pickup.save();

    // Update Collector Stats
    await Collector.findByIdAndUpdate(
      req.user._id,
      {
        $inc: {
          completedPickups: 1,
          totalEarnings: pickup.totalAmount,
          monthlyEarnings: pickup.totalAmount,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Pickup marked completed",

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
// GET COLLECTOR DASHBOARD
// ==========================================
const getCollectorDashboard = async (
  req,
  res
) => {
  try {
    const collector = await Collector.findById(
      req.user._id
    ).populate("assignedPickups");

    res.status(200).json({
      success: true,

      dashboard: {
        collector,

        stats: {
          completedPickups:
            collector.completedPickups,

          totalEarnings:
            collector.totalEarnings,

          monthlyEarnings:
            collector.monthlyEarnings,

          rating: collector.rating,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  registerCollector,
  loginCollector,
  getAvailablePickups,
  acceptPickup,
  completePickup,
  getCollectorDashboard,
};