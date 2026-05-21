const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
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
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    // Role
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },

    // Permissions
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

    // Dashboard Stats
    totalUsersManaged: {
      type: Number,
      default: 0,
    },

    totalCollectorsManaged: {
      type: Number,
      default: 0,
    },

    totalPickupsManaged: {
      type: Number,
      default: 0,
    },

    // Security
    lastLogin: {
      type: Date,
      default: null,
    },

    isSuperAdmin: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    // Activity Logs
    activityLogs: [
      {
        action: {
          type: String,
        },

        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Admin",
  adminSchema
);