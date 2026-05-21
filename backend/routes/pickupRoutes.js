const express = require("express");

const {
  createPickup,
  getUserPickups,
  getSinglePickup,
  updatePickupStatus,
  deletePickup,
} = require("../controllers/pickupController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// =======================================
// CREATE PICKUP
// =======================================
router.post("/", protect, createPickup);


// =======================================
// GET USER PICKUPS
// =======================================
router.get("/my-pickups", protect, getUserPickups);


// =======================================
// GET SINGLE PICKUP
// =======================================
router.get("/:id", protect, getSinglePickup);


// =======================================
// UPDATE PICKUP STATUS
// =======================================
router.put("/:id/status", protect, updatePickupStatus);


// =======================================
// DELETE PICKUP
// =======================================
router.delete("/:id", protect, deletePickup);


module.exports = router;