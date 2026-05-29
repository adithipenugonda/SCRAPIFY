const Pickup = require("../models/Pickup");
const User = require("../models/User");


// =======================================
// CREATE PICKUP REQUEST
// =======================================
const createPickup = async (req, res) => {
  try {
    const {
      materials,
      pickupDate,
      pickupTimeSlot,
      address,
      city,
      state,
      pincode,
      notes,
    } = req.body;

    // Generate Pickup ID
    const pickupId = `SCR-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // Calculate Totals
    let totalWeight = 0;
    let totalAmount = 0;

    materials.forEach((item) => {
      totalWeight += item.estimatedWeight;

      item.estimatedAmount =
        item.estimatedWeight * item.pricePerKg;

      totalAmount += item.estimatedAmount;
    });

    // Green Points Logic
    const greenPointsEarned = Math.floor(totalWeight * 5);

    // Create Pickup
    const pickup = await Pickup.create({
      user: req.user._id,

      pickupId,

      materials,

      totalWeight,

      totalAmount,

      greenPointsEarned,

      pickupDate,

      pickupTimeSlot,

      status: "Pending",

      collector: null,

      address,

      city,

      state,

      pincode,

      notes,
    });

    // Update User Stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        greenPoints: greenPointsEarned,
        totalRecycledWeight: totalWeight,
        totalEarnings: totalAmount,
      },

      $push: {
        pickupHistory: pickup._id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Pickup scheduled successfully",

      pickup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =======================================
// GET USER PICKUP HISTORY
// =======================================
const getUserPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("collector", "name email phone");

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


// =======================================
// GET ALL PENDING PICKUPS
// =======================================
const getPendingPickups = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.role === "collector") {
      query = {
        $or: [
          { status: "Pending" },
          {
            status: { $in: ["Accepted", "On The Way"] },
            collector: req.user._id,
          },
        ],
      };
    } else {
      query = {
        status: {
          $in: ["Pending", "Accepted", "On The Way"],
        },
      };
    }

    const pickups = await Pickup.find(query)
      .populate("user", "name phone")
      .populate("collector", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      pickups,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =======================================
// GET SINGLE PICKUP
// =======================================
const getSinglePickup = async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("collector", "name email phone");

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found",
      });
    }

    res.status(200).json({
      success: true,
      pickup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =======================================
// UPDATE PICKUP STATUS
// =======================================
const updatePickupStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found",
      });
    }

    // Authorization check: Collector can only update status of their assigned pickups
    if (req.user.role === "collector" && (!pickup.collector || String(pickup.collector) !== String(req.user._id))) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this pickup status",
      });
    }

    // Validate Status Progression: Pending -> Accepted -> On The Way -> Completed
    const validTransitions = {
      "Pending": ["Accepted", "Cancelled"],
      "Accepted": ["On The Way", "Cancelled"],
      "On The Way": ["Completed"],
      "Completed": [],
      "Cancelled": [],
    };

    const currentStatus = pickup.status || "Pending";
    if (validTransitions[currentStatus] && !validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${currentStatus} to ${status}`,
      });
    }

    pickup.status = status;

    if (status === "Completed") {
      pickup.paymentStatus = "Paid";
      // Update collector stats
      const Collector = require("../models/User");
      await Collector.findByIdAndUpdate(pickup.collector, {
        $inc: {
          completedPickups: 1,
          totalEarnings: pickup.totalAmount || 0,
          monthlyEarnings: pickup.totalAmount || 0,
        },
      });
    }

    await pickup.save();

    res.status(200).json({
      success: true,
      message: "Pickup status updated",
      pickup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =======================================
// DELETE PICKUP
// =======================================
const deletePickup = async (req, res) => {
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
      message: "Pickup deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// GET PENDING PICKUPS FOR COLLECTORS
// =======================================
// const getPendingPickups = async (req, res) => {
//   try {

//     const pickups = await Pickup.find({
//       status: "Pending",
//     }).populate("user", "name phone");

//     res.status(200).json({
//       success: true,
//       pickups,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };

// =======================================
// COLLECTOR ACCEPT PICKUP
// =======================================
const acceptPickup = async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found",
      });
    }

    // Duplicate Check: Ensure the pickup is not already accepted
    if (pickup.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Pickup is already accepted or handled by another collector",
      });
    }

    pickup.status = "Accepted";
    pickup.collector = req.user._id;

    await pickup.save();

    // Add pickup to collector's assigned list
    if (req.user.role === "collector") {
      const Collector = require("../models/User");
      await Collector.findByIdAndUpdate(req.user._id, {
        $addToSet: { assignedPickups: pickup._id }
      });
    }

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

const updateCollectorLocation =
  async (req, res) => {

    try {

      const {
        latitude,
        longitude,
      } = req.body;

      const pickup =
        await Pickup.findById(
          req.params.id
        );

      if (!pickup) {

        return res.status(404).json({
          success: false,
          message: "Pickup not found",
        });

      }

      pickup.tracking.currentLatitude =
        latitude;

      pickup.tracking.currentLongitude =
        longitude;

      await pickup.save();

      res.status(200).json({
        success: true,
        pickup,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }

};

// =======================================
// GET COLLECTOR COMPLETED PICKUPS
// =======================================
const getCollectorCompletedPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({
      collector: req.user._id,
      status: "Completed",
    }).sort({ updatedAt: -1 });

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


module.exports = {
  createPickup,
  getUserPickups,
  getSinglePickup,
  updatePickupStatus,
  deletePickup,
  getPendingPickups,
  acceptPickup,
  updateCollectorLocation,
  getCollectorCompletedPickups,
};
