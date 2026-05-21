import API from "./api";


// ==========================================
// GET ALL REWARDS
// ==========================================
export const getRewards = async () => {

  try {

    const response =
      await API.get("/rewards");

    return response.data;

  } catch (error) {

    return {
      success: false,

      message:
        error.response?.data?.message ||
        "Failed to fetch rewards",
    };

  }

};


// ==========================================
// REDEEM REWARD
// ==========================================
export const redeemReward =
  async (rewardId) => {

    try {

      const response =
        await API.post(
          `/rewards/redeem/${rewardId}`
        );

      return response.data;

    } catch (error) {

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Failed to redeem reward",
      };

    }

  };


// ==========================================
// GET USER REWARD HISTORY
// ==========================================
export const getRewardHistory =
  async () => {

    try {

      const response =
        await API.get(
          "/rewards/history"
        );

      return response.data;

    } catch (error) {

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Failed to fetch reward history",
      };

    }

  };


// ==========================================
// GET USER GREEN POINTS
// ==========================================
export const getUserPoints =
  async () => {

    try {

      const response =
        await API.get(
          "/rewards/points"
        );

      return response.data;

    } catch (error) {

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Failed to fetch points",
      };

    }

  };