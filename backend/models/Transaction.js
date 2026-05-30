const mongoose = require("mongoose");

const transactionSchema =
  new mongoose.Schema(
    {
      // User
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      // Pickup Reference
      pickup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pickup",
        required: true,
      },

      // Transaction ID (Custom ID)
      transactionId: {
        type: String,
        unique: true,
        required: true,
      },

      // Razorpay Order ID
      orderId: {
        type: String,
      },

      // Razorpay Payment ID
      paymentId: {
        type: String,
      },

      // Amount
      amount: {
        type: Number,
        required: true,
      },

      // Payment Method
      paymentMethod: {
        type: String,

        enum: [
          "UPI",
          "Cash",
          "Bank Transfer",
          "Razorpay",
        ],

        default: "Razorpay",
      },

      // Payment Status
      paymentStatus: {
        type: String,

        enum: [
          "Pending",
          "Success",
          "Failed",
        ],

        default: "Pending",
      },

      // Transaction Type
      transactionType: {
        type: String,

        enum: [
          "Pickup Payment",
          "Reward Redemption",
        ],

        default: "Pickup Payment",
      },

      // Notes
      notes: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Transaction",
  transactionSchema
);