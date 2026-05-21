const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },

    greenPoints: {
      type: Number,
      default: 0,
    },

    totalRecycledWeight: {
      type: Number,
      default: 0,
    },

    totalEarnings: {
      type: Number,
      default: 0,
    },

    rewardsEarned: [
      {
        type: String,
      },
    ],

    pickupHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pickup",
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);