const Razorpay = require("razorpay");
const crypto = require("crypto");
const Pickup = require("../models/Pickup");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");

/**
 * Helper to initialize Razorpay instance
 */
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret || key_id === "dummy_key" || key_id.includes("dummy")) {
    throw new Error("Razorpay keys are missing or invalid in environment variables.");
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

/**
 * @desc    Create a Razorpay Order
 * @route   POST /api/payments/create-order
 * @access  Private
 */
const createOrder = async (req, res) => {
  console.log("--- START: /api/payments/create-order ---");
  console.log("Request Payload:", req.body);
  console.log("User ID:", req.user?._id);

  try {
    const { pickupId } = req.body;

    // Validate request body
    if (!pickupId) {
      console.error("Validation Failed: Missing pickupId");
      return res.status(400).json({ success: false, message: "Missing pickupId in request body" });
    }

    if (!req.user || !req.user._id) {
      console.error("Validation Failed: Missing authenticated user");
      return res.status(401).json({ success: false, message: "Unauthorized: User ID not found" });
    }

    // Initialize Razorpay
    let razorpay;
    try {
      razorpay = getRazorpayInstance();
    } catch (configError) {
      console.error("Configuration Error:", configError.message);
      return res.status(500).json({ success: false, message: "Payment gateway configuration error. Please contact admin." });
    }

    // Fetch pickup
    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      console.error(`Lookup Failed: Pickup with ID ${pickupId} not found`);
      return res.status(404).json({ success: false, message: "Pickup not found" });
    }

    // Validate pickup details
    if (!pickup.totalAmount || pickup.totalAmount <= 0) {
      console.error(`Validation Failed: Invalid totalAmount (${pickup.totalAmount}) for pickup ${pickupId}`);
      return res.status(400).json({ success: false, message: "Invalid pickup amount" });
    }

    if (pickup.paymentStatus === "Paid") {
      console.error(`Validation Failed: Pickup ${pickupId} is already paid`);
      return res.status(400).json({ success: false, message: "Pickup is already paid" });
    }

    // Create Order
    const amountInPaise = Math.round(pickup.totalAmount * 100);
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_pickup_${pickupId}`,
    };

    console.log("Creating Razorpay order with options:", options);

    const order = await razorpay.orders.create(options);
    
    console.log("Razorpay Order Created Successfully:", order.id);

    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      pickup: {
        id: pickup._id,
        amount: pickup.totalAmount,
      }
    });
  } catch (error) {
    console.error("--- EXCEPTION CAUGHT in createOrder ---");
    console.error(error);

    // Format Razorpay specific error message if present
    const errorMessage = error.error?.description || error.message || "An unexpected error occurred while creating the payment order.";

    return res.status(500).json({ 
      success: false, 
      message: "Payment Order Creation Failed", 
      error: errorMessage 
    });
  } finally {
    console.log("--- END: /api/payments/create-order ---");
  }
};

/**
 * @desc    Verify Razorpay Payment Signature
 * @route   POST /api/payments/verify
 * @access  Private
 */
const verifyPayment = async (req, res) => {
  console.log("--- START: /api/payments/verify ---");
  console.log("Request Payload:", req.body);

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, pickupId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !pickupId) {
      console.error("Validation Failed: Missing payment verification details");
      return res.status(400).json({ success: false, message: "Missing required payment verification details" });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("Configuration Error: Missing RAZORPAY_KEY_SECRET");
      return res.status(500).json({ success: false, message: "Payment gateway configuration error" });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      console.error("Signature Verification Failed!");
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Payment is authentic, update database
    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      console.error(`Lookup Failed: Pickup ${pickupId} not found`);
      return res.status(404).json({ success: false, message: "Pickup not found" });
    }

    // Mark pickup as paid
    pickup.paymentStatus = "Paid";
    pickup.paymentMethod = "Razorpay";
    await pickup.save();

    // Increment user totalPaid
    const User = require("../models/User");
    const user = await User.findById(pickup.user);
    if (user) {
      user.totalPaid = (user.totalPaid || 0) + pickup.totalAmount;
      await user.save();
    }

    // Create transaction record
    const transaction = await Transaction.create({
      user: pickup.user,
      pickup: pickup._id,
      transactionId: `TXN-${Date.now()}`,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: pickup.totalAmount,
      paymentMethod: "Razorpay",
      paymentStatus: "Success",
      transactionType: "Pickup Payment",
    });

    // Create Notification
    await Notification.create({
      user: pickup.user,
      userModel: "User",
      title: "Payment Successful",
      message: `Your payment of ₹${pickup.totalAmount} for pickup ${pickup.pickupId} was successful.`,
      notificationType: "Payment",
    });

    console.log("Payment Verification Successful for Pickup:", pickupId);

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      transaction,
    });
  } catch (error) {
    console.error("--- EXCEPTION CAUGHT in verifyPayment ---");
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: "Payment Verification Failed", 
      error: error.message 
    });
  } finally {
    console.log("--- END: /api/payments/verify ---");
  }
};

/**
 * @desc    Handle Failed Payment
 * @route   POST /api/payments/fail
 * @access  Private
 */
const failPayment = async (req, res) => {
  try {
    const { pickupId, error_description, order_id } = req.body;

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ success: false, message: "Pickup not found" });
    }

    // Create a failed transaction record
    const transaction = await Transaction.create({
      user: pickup.user,
      pickup: pickup._id,
      transactionId: `TXN-${Date.now()}`,
      orderId: order_id || null,
      amount: pickup.totalAmount,
      paymentMethod: "Razorpay",
      paymentStatus: "Failed",
      transactionType: "Pickup Payment",
      notes: error_description || "Payment failed or was cancelled",
    });

    // Create Notification
    await Notification.create({
      user: pickup.user,
      userModel: "User",
      title: "Payment Failed",
      message: `Your payment of ₹${pickup.totalAmount} for pickup ${pickup.pickupId} failed. Please retry.`,
      notificationType: "Payment",
    });

    return res.status(200).json({
      success: true,
      message: "Failed transaction logged",
      transaction,
    });
  } catch (error) {
    console.error("Error logging failed payment:", error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

/**
 * @desc    Get user's payment history
 * @route   GET /api/payments/history
 * @access  Private
 */
const getPaymentHistory = async (req, res) => {
  try {
    // Fetch all transactions for this user
    const transactions = await Transaction.find({ user: req.user._id })
      .populate("pickup", "pickupId pickupDate status totalWeight")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  failPayment,
  getPaymentHistory,
};
