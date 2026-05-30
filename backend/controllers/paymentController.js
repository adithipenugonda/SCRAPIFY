const Razorpay = require("razorpay");
const crypto = require("crypto");
const Pickup = require("../models/Pickup");
const Transaction = require("../models/Transaction");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});

/**
 * @desc    Create a Razorpay Order
 * @route   POST /api/payments/create-order
 * @access  Private
 */
const createOrder = async (req, res) => {
  try {
    const { pickupId } = req.body;
    
    // Fetch pickup
    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ success: false, message: "Pickup not found" });
    }

    if (pickup.paymentStatus === "Paid") {
      return res.status(400).json({ success: false, message: "Pickup is already paid" });
    }

    // Razorpay requires amount in paise (multiply by 100)
    const amountInPaise = Math.round(pickup.totalAmount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_pickup_${pickupId}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
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
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

/**
 * @desc    Verify Razorpay Payment Signature
 * @route   POST /api/payments/verify
 * @access  Private
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, pickupId } = req.body;

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Payment is authentic, update database
    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
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

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
