import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UserLayout from "../../layouts/UserLayout";
import { useAuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import "./Payments.css";

const Payments = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [pickups, setPickups] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const fetchPaymentsData = async () => {
    try {
      setLoading(true);
      // Fetch user's pickups
      const pickupRes = await API.get("/pickups");
      const allPickups = pickupRes.data.pickups || [];
      
      const pendingPayments = allPickups.filter(
        (p) => p.status === "Completed" && p.paymentStatus !== "Paid"
      );
      setPickups(pendingPayments);

      // Fetch Transaction history
      const historyRes = await API.get("/payments/history");
      if (historyRes.data.success) {
        setTransactions(historyRes.data.transactions);
      }
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

  // Filter transactions based on active tab
  const getFilteredTransactions = () => {
    if (activeTab === "Paid") return transactions.filter(t => t.paymentStatus === "Success");
    if (activeTab === "Failed") return transactions.filter(t => t.paymentStatus === "Failed");
    return transactions;
  };

  return (
    <UserLayout>
      <div className="payments-page">
        <div className="payments-header">
          <h1>Payments</h1>
          <p>Manage your pending pickup payments and view transaction history</p>
        </div>

        {/* Filters */}
        <div className="payment-filters">
          {["All", "Pending", "Paid", "Failed"].map(tab => (
            <button 
              key={tab} 
              className={`filter-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Pending Payments Section (Only show if All or Pending tab is active) */}
        {(activeTab === "All" || activeTab === "Pending") && (
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
                      <span style={{ fontSize: "14px", color: "var(--text-light)", fontStyle: "italic" }}>
                        Payment Pending
                      </span>
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
        )}

        {/* Transaction History Section (Only show if All, Paid, or Failed tab is active) */}
        {(activeTab === "All" || activeTab === "Paid" || activeTab === "Failed") && (
          <div className="payments-section history-section">
            <h2>Payment History</h2>
            {loading ? (
              <p>Loading...</p>
            ) : getFilteredTransactions().length > 0 ? (
              <div className="history-table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Pickup ID</th>
                      <th>Date</th>
                      <th>Method</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredTransactions().map((txn) => (
                      <tr key={txn._id}>
                        <td>{txn.transactionId}</td>
                        <td>{txn.pickup?.pickupId || "N/A"}</td>
                        <td>{new Date(txn.createdAt).toLocaleString()}</td>
                        <td>{txn.paymentMethod}</td>
                        <td className="amount">₹{txn.amount}</td>
                        <td>
                          <span className={`status-badge ${txn.paymentStatus.toLowerCase()}`}>
                            {txn.paymentStatus}
                          </span>
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
        )}
      </div>
    </UserLayout>
  );
};

export default Payments;
