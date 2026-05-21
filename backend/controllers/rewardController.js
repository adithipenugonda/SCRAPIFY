const Reward = require("../models/Reward");
const User = require("../models/User");


// ==========================================
// ADD REWARD
// ==========================================
const addReward = async (req, res) => {
  try {
    const {
      title,
      description,
      rewardType,
      requiredPoints,
      rewardValue,
      rewardColor,
      unlockCondition,
      expiryDate,
    } = req.body;

    const reward = await Reward.create({
      title,
      description,
      rewardType,
      requiredPoints,
      rewardValue,
      rewardColor,
      unlockCondition,
      expiryDate,
    });

    res.status(201).json({
      success: true,
      message: "Reward added successfully",

      reward,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL REWARDS
// ==========================================
const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({
      isActive: true,
    }).sort({ requiredPoints: 1 });

    res.status(200).json({
      success: true,
      count: rewards.length,

      rewards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET SINGLE REWARD
// ==========================================
const getSingleReward = async (req, res) => {
  try {
    const reward = await Reward.findById(
      req.params.id
    );

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: "Reward not found",
      });
    }

    res.status(200).json({
      success: true,

      reward,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// REDEEM REWARD
// ==========================================
const redeemReward = async (req, res) => {
  try {
    const reward = await Reward.findById(
      req.params.id
    );

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: "Reward not found",
      });
    }

    // Get User
    const user = await User.findById(
      req.user._id
    );

    // Check Points
    if (
      user.greenPoints < reward.requiredPoints
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Not enough green points to redeem",
      });
    }

    // Deduct Points
    user.greenPoints -= reward.requiredPoints;

    // Add Reward To User
    user.rewardsEarned.push(reward.title);

    await user.save();

    // Increase Claims
    reward.totalClaims += 1;

    await reward.save();

    res.status(200).json({
      success: true,
      message: "Reward redeemed successfully",

      remainingPoints: user.greenPoints,

      reward,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET LEADERBOARD
// ==========================================
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ greenPoints: -1 })
      .limit(10)
      .select(
        "name greenPoints totalRecycledWeight totalEarnings"
      );

    res.status(200).json({
      success: true,

      leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// DELETE REWARD
// ==========================================
const deleteReward = async (req, res) => {
  try {
    const reward = await Reward.findById(
      req.params.id
    );

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: "Reward not found",
      });
    }

    await reward.deleteOne();

    res.status(200).json({
      success: true,
      message: "Reward deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  addReward,
  getAllRewards,
  getSingleReward,
  redeemReward,
  getLeaderboard,
  deleteReward,
};