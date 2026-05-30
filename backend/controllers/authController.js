const bcrypt = require("bcryptjs");

const User = require("../models/User");
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

    // Block public admin registration
    if (role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin accounts cannot be registered via public signup. They must be created manually.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
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
      newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        city: city || "",
        state: state || "",
        pincode: pincode || "",
        role: "collector",
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
        role: "user",
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

    // Check unified User collection
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if blocked
    if (foundUser.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked by the admin. Please contact support.",
      });
    }

    const role = foundUser.role || "user";

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