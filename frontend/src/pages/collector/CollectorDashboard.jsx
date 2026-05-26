import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import CollectorLayout from "../../layouts/CollectorLayout";
import "./CollectorDashboard.css";
import API from "../../services/api";

const CollectorDashboard = () => {
  const { user } = useAuthContext();

  // Status toggle
  const [isOnline, setIsOnline] = useState(true);

  // Stats state (for dynamic updates when accepting jobs)
  const [stats, setStats] = useState({
    todayEarnings: 1840,
    todayPickups: 6,
    thisWeekEarnings: 9420,
    thisWeekPickups: 32,
    rating: 4.9,
    ratingCount: 1247,
    acceptanceRate: 96,
  });

  // Jobs state (each job maps to an SVG node in the optimized route visualizer)
  const [availableJobs, setAvailableJobs] = useState([
    {
      id: 1,
      material: "Paper + Plastic",
      payout: 145,
      location: "HSR Sector 2",
      time: "Now",
      distance: "1.2 km",
      weight: "~9kg",
      coords: { x: 80, y: 70 },
      dotColor: "#ff9800",
    },
    {
      id: 2,
      material: "E-Waste",
      payout: 332,
      location: "Koramangala 5th Block",
      time: "Now",
      distance: "2.4 km",
      weight: "~3.5kg",
      coords: { x: 230, y: 90 },
      dotColor: "#00bcd4",
    },
    {
      id: 3,
      material: "Iron Scrap",
      payout: 616,
      location: "BTM Layout",
      time: "30 min",
      distance: "0.8 km",
      weight: "~22kg",
      coords: { x: 70, y: 210 },
      dotColor: "#9c27b0",
    },
  ]);

  // Static depot stop
  const depotStop = { x: 230, y: 210, label: "Depot" };

  // Calculate dynamic greeting based on local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Format current date exactly like MONDAY, 18 MAY
  const getFormattedDate = () => {
    const date = new Date();
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    const day = date.getDate();
    const monthName = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    return `${dayName}, ${day} ${monthName}`;
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "Rajesh";

  // Actions
 const handleAcceptJob = async (job) => {

  try {

    await API.put(
      `/pickups/accept/${job._id}`
    );

    toast.success(
      "Pickup accepted!"
    );

    // Update stats
    setStats((prev) => ({
      ...prev,
      todayEarnings:
        prev.todayEarnings + job.totalAmount,

      thisWeekEarnings:
        prev.thisWeekEarnings + job.totalAmount,

      todayPickups:
        prev.todayPickups + 1,

      thisWeekPickups:
        prev.thisWeekPickups + 1,

      acceptanceRate:
        Math.min(
          100,
          prev.acceptanceRate + 1
        ),
    }));

    // Remove accepted job
    setAvailableJobs((prev) =>
      prev.filter((j) => j._id !== job._id)
    );

  } catch (error) {

    console.log(error);

    toast.error(
      "Failed to accept pickup"
    );

  }

};


const updatePickupStatus = async (
  pickupId,
  newStatus
) => {

  try {

    await API.put(
      `/pickups/${pickupId}/status`,
      {
        status: newStatus,
      }
    );

    toast.success(
      `Pickup marked as ${newStatus}`
    );

    // Refresh dashboard
    fetchPendingPickups();

  } catch (error) {

    console.log(error);

    toast.error(
      "Failed to update status"
    );

  }

};


    // Update stats
    // setStats((prev) => ({
    //   ...prev,
    //   todayEarnings: prev.todayEarnings + job.payout,
    //   thisWeekEarnings: prev.thisWeekEarnings + job.payout,
    //   todayPickups: prev.todayPickups + 1,
    //   thisWeekPickups: prev.thisWeekPickups + 1,
    //   acceptanceRate: Math.min(100, prev.acceptanceRate + 1),
    // }));

    // Remove job from dashboard list
  //   setAvailableJobs((prev) => prev.filter((j) => j.id !== job.id));
  // };

  const handleSkipJob = (job) => {
    toast.error(`Pickup skipped.`, {
      icon: "✕",
      style: {
        borderRadius: "12px",
        background: "#060b08",
        color: "#fff",
      },
    });

    setStats((prev) => ({
      ...prev,
      acceptanceRate: Math.max(0, prev.acceptanceRate - 2),
    }));

    // Remove job from dashboard list
    setAvailableJobs((prev) => prev.filter((j) => j._id !== job._id));
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      toast.success("You are now ONLINE", {
        icon: "●",
        style: {
          background: "#044a27",
          color: "#fff",
          borderRadius: "12px",
        },
      });
    } else {
      toast.error("You are now OFFLINE", {
        icon: "○",
        style: {
          background: "#374151",
          color: "#fff",
          borderRadius: "12px",
        },
      });
    }
  };



  const handleStartNavigation = () => {

  if (availableJobs.length === 0) {
    return;
  }

  const firstJob = availableJobs[0];

  const destination =
    `${firstJob.location}, Hyderabad`;

  const googleMapsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;

  window.location.href = googleMapsUrl;

};

  // Calculate route stops summary dynamically
  const activeStopsCount = availableJobs.length + 1; // jobs + depot
  const totalDistanceKm = (availableJobs.reduce((acc, curr) => acc + parseFloat(curr.distance), 0) + 1.8).toFixed(1);
  const totalMinutes = Math.round(availableJobs.length * 12 + 12);

  const fetchPendingPickups = async () => {

  try {

    const response = await API.get(
      "/pickups/pending"
    );

    const jobsWithCoords =
  response.data.pickups.map(
    (job, index) => ({
      ...job,

      coords: {
        x: 80 + index * 70,
        y: 70 + index * 60,
      },
    })
  );

setAvailableJobs(jobsWithCoords);

  } catch (error) {

    console.log(error);

  }

};


  useEffect(() => {

  fetchPendingPickups();

}, []);


  return (
    <CollectorLayout>
      <div className="collector-dashboard">
        
        {/* ================================= */}
        {/* HEADER SECTION */}
        {/* ================================= */}
        <header className="dashboard-header">
          <div className="header-left">
            <span className="header-date">{getFormattedDate()}</span>
            <h1>{getGreeting()}, {firstName}</h1>
            <p className="header-subtext">
              {availableJobs.length > 0
                ? `${availableJobs.length} new pickup${availableJobs.length > 1 ? "s" : ""} within 2.4 km of your location.`
                : "No pending pickups nearby. You are all caught up!"}
            </p>
          </div>

          <div className="header-right">
            <button
              onClick={toggleOnlineStatus}
              className={`status-toggle-btn ${isOnline ? "online" : "offline"}`}
            >
              <span className="status-dot"></span>
              {isOnline ? "Online" : "Offline"}
            </button>
          </div>
        </header>

        {/* ================================= */}
        {/* STATS CARDS GRID */}
        {/* ================================= */}
        <section className="stats-cards-grid">
          <div className="stat-card today">
            <span className="stat-title">TODAY</span>
            <h2 className="stat-value">₹{stats.todayEarnings.toLocaleString()}</h2>
            <p className="stat-subtext">{stats.todayPickups} pickups</p>
          </div>

          <div className="stat-card">
            <span className="stat-title">THIS WEEK</span>
            <h2 className="stat-value">₹{stats.thisWeekEarnings.toLocaleString()}</h2>
            <p className="stat-subtext">{stats.thisWeekPickups} pickups</p>
          </div>

          <div className="stat-card">
            <span className="stat-title">RATING</span>
            <h2 className="stat-value">
              {stats.rating} <span className="star-icon">★</span>
            </h2>
            <p className="stat-subtext">of {stats.ratingCount.toLocaleString()} pickups</p>
          </div>

          <div className="stat-card">
            <span className="stat-title">ACCEPTANCE</span>
            <h2 className="stat-value">{stats.acceptanceRate}%</h2>
            <p className="stat-subtext highlight">Top 5% in city</p>
          </div>
        </section>

        {/* ================================= */}
        {/* MAIN PANEL CONTENT */}
        {/* ================================= */}
        <section className="dashboard-main-content">
          
          {/* COLUMN 1: PICKUPS */}
          <div className="pickups-column">
            <div className="column-header">
              <h3>Available pickups nearby</h3>
              <Link to="/collector/jobs" className="view-all-link">
                VIEW ALL →
              </Link>
            </div>

            <div className="pickups-list">
              {availableJobs.length > 0 ? (
                availableJobs.map((job) => (
                  <div key={job._id} className="pickup-card">
                    <div className="pickup-card-row">
                      <span className="pickup-material">{job.materials?.[0]?.materialType}</span>
                      <span className="pickup-payout">₹{job.totalAmount}</span>
                    </div>

                    <div className="pickup-card-row info-row">
                      <span className="pickup-details">
                        {job.city} &bull; {job.time} &bull; {job.distance}
                      </span>
                      <span className="pickup-weight">~{job.totalWeight}kg</span>
                    </div>

                    <div className="pickup-card-actions">

  {job.status === "Pending" && (

    <button
      onClick={() =>
        handleAcceptJob(job)
      }
      className="btn-accept"
    >
      Accept
    </button>

  )}

  {job.status === "Accepted" && (

    <button
      onClick={() =>
        updatePickupStatus(
          job._id,
          "On The Way"
        )
      }
      className="btn-accept"
    >
      On The Way
    </button>

  )}

  {job.status === "On The Way" && (

    <button
      onClick={() =>
        updatePickupStatus(
          job._id,
          "Completed"
        )
      }
      className="btn-accept"
    >
      Complete
    </button>

  )}

  <button
    onClick={() =>
      handleSkipJob(job)
    }
    className="btn-skip"
  >
    Skip
  </button>

</div>
                  </div>
                ))
              ) : (
                <div className="empty-pickups-card">
                  <div className="empty-icon">🚚</div>
                  <h4>No pickups nearby</h4>
                  <p>Check back later or expand your availability zone.</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2: OPTIMIZED ROUTE */}
          <div className="route-column">
            <div className="column-header">
              <h3>OPTIMIZED ROUTE</h3>
            </div>

            <div className="route-map-card">
              {/* SVG CUSTOM VECTOR MAP */}
              <div className="svg-map-container">
                <svg viewBox="0 0 300 280" className="vector-route-svg">
                  {/* Grid / street line backdrops for realism */}
                  <line x1="0" y1="150" x2="300" y2="150" stroke="rgba(0,0,0,0.03)" strokeWidth="4" />
                  <line x1="150" y1="0" x2="150" y2="280" stroke="rgba(0,0,0,0.03)" strokeWidth="4" />
                  <line x1="0" y1="70" x2="300" y2="70" stroke="rgba(0,0,0,0.02)" strokeWidth="2" />
                  <line x1="0" y1="210" x2="300" y2="210" stroke="rgba(0,0,0,0.02)" strokeWidth="2" />
                  <line x1="70" y1="0" x2="70" y2="280" stroke="rgba(0,0,0,0.02)" strokeWidth="2" />
                  <line x1="230" y1="0" x2="230" y2="280" stroke="rgba(0,0,0,0.02)" strokeWidth="2" />

                  {/* Dotted Route Connections */}
                  {availableJobs.map((job, idx) => {
                    const nextJob = availableJobs[idx + 1] || depotStop;
                    return (
                      <line
                        key={`line-${job._id}`}
                        x1={job.coords.x}
                        y1={job.coords.y}
                        x2={nextJob.x || nextJob.coords?.x}
                        y2={nextJob.y || nextJob.coords?.y}
                        stroke="#00c853"
                        strokeWidth="3.5"
                        strokeDasharray="5 5"
                        className="pulse-route-line"
                      />
                    );
                  })}
                  {availableJobs.length > 0 && (
                    <line
                      x1="150"
                      y1="140"
                      x2={availableJobs[0].coords.x}
                      y2={availableJobs[0].coords.y}
                      stroke="#00c853"
                      strokeWidth="3.5"
                      strokeDasharray="5 5"
                      className="pulse-route-line"
                    />
                  )}

                  {/* Active Job Nodes (stops) */}
                  {availableJobs.map((job) => (
                    <g key={`node-${job._id}`} className="svg-stop-node">
                      <circle
                        cx={job.coords.x}
                        cy={job.coords.y}
                        r="12"
                        fill="rgba(6, 11, 8, 0.15)"
                      />
                      <circle
                        cx={job.coords.x}
                        cy={job.coords.y}
                        r="7"
                        fill="#060b08"
                      />
                      <circle
                        cx={job.coords.x}
                        cy={job.coords.y}
                        r="3"
                        fill="#00c853"
                      />
                    </g>
                  ))}

                  {/* Static Depot Node */}
                  <g className="svg-depot-node">
                    <circle cx={depotStop.x} cy={depotStop.y} r="10" fill="rgba(0, 200, 83, 0.2)" />
                    <circle cx={depotStop.x} cy={depotStop.y} r="6" fill="#00c853" />
                  </g>

                  {/* Center Node (Collector Position) */}
                  <g className="svg-collector-node">
                    {/* Ring Pulse */}
                    <circle
                      cx="150"
                      cy="140"
                      r="16"
                      fill="rgba(0, 200, 83, 0.15)"
                      className="map-radar-pulse"
                    />
                    {/* Outer Target ring */}
                    <circle
                      cx="150"
                      cy="140"
                      r="9"
                      fill="none"
                      stroke="#00c853"
                      strokeWidth="2"
                    />
                    {/* Center Core dot */}
                    <circle
                      cx="150"
                      cy="140"
                      r="4"
                      fill="#00c853"
                    />
                  </g>
                </svg>
              </div>

              {/* Route Summary */}
              <div className="route-details-panel">
                <div className="route-summary-text">
                  <h4>
                    {availableJobs.length > 0
                      ? `${activeStopsCount} stops &bull; ${totalDistanceKm} km`
                      : "Route Empty"}
                  </h4>
                  <p>
                    {availableJobs.length > 0
                      ? `Est. ${totalMinutes} min &bull; Save 14 min vs default`
                      : "No active pickups navigation route."}
                  </p>
                </div>

               <button
  onClick={handleStartNavigation}
  disabled={availableJobs.length === 0}
  className="btn-start-navigation"
>
  Start Route Navigation →
</button>
              </div>
            </div>
          </div>

        </section>

      </div>
    </CollectorLayout>
  );

};


export default CollectorDashboard;