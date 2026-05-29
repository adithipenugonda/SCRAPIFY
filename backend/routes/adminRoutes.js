const express = require("express");

const {
  loginAdmin,
  getAdminDashboard,
  getAllUsers,
  getAllCollectors,
  toggleUserBlock,
  toggleCollectorBlock,
  getAllPickupsAdmin,
  updatePickupStatusAdmin,
  deletePickupAdmin,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// ADMIN AUTH
// ==========================================
router.post("/login", loginAdmin);


// ==========================================
// ADMIN DASHBOARD
// ==========================================
router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getAdminDashboard
);


// ==========================================
// GET ALL USERS
// ==========================================
router.get(
  "/users",
  protect,
  authorize("admin"),
  getAllUsers
);


// ==========================================
// GET ALL COLLECTORS
// ==========================================
router.get(
  "/collectors",
  protect,
  authorize("admin"),
  getAllCollectors
);


// ==========================================
// BLOCK / UNBLOCK USER
// ==========================================
router.put(
  "/toggle-user/:id",
  protect,
  authorize("admin"),
  toggleUserBlock
);


// ==========================================
// BLOCK / UNBLOCK COLLECTOR
// ==========================================
router.put(
  "/toggle-collector/:id",
  protect,
  authorize("admin"),
  toggleCollectorBlock
);


// ==========================================
// ADMIN PICKUP MANAGEMENT
// ==========================================
router.get(
  "/pickups",
  protect,
  authorize("admin"),
  getAllPickupsAdmin
);

router.put(
  "/pickups/:id/status",
  protect,
  authorize("admin"),
  updatePickupStatusAdmin
);

router.delete(
  "/pickups/:id",
  protect,
  authorize("admin"),
  deletePickupAdmin
);


module.exports = router;