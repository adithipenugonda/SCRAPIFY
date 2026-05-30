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
      default: "",
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
      enum: ["user", "collector", "admin"],
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
    
    totalPaid: {
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

    // ==========================================
    // COLLECTOR FIELDS
    // ==========================================
    vehicleType: {
      type: String,
      enum: ["Bicycle", "Bike", "Auto", "Mini Truck", "Truck"],
      default: "Bike",
    },

    vehicleNumber: {
      type: String,
      default: "",
    },

    availabilityStatus: {
      type: String,
      enum: ["Online", "Offline", "Busy"],
      default: "Offline",
    },

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

    monthlyEarnings: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 5,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

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

    aadhaarNumber: {
      type: String,
      default: "",
    },

    licenseNumber: {
      type: String,
      default: "",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    // ==========================================
    // ADMIN FIELDS
    // ==========================================
    permissions: {
      manageUsers: {
        type: Boolean,
        default: true,
      },
      manageCollectors: {
        type: Boolean,
        default: true,
      },
      manageScrapPrices: {
        type: Boolean,
        default: true,
      },
      manageRewards: {
        type: Boolean,
        default: true,
      },
      managePickups: {
        type: Boolean,
        default: true,
      },
      viewAnalytics: {
        type: Boolean,
        default: true,
      },
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);