const express = require("express");

const {
  getUserDashboard,
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// USER DASHBOARD
// ==========================================
router.get("/", protect, getUserDashboard);


module.exports = router;