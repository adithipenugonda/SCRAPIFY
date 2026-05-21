const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Collector = require("../models/Collector");
const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");


// ==============================
// REGISTER USER / COLLECTOR / ADMIN
// ==============================
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      city,
      state,
      pincode,
      role = "user",
    } = req.body;

    // Check if user already exists in ANY of the collections
    const existingUser = await User.findOne({ email });
    const existingCollector = await Collector.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });

    if (existingUser || existingCollector || existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;

    if (role === "collector") {
      newUser = await Collector.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        city: city || "",
        state: state || "",
        pincode: pincode || "",
      });
    } else if (role === "admin") {
      newUser = await Admin.create({
        name,
        email,
        password: hashedPassword,
        phone: phone || "",
      });
    } else {
      newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        city: city || "",
        state: state || "",
        pincode: pincode || "",
      });
    }

    // Generate Token
    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        greenPoints: newUser.greenPoints || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==============================
// LOGIN USER / COLLECTOR / ADMIN
// ==============================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check all three collections
    let foundUser = await User.findOne({ email });
    let role = "user";

    if (!foundUser) {
      foundUser = await Collector.findOne({ email });
      role = "collector";
    }

    if (!foundUser) {
      foundUser = await Admin.findOne({ email });
      role = "admin";
    }

    if (!foundUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate Token
    const token = generateToken(foundUser._id, foundUser.role || role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role || role,
        greenPoints: foundUser.greenPoints || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
};