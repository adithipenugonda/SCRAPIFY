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
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// ADD REWARD
// ==========================================
router.post("/", protect, authorize("admin"), addReward);


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
  authorize("admin"),
  deleteReward
);


module.exports = router;