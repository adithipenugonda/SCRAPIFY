import React from "react";

import "./CollectorStats.css";


const CollectorStats = ({
  totalPickups = 86,
  completedPickups = 78,
  pendingPickups = 8,
  earnings = "₹58,200",
}) => {

  const stats = [
    {
      title: "Total Pickups",
      value: totalPickups,
      icon: "🚚",
    },

    {
      title: "Completed",
      value: completedPickups,
      icon: "✅",
    },

    {
      title: "Pending",
      value: pendingPickups,
      icon: "📦",
    },

    {
      title: "Total Earnings",
      value: earnings,
      icon: "💰",
    },
  ];


  return (
    <div className="collector-stats">

      {stats.map((stat, index) => (

        <div
          key={index}
          className="collector-stat-card"
        >

          {/* ICON */}
          <div className="collector-stat-icon">
            {stat.icon}
          </div>


          {/* CONTENT */}
          <div className="collector-stat-content">

            <h3>
              {stat.value}
            </h3>

            <p>
              {stat.title}
            </p>

          </div>

        </div>

      ))}

    </div>
  );
};

export default CollectorStats;