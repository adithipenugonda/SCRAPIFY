import React from "react";

import "./PickupCard.css";


const PickupCard = ({
  materialType,
  weight,
  amount,
  status,
  pickupDate,
  collector,
}) => {

  // ==========================================
  // STATUS CLASS
  // ==========================================
  const getStatusClass = () => {
    switch (status) {

      case "Completed":
        return "completed";

      case "Pending":
        return "pending";

      case "In Progress":
        return "progress";

      default:
        return "";
    }
  };


  return (
    <div className="pickup-card">

      {/* ===================================== */}
      {/* TOP */}
      {/* ===================================== */}

      <div className="pickup-card-top">

        <div>

          <h3>
            {materialType}
          </h3>

          <p>
            Pickup Date:
            {" "}
            {pickupDate}
          </p>

        </div>

        <span
          className={`pickup-status ${getStatusClass()}`}
        >
          {status}
        </span>

      </div>


      {/* ===================================== */}
      {/* BODY */}
      {/* ===================================== */}

      <div className="pickup-card-body">

        <div className="pickup-info">

          <span>
            ⚖️ Weight
          </span>

          <h4>
            {weight} kg
          </h4>

        </div>


        <div className="pickup-info">

          <span>
            💰 Earnings
          </span>

          <h4>
            ₹{amount}
          </h4>

        </div>


        <div className="pickup-info">

          <span>
            🚚 Collector
          </span>

          <h4>
            {collector}
          </h4>

        </div>

      </div>

    </div>
  );
};

export default PickupCard;