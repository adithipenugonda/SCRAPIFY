import API from "./api";


// ==========================================
// REGISTER USER
// ==========================================
export const registerUser = async (
  userData
) => {

  try {

    const response =
      await API.post(
        "/auth/register",
        userData
      );

    return response.data;

  } catch (error) {

    return {
      success: false,

      message:
        error.response?.data?.message ||
        "Registration failed",
    };

  }

};


// ==========================================
// LOGIN USER
// ==========================================
export const loginUser = async (
  userData
) => {

  try {

    const response =
      await API.post(
        "/auth/login",
        userData
      );

    return response.data;

  } catch (error) {

    return {
      success: false,

      message:
        error.response?.data?.message ||
        "Login failed",
    };

  }

};


// ==========================================
// GET USER PROFILE
// ==========================================
export const getUserProfile =
  async () => {

    try {

      const response =
        await API.get(
          "/auth/profile"
        );

      return response.data;

    } catch (error) {

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Failed to fetch profile",
      };

    }

  };


// ==========================================
// LOGOUT USER
// ==========================================
export const logoutUser = () => {

  localStorage.removeItem("token");

  localStorage.removeItem("user");

};