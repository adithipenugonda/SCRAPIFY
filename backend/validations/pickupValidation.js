const validatePickup = (
  req,
  res,
  next
) => {
  const {
    materials,
    pickupDate,
    pickupTimeSlot,
    address,
    city,
    state,
    pincode,
  } = req.body;

  // Materials Validation
  if (
    !materials ||
    !Array.isArray(materials) ||
    materials.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "At least one scrap material is required",
    });
  }

  // Validate Each Material
  for (const item of materials) {
    if (!item.materialType) {
      return res.status(400).json({
        success: false,
        message:
          "Material type is required",
      });
    }

    if (
      item.estimatedWeight === undefined ||
      item.estimatedWeight <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Estimated weight must be greater than 0",
      });
    }

    if (
      item.pricePerKg === undefined ||
      item.pricePerKg <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Price per kg must be greater than 0",
      });
    }
  }

  // Pickup Date Validation
  if (!pickupDate) {
    return res.status(400).json({
      success: false,
      message: "Pickup date is required",
    });
  }

  // Pickup Slot Validation
  if (!pickupTimeSlot) {
    return res.status(400).json({
      success: false,
      message:
        "Pickup time slot is required",
    });
  }

  // Address Validation
  if (!address) {
    return res.status(400).json({
      success: false,
      message: "Address is required",
    });
  }

  if (!city) {
    return res.status(400).json({
      success: false,
      message: "City is required",
    });
  }

  if (!state) {
    return res.status(400).json({
      success: false,
      message: "State is required",
    });
  }

  // Pincode Validation
  if (!pincode) {
    return res.status(400).json({
      success: false,
      message: "Pincode is required",
    });
  }

  // Indian Pincode Check
  const pincodeRegex = /^[1-9][0-9]{5}$/;

  if (!pincodeRegex.test(pincode)) {
    return res.status(400).json({
      success: false,
      message: "Invalid pincode format",
    });
  }

  next();
};

module.exports = {
  validatePickup,
};