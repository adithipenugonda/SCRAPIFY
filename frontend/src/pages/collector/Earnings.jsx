import React, { useState, useEffect } from "react";
import CollectorLayout from "../../layouts/CollectorLayout";
import API from "../../services/api";
import "./Earnings.css";

const Earnings = () => {
  const [completedPickups, setCompletedPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFormattedDate = () => {
    const date = new Date();
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    const day = date.getDate();
    const monthName = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    return `${dayName}, ${day} ${monthName}`;
  };

  const fetchEarningsData = async () => {
    try {
      const response = await API.get("/pickups/collector-history");
      if (response.data && response.data.pickups) {
        setCompletedPickups(response.data.pickups);
      }
    } catch (error) {
      console.error("Error fetching completed pickups for collector:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, []);

  // Calculate dynamic stats
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(now.getDate() - 30);

  // 1. Today's earnings
  const todayEarnings = completedPickups
    .filter((pickup) => new Date(pickup.updatedAt || pickup.createdAt) >= startOfToday)
    .reduce((sum, pickup) => sum + (pickup.totalAmount || 0), 0);

  // 2. Weekly earnings (last 7 days)
  const weeklyEarnings = completedPickups
    .filter((pickup) => new Date(pickup.updatedAt || pickup.createdAt) >= oneWeekAgo)
    .reduce((sum, pickup) => sum + (pickup.totalAmount || 0), 0);

  // 3. Monthly earnings (last 30 days)
  const monthlyEarnings = completedPickups
    .filter((pickup) => new Date(pickup.updatedAt || pickup.createdAt) >= oneMonthAgo)
    .reduce((sum, pickup) => sum + (pickup.totalAmount || 0), 0);

  // 4. Completed pickups count
  const completedCount = completedPickups.length;

  // 5. Daily earnings data for the custom bar chart (last 7 days)
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dailyEarnings = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dayName = daysOfWeek[d.getDay()];
    
    const dayAmount = completedPickups
      .filter((pickup) => {
        const pDate = new Date(pickup.updatedAt || pickup.createdAt);
        return (
          pDate.getDate() === d.getDate() &&
          pDate.getMonth() === d.getMonth() &&
          pDate.getFullYear() === d.getFullYear()
        );
      })
      .reduce((sum, pickup) => sum + (pickup.totalAmount || 0), 0);
      
    dailyEarnings.push({ day: dayName, amount: dayAmount });
  }

  const maxAmount = Math.max(...dailyEarnings.map((d) => d.amount), 100);

  return (
    <CollectorLayout>
      <div className="earnings-container">
        
        {/* ================================= */}
        {/* HEADER SECTION */}
        {/* ================================= */}
        <header className="earnings-header">
          <span className="header-date">{getFormattedDate()}</span>
          <h1>Earnings</h1>
          <p className="header-subtext">
            Your performance and payouts.
          </p>
        </header>

        {loading ? (
          <p style={{ color: "var(--text-light)", fontSize: "14px" }}>Loading data...</p>
        ) : (
          <>
            {/* ================================= */}
            {/* STATS CARDS GRID */}
            {/* ================================= */}
            <section className="earnings-stats-grid">
              <div className="stat-card today">
                <span className="stat-title">TODAY</span>
                <h2 className="stat-value">₹{todayEarnings.toLocaleString()}</h2>
                <p className="stat-subtext">Completed today</p>
              </div>

              <div className="stat-card">
                <span className="stat-title">THIS WEEK</span>
                <h2 className="stat-value">₹{weeklyEarnings.toLocaleString()}</h2>
                <p className="stat-subtext">Last 7 days</p>
              </div>

              <div className="stat-card">
                <span className="stat-title">THIS MONTH</span>
                <h2 className="stat-value">₹{monthlyEarnings.toLocaleString()}</h2>
                <p className="stat-subtext">Last 30 days</p>
              </div>

              <div className="stat-card">
                <span className="stat-title">COMPLETED PICKUPS</span>
                <h2 className="stat-value">{completedCount}</h2>
                <p className="stat-subtext">Total pickups</p>
              </div>
            </section>

            {/* ================================= */}
            {/* DAILY EARNINGS CHART CARD */}
            {/* ================================= */}
            <section className="earnings-chart-section">
              <div className="daily-earnings-card">
                <div className="card-header">
                  <h3>Daily earnings</h3>
                  <span className="filter-label">Last 7 days</span>
                </div>

                <div className="chart-wrapper">
                  <div className="custom-bar-chart">
                    {dailyEarnings.map((data, index) => {
                      const heightPercent = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;
                      
                      return (
                        <div key={index} className="chart-column">
                          <span className={`bar-value-label ${data.amount === 0 ? "zero" : ""}`}>
                            ₹{data.amount.toLocaleString()}
                          </span>

                          <div className="bar-track">
                            <div 
                              className="bar-fill" 
                              style={{ height: `${heightPercent}%` }}
                            ></div>
                          </div>

                          <span className="bar-day-label">{data.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

      </div>
    </CollectorLayout>
  );
};

export default Earnings;