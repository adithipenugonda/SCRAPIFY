const mongoose = require("mongoose");

const collectorSchema = new mongoose.Schema(
  {
    // Basic Info
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

    // Address
    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    // Role
    role: {
      type: String,
      enum: ["collector"],
      default: "collector",
    },

    // Vehicle Details
    vehicleType: {
      type: String,
      enum: [
        "Bicycle",
        "Bike",
        "Auto",
        "Mini Truck",
        "Truck",
      ],
      default: "Bike",
    },

    vehicleNumber: {
      type: String,
      default: "",
    },

    // Availability
    availabilityStatus: {
      type: String,
      enum: ["Online", "Offline", "Busy"],
      default: "Offline",
    },

    // Assigned Pickups
    assignedPickups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pickup",
      },
    ],

    completedPickups: {
      type: Number,
      default: 0,
    },

    // Earnings
    totalEarnings: {
      type: Number,
      default: 0,
    },

    monthlyEarnings: {
      type: Number,
      default: 0,
    },

    // Rating
    rating: {
      type: Number,
      default: 5,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    // Live Location
    currentLocation: {
      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },
    },

    // Documents
    aadhaarNumber: {
      type: String,
      default: "",
    },

    licenseNumber: {
      type: String,
      default: "",
    },

    // Verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    // Joining Date
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Collector", collectorSchema);