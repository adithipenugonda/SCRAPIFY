import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import UserLayout from "../../layouts/UserLayout";
import "./PaymentStatus.css"; // Create a shared CSS file for Success/Failure

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // We expect query params like ?payment_id=xxx&order_id=xxx&amount=xxx&method=Razorpay
    const id = searchParams.get("payment_id");
    const orderId = searchParams.get("order_id");
    const amount = searchParams.get("amount");
    const method = searchParams.get("method") || "Razorpay";
    
    if (id && orderId && amount) {
      setPaymentDetails({ id, orderId, amount, method });
    }
  }, [searchParams]);

  return (
    <UserLayout>
      <div className="payment-status-container">
        <motion.div 
          className="payment-card success-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="icon-wrapper success-icon">
            <CheckCircleIcon className="icon" />
          </div>
          
          <h1>Payment Successful</h1>
          <p className="subtitle">Your transaction was completed successfully.</p>

          {paymentDetails && (
            <div className="receipt">
              <div className="receipt-row">
                <span>Amount Paid</span>
                <strong className="amount">₹{paymentDetails.amount}</strong>
              </div>
              <div className="receipt-row">
                <span>Payment ID</span>
                <strong>{paymentDetails.id}</strong>
              </div>
              <div className="receipt-row">
                <span>Order ID</span>
                <strong>{paymentDetails.orderId}</strong>
              </div>
              <div className="receipt-row">
                <span>Payment Method</span>
                <strong>{paymentDetails.method}</strong>
              </div>
              <div className="receipt-row">
                <span>Date & Time</span>
                <strong>{new Date().toLocaleString()}</strong>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button className="btn-primary" onClick={() => navigate("/user/payments")}>
              View Payments History
            </button>
            <button className="btn-secondary" onClick={() => navigate("/user/dashboard")}>
              Go to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </UserLayout>
  );
};

export default PaymentSuccess;
