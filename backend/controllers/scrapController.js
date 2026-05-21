const ScrapPrice = require("../models/ScrapPrice");


// ==========================================
// ADD SCRAP PRICE
// ==========================================
const addScrapPrice = async (req, res) => {
  try {
    const {
      materialType,
      pricePerKg,
      priceChange,
    } = req.body;

    // Check Existing Material
    const existingMaterial =
      await ScrapPrice.findOne({
        materialType,
      });

    if (existingMaterial) {
      return res.status(400).json({
        success: false,
        message: "Material already exists",
      });
    }

    // Create Scrap Price
    const scrapPrice = await ScrapPrice.create({
      materialType,
      pricePerKg,
      priceChange,
    });

    res.status(201).json({
      success: true,
      message: "Scrap price added successfully",

      scrapPrice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL SCRAP PRICES
// ==========================================
const getAllScrapPrices = async (req, res) => {
  try {
    const scrapPrices = await ScrapPrice.find({
      isActive: true,
    }).sort({ materialType: 1 });

    res.status(200).json({
      success: true,
      count: scrapPrices.length,

      scrapPrices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET SINGLE SCRAP PRICE
// ==========================================
const getSingleScrapPrice = async (
  req,
  res
) => {
  try {
    const scrapPrice =
      await ScrapPrice.findById(req.params.id);

    if (!scrapPrice) {
      return res.status(404).json({
        success: false,
        message: "Scrap material not found",
      });
    }

    res.status(200).json({
      success: true,

      scrapPrice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE SCRAP PRICE
// ==========================================
const updateScrapPrice = async (
  req,
  res
) => {
  try {
    const {
      pricePerKg,
      priceChange,
      isActive,
    } = req.body;

    const scrapPrice =
      await ScrapPrice.findById(req.params.id);

    if (!scrapPrice) {
      return res.status(404).json({
        success: false,
        message: "Scrap material not found",
      });
    }

    // Update Fields
    if (pricePerKg !== undefined) {
      scrapPrice.pricePerKg = pricePerKg;
    }

    if (priceChange !== undefined) {
      scrapPrice.priceChange = priceChange;
    }

    if (isActive !== undefined) {
      scrapPrice.isActive = isActive;
    }

    scrapPrice.lastUpdated = Date.now();

    await scrapPrice.save();

    res.status(200).json({
      success: true,
      message: "Scrap price updated successfully",

      scrapPrice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// DELETE SCRAP PRICE
// ==========================================
const deleteScrapPrice = async (
  req,
  res
) => {
  try {
    const scrapPrice =
      await ScrapPrice.findById(req.params.id);

    if (!scrapPrice) {
      return res.status(404).json({
        success: false,
        message: "Scrap material not found",
      });
    }

    await scrapPrice.deleteOne();

    res.status(200).json({
      success: true,
      message: "Scrap price deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  addScrapPrice,
  getAllScrapPrices,
  getSingleScrapPrice,
  updateScrapPrice,
  deleteScrapPrice,
};