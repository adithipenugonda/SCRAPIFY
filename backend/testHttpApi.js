const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const User = require("./models/User");
const generateToken = require("./utils/generateToken");

const runTest = async () => {
  await connectDB();
  console.log("DB Connected");
  
  try {
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      console.log("No admin found in DB!");
      return;
    }
    
    const token = generateToken(admin._id, admin.role);
    console.log("Admin token generated:", token.substring(0, 20) + "...");
    
    const API = axios.create({
      baseURL: "http://localhost:5000/api",
      headers: { Authorization: `Bearer ${token}` }
    });
    
    try {
      console.log("Calling /admin/collectors...");
      const res1 = await API.get("/admin/collectors");
      console.log("Success:", res1.data.success);
    } catch(e) {
      console.error("Error on /admin/collectors:", e.response ? e.response.data : e.message);
    }
    
    try {
      console.log("Calling /admin/pickups...");
      const res2 = await API.get("/admin/pickups");
      console.log("Success:", res2.data.success);
    } catch(e) {
      console.error("Error on /admin/pickups:", e.response ? e.response.data : e.message);
    }
    
    try {
      console.log("Calling /admin/dashboard...");
      const res3 = await API.get("/admin/dashboard");
      console.log("Success:", res3.data.success);
    } catch(e) {
      console.error("Error on /admin/dashboard:", e.response ? e.response.data : e.message);
    }
    
    try {
      console.log("Calling /scrap-prices/ (PUT, needs ID, getting list first)...");
      const list = await API.get("/scrap-prices");
      if (list.data.scrapPrices && list.data.scrapPrices.length > 0) {
        const id = list.data.scrapPrices[0]._id;
        const res4 = await API.put(`/scrap-prices/${id}`, { pricePerKg: 100 });
        console.log("Success on PUT /scrap-prices:", res4.data.success);
      }
    } catch(e) {
      console.error("Error on /scrap-prices:", e.response ? e.response.data : e.message);
    }

  } catch (e) {
    console.error("Error:", e.message);
  }
  
  mongoose.disconnect();
};

runTest();
