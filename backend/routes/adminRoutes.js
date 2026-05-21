const express = require("express");

const {
  registerAdmin,
  loginAdmin,
  getAdminDashboard,
  getAllUsers,
  getAllCollectors,
  toggleUserBlock,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// ADMIN AUTH
// ==========================================
router.post("/register", registerAdmin);

router.post("/login", loginAdmin);


// ==========================================
// ADMIN DASHBOARD
// ==========================================
router.get(
  "/dashboard",
  protect,
  getAdminDashboard
);


// ==========================================
// GET ALL USERS
// ==========================================
router.get(
  "/users",
  protect,
  getAllUsers
);


// ==========================================
// GET ALL COLLECTORS
// ==========================================
router.get(
  "/collectors",
  protect,
  getAllCollectors
);


// ==========================================
// BLOCK / UNBLOCK USER
// ==========================================
router.put(
  "/toggle-user/:id",
  protect,
  toggleUserBlock
);


module.exports = router;