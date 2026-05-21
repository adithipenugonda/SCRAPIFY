const express = require("express");

const {
  registerCollector,
  loginCollector,
  getAvailablePickups,
  acceptPickup,
  completePickup,
  getCollectorDashboard,
} = require("../controllers/collectorController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// COLLECTOR AUTH
// ==========================================
router.post("/register", registerCollector);

router.post("/login", loginCollector);


// ==========================================
// DASHBOARD
// ==========================================
router.get("/dashboard", protect, getCollectorDashboard);


// ==========================================
// AVAILABLE PICKUPS
// ==========================================
router.get("/available-pickups", protect, getAvailablePickups);


// ==========================================
// ACCEPT PICKUP
// ==========================================
router.put(
  "/accept-pickup/:id",
  protect,
  acceptPickup
);


// ==========================================
// COMPLETE PICKUP
// ==========================================
router.put(
  "/complete-pickup/:id",
  protect,
  completePickup
);


module.exports = router;