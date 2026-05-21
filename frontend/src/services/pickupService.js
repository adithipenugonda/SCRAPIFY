import API from "./api";


// ==========================================
// CREATE PICKUP REQUEST
// ==========================================
export const createPickup = async (
  pickupData
) => {

  try {

    const response =
      await API.post(
        "/pickups",
        pickupData
      );

    return response.data;

  } catch (error) {

    return {
      success: false,

      message:
        error.response?.data?.message ||
        "Failed to schedule pickup",
    };

  }

};


// ==========================================
// GET ALL USER PICKUPS
// ==========================================
export const getUserPickups =
  async () => {

    try {

      const response =
        await API.get(
          "/pickups/my-pickups"
        );

      return response.data;

    } catch (error) {

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Failed to fetch pickups",
      };

    }

  };


// ==========================================
// GET SINGLE PICKUP
// ==========================================
export const getPickupById =
  async (pickupId) => {

    try {

      const response =
        await API.get(
          `/pickups/${pickupId}`
        );

      return response.data;

    } catch (error) {

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Failed to fetch pickup",
      };

    }

  };


// ==========================================
// UPDATE PICKUP STATUS
// ==========================================
export const updatePickupStatus =
  async (
    pickupId,
    statusData
  ) => {

    try {

      const response =
        await API.put(
          `/pickups/${pickupId}`,
          statusData
        );

      return response.data;

    } catch (error) {

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Failed to update pickup",
      };

    }

  };


// ==========================================
// DELETE PICKUP
// ==========================================
export const deletePickup =
  async (pickupId) => {

    try {

      const response =
        await API.delete(
          `/pickups/${pickupId}`
        );

      return response.data;

    } catch (error) {

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Failed to delete pickup",
      };

    }

  };