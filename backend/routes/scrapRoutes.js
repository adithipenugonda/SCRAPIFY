const express = require("express");

const {
  addScrapPrice,
  getAllScrapPrices,
  getSingleScrapPrice,
  updateScrapPrice,
  deleteScrapPrice,
} = require("../controllers/scrapController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// ADD SCRAP PRICE
// ==========================================
router.post("/", protect, authorize("admin"), addScrapPrice);


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
router.put("/:id", protect, authorize("admin"), updateScrapPrice);


// ==========================================
// DELETE SCRAP PRICE
// ==========================================
router.delete("/:id", protect, authorize("admin"), deleteScrapPrice);


module.exports = router;