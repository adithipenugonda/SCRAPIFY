const express = require("express");

const {
  addScrapPrice,
  getAllScrapPrices,
  getSingleScrapPrice,
  updateScrapPrice,
  deleteScrapPrice,
} = require("../controllers/scrapController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// ADD SCRAP PRICE
// ==========================================
router.post("/", protect, addScrapPrice);


// ==========================================
// GET ALL SCRAP PRICES
// ==========================================
router.get("/", getAllScrapPrices);


// ==========================================
// GET SINGLE SCRAP PRICE
// ==========================================
router.get("/:id", getSingleScrapPrice);


// ==========================================
// UPDATE SCRAP PRICE
// ==========================================
router.put("/:id", protect, updateScrapPrice);


// ==========================================
// DELETE SCRAP PRICE
// ==========================================
router.delete("/:id", protect, deleteScrapPrice);


module.exports = router;