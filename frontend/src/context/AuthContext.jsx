import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../services/api";


// ==========================================
// CREATE CONTEXT
// ==========================================
export const AuthContext = createContext();


// ==========================================
// AUTH PROVIDER
// ==========================================
export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [loading, setLoading] =
    useState(true);


  // ==========================================
  // LOAD USER
  // ==========================================
  const loadUser = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await API.get(
        "/users/profile"
      );

      setUser(response.data.user);
    } catch (error) {
      console.error(
        error.response?.data?.message
      );

      logout();
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // LOGIN
  // ==========================================
  const login = async (
    email,
    password
  ) => {
    try {
      const response = await API.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      localStorage.setItem(
        "token",
        data.token
      );

      setToken(data.token);
      API.defaults.headers.common[
  "Authorization"
] = `Bearer ${data.token}`; 

      const profileResponse = await API.get(
        "/users/profile"
      );
      setUser(profileResponse.data.user);

      return {
        success: true,
        role: profileResponse.data.user?.role || "user",
      };
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
  // REGISTER
  // ==========================================
  const register = async (
    userData
  ) => {
    try {
      const response = await API.post(
        "/auth/register",
        userData
      );

      const data = response.data;

      if (userData.role === "collector") {
        return {
          success: true,
          role: "collector",
        };
      }

      localStorage.setItem(
        "token",
        data.token
      );

      setToken(data.token);
      API.defaults.headers.common[
  "Authorization"
] = `Bearer ${data.token}`;

      const profileResponse = await API.get(
        "/users/profile"
      );
      setUser(profileResponse.data.user);

      return {
        success: true,
        role: profileResponse.data.user?.role || "user",
      };
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
  // LOGOUT
  // ==========================================
  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);

    setToken(null);
  };


  // ==========================================
  // LOAD USER ON START
  // ==========================================
  // useEffect(() => {
  //   loadUser();
  // }, [token]);
useEffect(() => {

  if (token) {

    API.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;

  }

  loadUser();

}, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,

        login,
        register,
        logout,
        loadUser,

        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


// ==========================================
// CUSTOM HOOK
// ==========================================
export const useAuthContext = () => {
  return useContext(AuthContext);
};