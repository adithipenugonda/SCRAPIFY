const mongoose = require("mongoose");

const notificationSchema =
  new mongoose.Schema(
    {
      // Receiver
      user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "userModel",
        required: true,
      },

      // Dynamic Model
      userModel: {
        type: String,
        enum: [
          "User",
          "Collector",
          "Admin",
        ],
        required: true,
      },

      // Notification Title
      title: {
        type: String,
        required: true,
      },

      // Message
      message: {
        type: String,
        required: true,
      },

      // Type
      notificationType: {
        type: String,

        enum: [
          "Pickup",
          "Reward",
          "Payment",
          "System",
          "Alert",
        ],

        default: "System",
      },

      // Read Status
      isRead: {
        type: Boolean,
        default: false,
      },

      // Redirect Link
      redirectUrl: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);