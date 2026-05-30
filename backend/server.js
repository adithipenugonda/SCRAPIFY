const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const pickupRoutes = require("./routes/pickupRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const collectorRoutes = require("./routes/collectorRoutes");
const scrapRoutes = require("./routes/scrapRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Initialize Express App
const app = express();

// Load Environment Variables
dotenv.config();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test Route
app.get("/", (req, res) => {
  res.send("Scrapify Backend Running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/collectors", collectorRoutes);
app.use("/api/scrap-prices", scrapRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
// PORT
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});