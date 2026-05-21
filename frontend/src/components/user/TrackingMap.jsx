import React from "react";

import "./TrackingMap.css";


const TrackingMap = ({
  collectorName = "Ravi Kumar",
  estimatedArrival = "20 mins",
  currentLocation = "Near Kukatpally",
  status = "On The Way",
}) => {

  return (
    <div className="tracking-map-card">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="tracking-header">

        <h2>
          Live Pickup Tracking 📍
        </h2>

        <span className="tracking-status">
          {status}
        </span>

      </div>


      {/* ================================= */}
      {/* MAP PLACEHOLDER */}
      {/* ================================= */}

      <div className="tracking-map">

        <div className="map-overlay">

          <h3>
            🚚 Collector En Route
          </h3>

          <p>
            Real-time tracking map
            integration will appear here.
          </p>

        </div>

      </div>


      {/* ================================= */}
      {/* TRACKING DETAILS */}
      {/* ================================= */}

      <div className="tracking-details">

        <div className="tracking-item">

          <span>
            👨‍🔧 Collector
          </span>

          <h4>
            {collectorName}
          </h4>

        </div>


        <div className="tracking-item">

          <span>
            ⏱ Estimated Arrival
          </span>

          <h4>
            {estimatedArrival}
          </h4>

        </div>


        <div className="tracking-item">

          <span>
            📍 Current Location
          </span>

          <h4>
            {currentLocation}
          </h4>

        </div>

      </div>

    </div>
  );
};

export default TrackingMap;