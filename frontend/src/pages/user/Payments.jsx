import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import UserLayout from "../../layouts/UserLayout";
import { useAuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import "./Payments.css";

const Payments = () => {
  const { user } = useAuthContext();
  const [pickups, setPickups] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPaymentsData = async () => {
    try {
      // Fetch user's pickups
      const pickupRes = await API.get("/pickups");
      const allPickups = pickupRes.data.pickups || [];
      
      // Filter for completed and unpaid pickups
      const pendingPayments = allPickups.filter(
        (p) => p.status === "Completed" && p.paymentStatus !== "Paid"
      );
      setPickups(pendingPayments);

      // In a real app we'd have a GET /api/payments/history route.
      // For now, we filter from pickups that ARE paid for a simple history,
      // or we can just show the Paid pickups.
      const paidPickups = allPickups.filter(
        (p) => p.paymentStatus === "Paid"
      );
      setTransactions(paidPickups);

    } catch (error) {
      console.error("Error fetching payments data:", error);
      toast.error("Failed to load payments data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (pickup) => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      // 1. Create order
      const orderRes = await API.post("/payments/create-order", {
        pickupId: pickup._id,
      });

      if (!orderRes.data.success) {
        toast.error("Failed to create order");
        return;
      }

      const { id, amount, currency } = orderRes.data.order;

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_dummy", // Provide your test key here
        amount: amount.toString(),
        currency: currency,
        name: "Scrapify",
        description: `Payment for Pickup ${pickup.pickupId}`,
        order_id: id,
        handler: async function (response) {
          try {
            const verifyRes = await API.post("/payments/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              pickupId: pickup._id,
            });

            if (verifyRes.data.success) {
              toast.success("Payment successful!");
              fetchPaymentsData(); // Refresh data
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone || "",
        },
        theme: {
          color: "#00c853",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response){
        toast.error(`Payment failed: ${response.error.description}`);
      });
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment initiation failed");
    }
  };

  return (
    <UserLayout>
      <div className="payments-page">
        <div className="payments-header">
          <h1>Payments</h1>
          <p>Manage your pending pickup payments and view transaction history</p>
        </div>

        {/* Pending Payments Section */}
        <div className="payments-section">
          <h2>Pending Payments</h2>
          {loading ? (
            <p>Loading...</p>
          ) : pickups.length > 0 ? (
            <div className="payments-list">
              {pickups.map((pickup) => (
                <div key={pickup._id} className="payment-card pending">
                  <div className="payment-info">
                    <h4>Pickup ID: {pickup.pickupId}</h4>
                    <p>Date: {new Date(pickup.pickupDate).toLocaleDateString()}</p>
                    <p>Total Weight: {pickup.totalWeight} kg</p>
                  </div>
                  <div className="payment-action">
                    <span className="payment-amount">₹{pickup.totalAmount}</span>
                    <button className="btn-pay" onClick={() => handlePayment(pickup)}>
                      Pay Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No pending payments. You're all caught up!</p>
            </div>
          )}
        </div>

        {/* Transaction History Section */}
        <div className="payments-section history-section">
          <h2>Payment History</h2>
          {loading ? (
            <p>Loading...</p>
          ) : transactions.length > 0 ? (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Pickup ID</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn._id}>
                      <td>{txn.pickupId}</td>
                      <td>{new Date(txn.updatedAt).toLocaleDateString()}</td>
                      <td>{txn.paymentMethod || "Razorpay"}</td>
                      <td className="amount">₹{txn.totalAmount}</td>
                      <td>
                        <span className="status-badge success">Paid</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No past transactions found.</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default Payments;
