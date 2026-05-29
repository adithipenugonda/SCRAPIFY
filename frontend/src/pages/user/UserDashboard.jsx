import React, { useState, useEffect } from "react";
import UserLayout from "../../layouts/UserLayout";
import Card from "../../components/common/Card";
import { FaTruck, FaGift, FaIndianRupeeSign, FaLeaf } from "react-icons/fa6";
import API from "../../services/api";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [completedPickups, setCompletedPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await API.get("/pickups/my-pickups");
      if (response.data && response.data.pickups) {
        const completed = response.data.pickups.filter(
          (pickup) => pickup.status === "Completed"
        );
        setCompletedPickups(completed);
      }
    } catch (error) {
      console.error("Error fetching completed pickups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate dynamic stats
  const totalPickups = completedPickups.length;
  const totalEarnings = completedPickups.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const greenPoints = completedPickups.reduce((acc, curr) => acc + (curr.greenPointsEarned || 0), 0);
  const totalWeight = completedPickups.reduce((acc, curr) => acc + (curr.totalWeight || 0), 0);
  const co2Saved = Math.round(totalWeight * 1.2);

  const stats = [
    {
      title: "Total Pickups",
      value: totalPickups.toString(),
      icon: <FaTruck />,
    },
    {
      title: "Green Points",
      value: greenPoints.toLocaleString(),
      icon: <FaGift />,
    },
    {
      title: "Total Earnings",
      value: `₹${totalEarnings.toLocaleString()}`,
      icon: <FaIndianRupeeSign />,
    },
    {
      title: "CO₂ Saved",
      value: `${co2Saved.toLocaleString()}kg`,
      icon: <FaLeaf />,
    },
  ];

  return (
    <UserLayout>
      <div className="user-dashboard">
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="dashboard-header">
          <div>
            <h1>User Dashboard</h1>
            <p>Track your recycling activity and rewards.</p>
          </div>
        </div>

        {/* ================================= */}
        {/* STATS GRID */}
        {/* ================================= */}
        <div className="dashboard-grid">
          {stats.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </div>

        {/* ================================= */}
        {/* RECENT ACTIVITY */}
        {/* ================================= */}
        <div className="dashboard-section">
          <div className="card">
            <h2>Recent Completed Pickups</h2>

            {loading ? (
              <p style={{ color: "var(--text-light)", fontSize: "14px" }}>Loading data...</p>
            ) : completedPickups.length > 0 ? (
              <div className="activity-list">
                {completedPickups.slice(0, 5).map((pickup) => (
                  <div key={pickup._id} className="activity-item">
                    <div>
                      <h4>
                        {pickup.materials?.[0]?.materialType || "General Scrap"}
                        {pickup.materials?.length > 1 && ` + ${pickup.materials.length - 1} more`}
                      </h4>
                      <p style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
                        <span>📅 {new Date(pickup.pickupDate).toLocaleDateString()}</span>
                        <span>⚖️ {pickup.totalWeight} kg</span>
                        <span>💰 ₹{pickup.totalAmount}</span>
                        {pickup.collector && <span>🚚 {pickup.collector.name}</span>}
                      </p>
                    </div>

                    <span className="status completed">
                      {pickup.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-light)" }}>
                <p>No completed pickups yet. Schedule a pickup to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* ================================= */}
        {/* REWARDS SECTION */}
        {/* ================================= */}
        <div className="dashboard-section">
          <div className="card rewards-card">
            <h2>Green Rewards 🌱</h2>
            <p>
              You have accumulated <strong>{greenPoints} Green Points</strong>. Keep recycling to earn more rewards and badges!
            </p>
            <button className="primary-btn">
              Redeem Rewards
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;