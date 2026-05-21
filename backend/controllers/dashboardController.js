const User = require("../models/User");
const Pickup = require("../models/Pickup");


// ==========================================
// GET USER DASHBOARD DATA
// ==========================================
const getUserDashboard = async (req, res) => {
  try {
    // Get Logged In User
    const user = await User.findById(req.user._id);

    // Get Recent Pickups
    const recentPickups = await Pickup.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Active Pickup
    const activePickup = await Pickup.findOne({
      user: req.user._id,
      status: {
        $in: [
          "Pending",
          "Accepted",
          "Collector Assigned",
          "On The Way",
        ],
      },
    }).sort({ createdAt: -1 });

    // Completed Pickups
    const completedPickups = await Pickup.find({
      user: req.user._id,
      status: "Completed",
    });

    // Total Pickups
    const totalPickups = completedPickups.length;

    // Total Weight
    let totalWeight = 0;

    completedPickups.forEach((pickup) => {
      totalWeight += pickup.totalWeight;
    });

    // Carbon Offset Logic
    const carbonOffset = (totalWeight * 1.7).toFixed(1);

    // Estimated Trees Saved
    const treesSaved = Math.floor(totalWeight / 25);

    // Earnings This Month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyPickups = completedPickups.filter((pickup) => {
      const pickupDate = new Date(pickup.createdAt);

      return (
        pickupDate.getMonth() === currentMonth &&
        pickupDate.getFullYear() === currentYear
      );
    });

    let monthlyEarnings = 0;

    monthlyPickups.forEach((pickup) => {
      monthlyEarnings += pickup.totalAmount;
    });

    res.status(200).json({
      success: true,

      dashboard: {
        user: {
          name: user.name,
          email: user.email,
          greenPoints: user.greenPoints,
          totalEarnings: user.totalEarnings,
          totalRecycledWeight: user.totalRecycledWeight,
        },

        stats: {
          totalPickups,
          totalWeight,
          carbonOffset,
          treesSaved,
          monthlyEarnings,
        },

        activePickup,

        recentPickups,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getUserDashboard,
};