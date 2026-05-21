const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    // Reward Title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Description
    description: {
      type: String,
      required: true,
    },

    // Badge Image / Icon
    badgeImage: {
      type: String,
      default: "",
    },

    // Reward Type
    rewardType: {
      type: String,

      enum: [
        "Badge",
        "Coupon",
        "Cashback",
        "Gift",
        "Achievement",
      ],

      default: "Badge",
    },

    // Required Points
    requiredPoints: {
      type: Number,
      required: true,
    },

    // Reward Value
    rewardValue: {
      type: String,
      default: "",
    },

    // Reward Color
    rewardColor: {
      type: String,
      default: "#22c55e",
    },

    // Unlock Conditions
    unlockCondition: {
      type: String,
      default: "",
    },

    // Reward Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Total Users Claimed
    totalClaims: {
      type: Number,
      default: 0,
    },

    // Expiry
    expiryDate: {
      type: Date,
      default: null,
    },

    // Created By
    createdBy: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Reward",
  rewardSchema
);