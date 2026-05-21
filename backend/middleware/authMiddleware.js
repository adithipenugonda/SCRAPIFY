const jwt = require("jsonwebtoken");

const User = require("../models/User");


// ==============================
// PROTECT ROUTES MIDDLEWARE
// ==============================
const protect = async (req, res, next) => {
  let token;

  try {
    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Get Token
      token = req.headers.authorization.split(" ")[1];

      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get User From Database based on decoded role
      let user = null;
      if (decoded.role === "collector") {
        const Collector = require("../models/Collector");
        user = await Collector.findById(decoded.id).select("-password");
      } else if (decoded.role === "admin") {
        const Admin = require("../models/Admin");
        user = await Admin.findById(decoded.id).select("-password");
      } else {
        user = await User.findById(decoded.id).select("-password");
      }

      req.user = user;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token failed",
    });
  }
};

module.exports = {
  protect,
};