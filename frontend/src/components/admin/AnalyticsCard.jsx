import React from "react";

import "./AnalyticsCard.css";


const AnalyticsCard = ({
  title,
  value,
  percentage,
  icon,
  trend = "up",
}) => {

  return (
    <div className="analytics-card-component">

      {/* ================================= */}
      {/* TOP */}
      {/* ================================= */}

      <div className="analytics-card-top">

        <div className="analytics-icon">
          {icon}
        </div>


        <div
          className={`analytics-trend ${
            trend === "up"
              ? "trend-up"
              : "trend-down"
          }`}
        >

          {trend === "up"
            ? "📈"
            : "📉"}

          {percentage}

        </div>

      </div>


      {/* ================================= */}
      {/* CONTENT */}
      {/* ================================= */}

      <div className="analytics-content">

        <h3>
          {title}
        </h3>

        <h2>
          {value}
        </h2>

      </div>

    </div>
  );
};

export default AnalyticsCard;