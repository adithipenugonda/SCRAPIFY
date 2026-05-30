const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema(
  {
    // User who created pickup
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Assigned collector
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Pickup ID like SCR-8821
    pickupId: {
      type: String,
      unique: true,
    },

    // Scrap Materials
    materials: [
      {
        materialType: {
          type: String,
          required: true,
          enum: [
            "Newspaper",
            "Cardboard",
            "Plastic",
            "Iron Scrap",
            "Copper",
            "Aluminum",
            "E-Waste",
            "Glass",
          ],
        },

        estimatedWeight: {
          type: Number,
          required: true,
          default: 0,
        },

        pricePerKg: {
          type: Number,
          required: true,
        },

        estimatedAmount: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Total Weight
    totalWeight: {
      type: Number,
      default: 0,
    },

    // Final Amount
    totalAmount: {
      type: Number,
      default: 0,
    },

    // Green Points Earned
    greenPointsEarned: {
      type: Number,
      default: 0,
    },

    // Pickup Status
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Collector Assigned",
        "On The Way",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },

    // Pickup Slot
    pickupDate: {
      type: Date,
      required: true,
    },

    pickupTimeSlot: {
      type: String,
      required: true,
    },

    // Address Details
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

    // Geo Location
    location: {
      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },
    },

    // Collector Tracking
    tracking: {
      currentLatitude: {
        type: Number,
        default: null,
      },

      currentLongitude: {
        type: Number,
        default: null,
      },

      eta: {
        type: String,
        default: "",
      },
    },

    // Payment
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      enum: ["UPI", "Cash", "Bank Transfer", "Razorpay"],
      default: "UPI",
    },

    // Notes
    notes: {
      type: String,
      default: "",
    },

    // Cancellation Reason
    cancellationReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pickup", pickupSchema);