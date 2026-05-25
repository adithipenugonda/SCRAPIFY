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

    const pickups = await Pickup.find({
      status: "Pending",
    })
      .populate("user", "name")
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

    pickup.status = status;

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

    const pickup = await Pickup.findById(
      req.params.id
    );

    if (!pickup) {

      return res.status(404).json({
        success: false,
        message: "Pickup not found",
      });

    }

    pickup.status = "Accepted";

    pickup.collector = req.user._id;

    await pickup.save();

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


module.exports = {
  createPickup,
  getUserPickups,
  getSinglePickup,
  updatePickupStatus,
  deletePickup,
  getPendingPickups,
  acceptPickup,
};
