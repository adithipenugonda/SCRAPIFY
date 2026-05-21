import axios from "axios";


// ==========================================
// AXIOS INSTANCE
// ==========================================
const API = axios.create({

  baseURL:
    "http://localhost:5000/api",

  headers: {
    "Content-Type":
      "application/json",
  },

});


// ==========================================
// ATTACH TOKEN
// ==========================================
API.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(error);

  }

);

export default API;