import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircleIcon } from "@heroicons/react/24/solid";
import UserLayout from "../../layouts/UserLayout";
import "./PaymentStatus.css";

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    const errorMsg = searchParams.get("error") || "Payment was cancelled or failed.";
    const orderId = searchParams.get("order_id") || "N/A";
    
    setErrorDetails({ errorMsg, orderId });
  }, [searchParams]);

  return (
    <UserLayout>
      <div className="payment-status-container">
        <motion.div 
          className="payment-card failure-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="icon-wrapper failure-icon">
            <XCircleIcon className="icon" />
          </div>
          
          <h1>Payment Failed</h1>
          <p className="subtitle">We could not process your transaction.</p>

          {errorDetails && (
            <div className="receipt">
              <div className="receipt-row">
                <span>Reason</span>
                <strong className="error-text">{errorDetails.errorMsg}</strong>
              </div>
              <div className="receipt-row">
                <span>Order ID</span>
                <strong>{errorDetails.orderId}</strong>
              </div>
              <div className="receipt-row">
                <span>Date & Time</span>
                <strong>{new Date().toLocaleString()}</strong>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button className="btn-primary retry-btn" onClick={() => navigate("/user/payments")}>
              Retry Payment
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

export default PaymentFailure;
