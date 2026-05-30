const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createOrder, verifyPayment, failPayment, getPaymentHistory } = require("../controllers/paymentController");

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.post("/fail", protect, failPayment);
router.get("/history", protect, getPaymentHistory);

module.exports = router;
