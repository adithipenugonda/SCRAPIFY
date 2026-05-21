const mongoose = require("mongoose");

const scrapPriceSchema = new mongoose.Schema(
  {
    materialType: {
      type: String,
      required: true,
      unique: true,

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

    pricePerKg: {
      type: Number,
      required: true,
    },

    priceChange: {
      type: Number,
      default: 0,
    },

    unit: {
      type: String,
      default: "kg",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    updatedBy: {
      type: String,
      default: "Admin",
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ScrapPrice",
  scrapPriceSchema
);