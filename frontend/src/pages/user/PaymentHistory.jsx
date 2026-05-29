import React, { useEffect, useState } from "react";
import UserLayout from "../../layouts/UserLayout";
import API from "../../services/api";
import "./PaymentHistory.css";

const PaymentHistory = () => {
  const [completedPayments, setCompletedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    try {
      const response = await API.get("/pickups/my-pickups");
      if (response.data && response.data.pickups) {
        // Filter only completed pickups to track payments
        const completed = response.data.pickups.filter(
          (pickup) => pickup.status === "Completed"
        );
        setCompletedPayments(completed);
      }
    } catch (err) {
      console.error("Error fetching payment history:", err);
      setError("Failed to load payment history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Dynamic calculations
  const totalPayout = completedPayments.reduce(
    (acc, curr) => acc + (curr.totalAmount || 0),
    0
  );
  
  const completedCount = completedPayments.length;

  // Calculate Primary Payment Method
  const getPrimaryMethod = () => {
    if (completedPayments.length === 0) return "N/A";
    const counts = {};
    completedPayments.forEach((p) => {
      const method = p.paymentMethod || "UPI";
      counts[method] = (counts[method] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
  };

  const primaryMethod = getPrimaryMethod();

  return (
    <UserLayout>
      <div className="payment-history-page">
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="payment-header">
          <h1>Payment History 💳</h1>
          <p>Track your payouts, completed transaction methods, and earnings history.</p>
        </div>

        {/* ================================= */}
        {/* STATS SUMMARY GRID */}
        {/* ================================= */}
        <div className="payment-stats-grid">
          <div className="payment-stat-card neo-card-flat glowing-neon-border">
            <span>Total Recycled Payouts</span>
            <h2>₹{totalPayout.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            <p className="green">🌱 Direct earnings from eco-recycling</p>
          </div>

          <div className="payment-stat-card neo-card-flat glowing-neon-border">
            <span>Paid Transactions</span>
            <h2>{completedCount}</h2>
            <p className="green">✅ Fully processed pickups</p>
          </div>

          <div className="payment-stat-card neo-card-flat glowing-neon-border">
            <span>Preferred Payout Mode</span>
            <h2>{primaryMethod}</h2>
            <p className="green">💳 Most frequently chosen method</p>
          </div>
        </div>

        {/* ================================= */}
        {/* TRANSACTIONS CARD */}
        {/* ================================= */}
        <div className="transactions-card neo-card-flat glowing-neon-border">
          <div className="transactions-card-header">
            <h2>Recent Payout Records</h2>
          </div>

          {loading ? (
            <p style={{ padding: "20px", color: "var(--text-light)" }}>Loading transactions...</p>
          ) : error ? (
            <p style={{ padding: "20px", color: "red" }}>{error}</p>
          ) : completedPayments.length > 0 ? (
            <div className="transactions-table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Pickup ID</th>
                    <th>Date Completed</th>
                    <th>Material Type</th>
                    <th>Weight</th>
                    <th>Payout Mode</th>
                    <th>Amount</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedPayments.map((pickup) => (
                    <tr key={pickup._id}>
                      <td className="tx-id">{pickup.pickupId || "N/A"}</td>
                      <td>{new Date(pickup.updatedAt).toLocaleDateString()}</td>
                      <td>
                        {pickup.materials?.[0]?.materialType || "General Scrap"}
                        {pickup.materials?.length > 1 && ` + ${pickup.materials.length - 1} more`}
                      </td>
                      <td>{pickup.totalWeight} kg</td>
                      <td>{pickup.paymentMethod || "UPI"}</td>
                      <td className="tx-amount">₹{pickup.totalAmount}</td>
                      <td>
                        <span className={`status completed`}>
                          {pickup.paymentStatus || "Paid"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-transactions">
              <p>No completed payouts found in your history.</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default PaymentHistory;
