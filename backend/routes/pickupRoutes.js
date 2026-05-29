const express = require("express");

const {
  createPickup,
  getUserPickups,
  getSinglePickup,
  updatePickupStatus,
  deletePickup,
  getPendingPickups,
  acceptPickup,
  updateCollectorLocation,
  getCollectorCompletedPickups,
} = require("../controllers/pickupController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// =======================================
// CREATE PICKUP
// =======================================
router.post("/create", protect, createPickup);


// =======================================
// GET USER PICKUPS
// =======================================
router.get("/my-pickups", protect, getUserPickups);


// =======================================
// GET COLLECTOR COMPLETED PICKUPS
// =======================================
router.get("/collector-history", protect, getCollectorCompletedPickups);




// =======================================
// GET PENDING PICKUPS
// =======================================
router.get("/pending", protect, getPendingPickups);

// =======================================
// GET SINGLE PICKUP
// =======================================
router.get("/:id", protect, getSinglePickup);



// =======================================
// ACCEPT PICKUP
// =======================================
router.put(
  "/accept/:id",
  protect,
  acceptPickup
);


// =======================================
// UPDATE PICKUP STATUS
// =======================================
router.put("/:id/status", protect, updatePickupStatus);


// =======================================
// DELETE PICKUP
// =======================================
router.delete("/:id", protect, deletePickup);

router.put(
  "/:id/location",
  protect,
  updateCollectorLocation
);



module.exports = router;