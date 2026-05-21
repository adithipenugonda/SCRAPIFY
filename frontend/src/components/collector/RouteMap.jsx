import React from "react";

import "./RouteMap.css";


const RouteMap = ({
  collectorName = "Ravi Kumar",
  currentLocation = "Madhapur",
  destination = "Gachibowli",
  estimatedTime = "25 mins",
  totalDistance = "6 km",
  activeJobs = 4,
}) => {

  return (

    <div className="premium-route-map card">


      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="route-map-header">

        <div>

          <p className="route-subtitle">
            Smart Navigation
          </p>

          <h2>
            Route Optimization
          </h2>

        </div>


        <div className="route-status">

          <span className="route-dot"></span>

          Active Route

        </div>

      </div>


      {/* ================================= */}
      {/* MAP */}
      {/* ================================= */}

      <div className="premium-map-container">

        {/* MAP OVERLAY */}

        <div className="premium-map-overlay">

          <h3>
            🚛 Navigation Active
          </h3>

          <p>
            Google Maps integration
            will appear here
          </p>

        </div>


        {/* ROUTE PINS */}

        <div className="map-pin start-pin">
          📍
        </div>

        <div className="map-pin end-pin">
          🎯
        </div>


        {/* ROUTE LINE */}

        <div className="route-line"></div>

      </div>


      {/* ================================= */}
      {/* STATS */}
      {/* ================================= */}

      <div className="route-stats-grid">


        <div className="route-stat-card">

          <span>
            👨‍🔧 Collector
          </span>

          <h4>
            {collectorName}
          </h4>

        </div>


        <div className="route-stat-card">

          <span>
            📍 Current Location
          </span>

          <h4>
            {currentLocation}
          </h4>

        </div>


        <div className="route-stat-card">

          <span>
            🎯 Destination
          </span>

          <h4>
            {destination}
          </h4>

        </div>


        <div className="route-stat-card">

          <span>
            ⏱ ETA
          </span>

          <h4>
            {estimatedTime}
          </h4>

        </div>


        <div className="route-stat-card">

          <span>
            🛣 Distance
          </span>

          <h4>
            {totalDistance}
          </h4>

        </div>


        <div className="route-stat-card">

          <span>
            📦 Active Jobs
          </span>

          <h4>
            {activeJobs}
          </h4>

        </div>

      </div>


      {/* ================================= */}
      {/* FOOTER */}
      {/* ================================= */}

      <div className="route-footer">

        <button className="primary-btn">
          Start Navigation
        </button>

        <button className="secondary-btn">
          Optimize Route
        </button>

      </div>

    </div>

  );

};

export default RouteMap;