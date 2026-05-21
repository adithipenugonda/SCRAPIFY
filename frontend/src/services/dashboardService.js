import API from "./api";


// ==========================================
// GET USER DASHBOARD DATA
// ==========================================
export const getUserDashboard =
  async () => {

    try {

      const response =
        await API.get(
          "/dashboard/user"
        );

      return response.data;

    } catch (error) {

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Failed to fetch user dashboard",
      };

    }

  };


// ==========================================
// GET COLLECTOR DASHBOARD DATA
// ==========================================
export const getCollectorDashboard =
  async () => {

    try {

      const response =
        await API.get(
          "/dashboard/collector"
        );

      return response.data;

    } catch (error) {

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Failed to fetch collector dashboard",
      };

    }

  };


// ==========================================
// GET ADMIN DASHBOARD DATA
// ==========================================
export const getAdminDashboard =
  async () => {

    try {

      const response =
        await API.get(
          "/dashboard/admin"
        );

      return response.data;

    } catch (error) {

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Failed to fetch admin dashboard",
      };

    }

  };


// ==========================================
// GET ANALYTICS DATA
// ==========================================
export const getAnalytics =
  async () => {

    try {

      const response =
        await API.get(
          "/dashboard/analytics"
        );

      return response.data;

    } catch (error) {

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Failed to fetch analytics",
      };

    }

  };


// ==========================================
// GET RECENT ACTIVITIES
// ==========================================
export const getRecentActivities =
  async () => {

    try {

      const response =
        await API.get(
          "/dashboard/recent-activities"
        );

      return response.data;

    } catch (error) {

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Failed to fetch activities",
      };

    }

  };