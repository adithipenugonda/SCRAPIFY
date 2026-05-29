import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Card from "../../components/common/Card";
import API from "../../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentPickups, setRecentPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await API.get("/admin/dashboard");
      if (response.data && response.data.dashboard) {
        setAnalytics(response.data.dashboard.analytics);
        setRecentPickups(response.data.dashboard.recentPickups);
      }
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = analytics
    ? [
        {
          title: "Total Users",
          value: analytics.totalUsers.toLocaleString(),
          icon: "👥",
        },
        {
          title: "Total Collectors",
          value: analytics.totalCollectors.toLocaleString(),
          icon: "🚚",
        },
        {
          title: "Total Pickups",
          value: analytics.totalPickups.toLocaleString(),
          icon: "♻️",
        },
        {
          title: "Pending Pickups",
          value: analytics.pendingPickups.toLocaleString(),
          icon: "⏳",
        },
        {
          title: "Accepted Pickups",
          value: analytics.acceptedPickups.toLocaleString(),
          icon: "✅",
        },
        {
          title: "Completed Pickups",
          value: analytics.completedPickups.toLocaleString(),
          icon: "📦",
        },
        {
          title: "Total Revenue",
          value: `₹${analytics.totalRevenue.toLocaleString()}`,
          icon: "💰",
        },
        {
          title: "Green Points",
          value: analytics.totalGreenPointsGenerated.toLocaleString(),
          icon: "🌱",
        },
      ]
    : [];

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard ⚙️</h1>
            <p>
              Monitor users, collectors, pickups, analytics, and overall platform activity.
            </p>
          </div>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-light)", fontSize: "14px" }}>Loading data...</p>
        ) : (
          <>
            {/* ================================= */}
            {/* STATS GRID */}
            {/* ================================= */}
            <div className="admin-grid">
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
            <div className="admin-section">
              <div className="card">
                <div className="section-header-admin">
                  <h2>Recent Platform Activity</h2>
                </div>

                <div className="activity-list">
                  {recentPickups && recentPickups.length > 0 ? (
                    recentPickups.map((pickup) => (
                      <div key={pickup._id} className="activity-item">
                        <div>
                          <h4>
                            {pickup.materials?.[0]?.materialType || "General Scrap"} pickup request - {pickup.status}
                          </h4>
                          <p>
                            User: {pickup.user?.name || "Unknown"}
                            {pickup.collector && ` | Collector: ${pickup.collector.name}`}
                          </p>
                        </div>
                        <span className="activity-time">
                          {new Date(pickup.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "var(--text-light)", fontSize: "14px" }}>
                      No recent activities recorded.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ================================= */}
            {/* ANALYTICS */}
            {/* ================================= */}
            <div className="admin-section">
              <div className="card analytics-card">
                <h2>Platform Insights 📊</h2>
                <p>
                  Scrapify is currently serving <strong>{analytics?.totalUsers} registered users</strong> and <strong>{analytics?.totalCollectors} active collectors</strong> across the platform. A total of <strong>{analytics?.totalGreenPointsGenerated} Green Points</strong> have been generated to promote sustainable environmental practices.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;