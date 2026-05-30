const User = require("../models/User");
const Pickup = require("../models/Pickup");


// ==========================================
// GET USER PROFILE
// ==========================================
const getUserProfile = async (
  req,
  res
) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE USER PROFILE
// ==========================================
const updateUserProfile = async (
  req,
  res
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update Fields
    user.name =
      req.body.name || user.name;

    user.phone =
      req.body.phone || user.phone;

    if (user.role !== "admin") {
      user.address =
        req.body.address || user.address;

      user.city =
        req.body.city || user.city;

      user.state =
        req.body.state || user.state;

      user.pincode =
        req.body.pincode || user.pincode;
    }

    if (user.role === "collector") {
      user.vehicleType = req.body.vehicleType || user.vehicleType;
      user.vehicleNumber = req.body.vehicleNumber || user.vehicleNumber;
      if (req.body.availabilityStatus) {
        user.availabilityStatus = req.body.availabilityStatus;
      }
    }

    // Profile Image Upload
    if (req.file) {
      user.profileImage =
        `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",

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
// GET USER PICKUP HISTORY
// ==========================================
const getUserPickupHistory = async (
  req,
  res
) => {
  try {
    const pickups = await Pickup.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate(
        "collector",
        "name phone"
      );

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
// DELETE USER ACCOUNT
// ==========================================
const deleteUserAccount = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "User account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// CHANGE PASSWORD
// ==========================================
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Please provide both current and new password" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const bcrypt = require("bcryptjs");
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserPickupHistory,
  deleteUserAccount,
  changePassword,
};