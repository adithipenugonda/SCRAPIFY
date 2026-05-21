const validateUserUpdate = (
  req,
  res,
  next
) => {
  const {
    name,
    phone,
    address,
    city,
    state,
    pincode,
  } = req.body;

  // Name Validation
  if (name !== undefined) {
    if (name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
    }
  }

  // Phone Validation
  if (phone !== undefined) {
    const phoneRegex =
      /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid phone number format",
      });
    }
  }

  // Address Validation
  if (address !== undefined) {
    if (address.trim() === "") {
      return res.status(400).json({
        success: false,
        message:
          "Address cannot be empty",
      });
    }
  }

  // City Validation
  if (city !== undefined) {
    if (city.trim() === "") {
      return res.status(400).json({
        success: false,
        message:
          "City cannot be empty",
      });
    }
  }

  // State Validation
  if (state !== undefined) {
    if (state.trim() === "") {
      return res.status(400).json({
        success: false,
        message:
          "State cannot be empty",
      });
    }
  }

  // Pincode Validation
  if (pincode !== undefined) {
    const pincodeRegex =
      /^[1-9][0-9]{5}$/;

    if (!pincodeRegex.test(pincode)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid pincode format",
      });
    }
  }

  next();
};

module.exports = {
  validateUserUpdate,
};