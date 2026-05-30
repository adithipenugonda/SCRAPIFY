const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const User = require("./models/User");
const Pickup = require("./models/Pickup");
const Transaction = require("./models/Transaction");
const ScrapPrice = require("./models/ScrapPrice");

const runTest = async () => {
  await connectDB();
  console.log("DB Connected");
  
  try {
    console.log("Testing getAllCollectors query...");
    const collectors = await User.find({ role: "collector" }).sort({ createdAt: -1 });
    console.log("Collectors found:", collectors.length);
    
    console.log("Testing getAllPickupsAdmin query...");
    const pickups = await Pickup.find().populate("user").populate("collector").limit(2);
    console.log("Pickups found:", pickups.length);
    
    console.log("Testing getAdminDashboard queries...");
    const totalTransactionsCount = await Transaction.countDocuments();
    console.log("Total transactions:", totalTransactionsCount);
    
  } catch (e) {
    console.error("Error executing queries:", e.message);
    console.error(e.stack);
  }
  
  mongoose.disconnect();
};

runTest();
