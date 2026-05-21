const validateRegister = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  // Name Validation
  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Name is required",
    });
  }

  // Email Validation
  if (!email || email.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  // Basic Email Format Check
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  // Password Validation
  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 6 characters",
    });
  }

  next();
};


// ==========================================
// LOGIN VALIDATION
// ==========================================
const validateLogin = (
  req,
  res,
  next
) => {
  const { email, password } = req.body;

  // Email Check
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  // Password Check
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};