const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const User = require("./models/User");
const generateToken = require("./utils/generateToken");

const runTest = async () => {
  await connectDB();
  
  try {
    const admin = await User.findOne({ role: "admin" });
    const token = generateToken(admin._id, admin.role);
    
   const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Authorization: `Bearer ${token}` }
});
    
    try {
      const res3 = await API.get("/admin/dashboard");
      console.log(JSON.stringify(res3.data, null, 2));
    } catch(e) {
      console.error(e.response ? e.response.data : e.message);
    }
  } catch (e) {
    console.error(e.message);
  }
  
  mongoose.disconnect();
};

runTest();
