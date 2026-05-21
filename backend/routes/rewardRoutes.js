const express = require("express");

const {
  addReward,
  getAllRewards,
  getSingleReward,
  redeemReward,
  getLeaderboard,
  deleteReward,
} = require("../controllers/rewardController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// ADD REWARD
// ==========================================
router.post("/", protect, addReward);


// ==========================================
// GET ALL REWARDS
// ==========================================
router.get("/", getAllRewards);


// ==========================================
// GET SINGLE REWARD
// ==========================================
router.get("/:id", getSingleReward);


// ==========================================
// REDEEM REWARD
// ==========================================
router.put(
  "/redeem/:id",
  protect,
  redeemReward
);


// ==========================================
// LEADERBOARD
// ==========================================
router.get(
  "/leaderboard/top-users",
  getLeaderboard
);


// ==========================================
// DELETE REWARD
// ==========================================
router.delete(
  "/:id",
  protect,
  deleteReward
);


module.exports = router;