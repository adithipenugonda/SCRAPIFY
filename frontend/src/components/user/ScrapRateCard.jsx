import React from "react";

import "./ScrapRateCard.css";


const ScrapRateCard = ({
  material,
  price,
  unit = "kg",
  icon,
  trend,
}) => {

  return (
    <div className="scrap-rate-card">

      {/* ===================================== */}
      {/* TOP */}
      {/* ===================================== */}

      <div className="scrap-rate-top">

        <div className="scrap-icon">
          {icon}
        </div>

        <div>

          <h3>
            {material}
          </h3>

          <p>
            Current Market Rate
          </p>

        </div>

      </div>


      {/* ===================================== */}
      {/* PRICE */}
      {/* ===================================== */}

      <div className="scrap-rate-price">

        ₹{price}
        <span>
          /{unit}
        </span>

      </div>


      {/* ===================================== */}
      {/* TREND */}
      {/* ===================================== */}

      <div
        className={`scrap-trend ${trend === "up"
          ? "up"
          : "down"
        }`}
      >

        {trend === "up"
          ? "📈 Increasing"
          : "📉 Decreasing"}

      </div>

    </div>
  );
};

export default ScrapRateCard;