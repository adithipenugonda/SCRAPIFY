import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Card from "../../components/common/Card";
import API from "../../services/api";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentPickups, setRecentPickups] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await API.get("/admin/dashboard");
      if (response.data && response.data.dashboard) {
        setAnalytics(response.data.dashboard.analytics);
        setRecentPickups(response.data.dashboard.recentPickups);
        setChartData(response.data.dashboard.chartData || []);
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
            {/* CHARTS SECTION */}
            {/* ================================= */}
            <div className="admin-charts-row">
              <div className="card admin-chart-card">
                <h3>Daily Pickup Requests (Last 7 Days)</h3>
                <div className="chart-container-admin">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                        labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                      />
                      <Bar dataKey="pickups" fill="#22c55e" radius={[4, 4, 0, 0]} name="Requests" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card admin-chart-card">
                <h3>Daily Revenue Generated (Last 7 Days)</h3>
                <div className="chart-container-admin">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                      <Tooltip 
                        formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                        contentStyle={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                        labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                      />
                      <Area type="monotone" dataKey="earnings" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
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