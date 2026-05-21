import React from "react";
import CollectorLayout from "../../layouts/CollectorLayout";
import "./Earnings.css";

const Earnings = () => {
  const getFormattedDate = () => {
    const date = new Date();
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    const day = date.getDate();
    const monthName = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    return `${dayName}, ${day} ${monthName}`;
  };

  // 7-day earnings data for the custom bar chart
  const dailyEarnings = [
    { day: "Mon", amount: 1200 },
    { day: "Tue", amount: 1640 },
    { day: "Wed", amount: 980 },
    { day: "Thu", amount: 2100 },
    { day: "Fri", amount: 1860 },
    { day: "Sat", amount: 1840 },
    { day: "Sun", amount: 0 },
  ];

  const maxAmount = Math.max(...dailyEarnings.map((d) => d.amount));

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
            Your weekly performance and payouts.
          </p>
        </header>

        {/* ================================= */}
        {/* STATS CARDS GRID */}
        {/* ================================= */}
        <section className="earnings-stats-grid">
          <div className="stat-card today">
            <span className="stat-title">THIS WEEK</span>
            <h2 className="stat-value">₹9,620</h2>
            <p className="stat-subtext highlight-green">+18% vs last week</p>
          </div>

          <div className="stat-card">
            <span className="stat-title">PICKUPS</span>
            <h2 className="stat-value">32</h2>
            <p className="stat-subtext">Avg ₹301 / pickup</p>
          </div>

          <div className="stat-card">
            <span className="stat-title">PENDING PAYOUT</span>
            <h2 className="stat-value">₹1,840</h2>
            <p className="stat-subtext">Settles tomorrow 9 AM</p>
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
                  // Compute height percentage relative to maximum amount
                  const heightPercent = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;
                  
                  return (
                    <div key={index} className="chart-column">
                      {/* Amount Label on Top of the Bar */}
                      <span className={`bar-value-label ${data.amount === 0 ? "zero" : ""}`}>
                        ₹{data.amount.toLocaleString()}
                      </span>

                      {/* Bar Graphic */}
                      <div className="bar-track">
                        <div 
                          className="bar-fill" 
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                      </div>

                      {/* Day Label at the bottom */}
                      <span className="bar-day-label">{data.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

      </div>
    </CollectorLayout>
  );
};

export default Earnings;