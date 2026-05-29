import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import CollectorLayout from "../../layouts/CollectorLayout";
import "./CollectorDashboard.css";
import API from "../../services/api";

const nodeCoords = [
  { x: 80, y: 80 },
  { x: 230, y: 95 },
  { x: 95, y: 205 }
];

const mockJobs = [
  {
    _id: "mock-1",
    material: "Paper + Plastic",
    payout: 145,
    location: "HSR Sector 2",
    time: "Now",
    distance: "1.2 km",
    weight: "~9kg",
    coords: nodeCoords[0],
    status: "Pending"
  },
  {
    _id: "mock-2",
    material: "E-Waste",
    payout: 332,
    location: "Koramangala 5th Block",
    time: "Now",
    distance: "2.4 km",
    weight: "~3.5kg",
    coords: nodeCoords[1],
    status: "Pending"
  },
  {
    _id: "mock-3",
    material: "Iron Scrap",
    payout: 616,
    location: "BTM Layout",
    time: "30 min",
    distance: "0.8 km",
    weight: "~22kg",
    coords: nodeCoords[2],
    status: "Pending"
  }
];

const formatWeight = (weight) => {
  if (!weight) return "";
  let w = String(weight);
  if (!w.startsWith("~")) w = "~" + w;
  if (!w.endsWith("kg") && !w.endsWith("kg ")) w = w + "kg";
  return w;
};

const formatDistance = (distance) => {
  if (!distance) return "";
  let d = String(distance);
  if (!d.endsWith("km") && !d.endsWith("km ")) d = d + " km";
  return d;
};

const CollectorDashboard = () => {
  const { user } = useAuthContext();

  // Status toggle
  const [isOnline, setIsOnline] = useState(true);

  // Stats state (for dynamic updates when accepting jobs)
  const [stats, setStats] = useState({
    todayEarnings: 0,
    todayPickups: 0,
    thisWeekEarnings: 0,
    thisWeekPickups: 0,
    rating: 5.0,
    ratingCount: 0,
    acceptanceRate: 100,
  });

  // Jobs state (each job maps to an SVG node in the optimized route visualizer)
  const [availableJobs, setAvailableJobs] = useState(mockJobs);

  // Static depot stop
  const depotStop = { x: 215, y: 210, label: "Depot" };

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
      const jobIdStr = String(job._id || job.id);
      if (jobIdStr.startsWith("mock-")) {
        toast.success("Pickup accepted!");
        setStats((prev) => ({
          ...prev,
          todayEarnings: prev.todayEarnings + (job.payout || 0),
          thisWeekEarnings: prev.thisWeekEarnings + (job.payout || 0),
          todayPickups: prev.todayPickups + 1,
          thisWeekPickups: prev.thisWeekPickups + 1,
          acceptanceRate: Math.min(100, prev.acceptanceRate + 1),
        }));
        setAvailableJobs((prev) => prev.filter((j) => String(j._id || j.id) !== jobIdStr));
        return;
      }

      await API.put(`/pickups/accept/${job._id}`);
      toast.success("Pickup accepted!");

      // Update stats
      setStats((prev) => ({
        ...prev,
        todayEarnings: prev.todayEarnings + (job.totalAmount || 0),
        thisWeekEarnings: prev.thisWeekEarnings + (job.totalAmount || 0),
        todayPickups: prev.todayPickups + 1,
        thisWeekPickups: prev.thisWeekPickups + 1,
        acceptanceRate: Math.min(100, prev.acceptanceRate + 1),
      }));

      // Refresh dashboard immediately
      fetchPendingPickups();
    } catch (error) {
      console.log(error);
      toast.error("Failed to accept pickup");
    }
  };

  const updateLiveLocation = (pickupId) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await API.put(
            `/pickups/${pickupId}/location`,
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
    );
  };

  const updatePickupStatus = async (pickupId, newStatus) => {
    try {
      if (String(pickupId).startsWith("mock-")) {
        toast.success(`Pickup marked as ${newStatus}`);
        setAvailableJobs((prev) =>
          prev.map((j) =>
            String(j._id || j.id) === String(pickupId) ? { ...j, status: newStatus } : j
          )
        );
        return;
      }

      await API.put(
        `/pickups/${pickupId}/status`,
        {
          status: newStatus,
        }
      );

      toast.success(`Pickup marked as ${newStatus}`);
      updateLiveLocation(pickupId);

      // Refresh dashboard
      fetchPendingPickups();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  const handleSkipJob = (job) => {
    toast.error("Pickup skipped.", {
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
    const jobIdStr = String(job._id || job.id);
    setAvailableJobs((prev) => prev.filter((j) => String(j._id || j.id) !== jobIdStr));
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
    const destination = `${(typeof firstJob.location === "string" ? firstJob.location : firstJob.address) || firstJob.city}, Hyderabad`;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.location.href = googleMapsUrl;
  };

  // Calculate route stops summary dynamically
  const activeStopsCount = availableJobs.length > 0 ? Math.min(4, availableJobs.length + 1) : 0;
  const totalDistanceKm = availableJobs.length > 0 
    ? (availableJobs.reduce((acc, curr) => acc + parseFloat(curr.distance || 0), 0) + 1.8).toFixed(1)
    : "0.0";
  const totalMinutes = Math.round(availableJobs.length * 12 + 12);

  const fetchPendingPickups = async () => {
    try {
      const response = await API.get("/pickups/pending");
      if (response.data && response.data.pickups && response.data.pickups.length > 0) {
        const jobsWithCoords = response.data.pickups.map((job, index) => ({
          ...job,
          coords: nodeCoords[index % nodeCoords.length],
        }));
        setAvailableJobs(jobsWithCoords);
      } else {
        setAvailableJobs(mockJobs);
      }
    } catch (error) {
      console.log(error);
      setAvailableJobs(mockJobs);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await API.get("/collector/dashboard");
      if (response.data && response.data.success) {
        const { stats } = response.data.dashboard;
        setStats((prev) => ({
          ...prev,
          todayEarnings: stats.totalEarnings || 0,
          todayPickups: stats.completedPickups || 0,
          thisWeekEarnings: stats.monthlyEarnings || 0,
          thisWeekPickups: stats.completedPickups || 0,
          rating: stats.rating || 5.0,
        }));
      }
    } catch (error) {
      console.log("Failed to fetch dashboard stats", error);
    }
  };

  useEffect(() => {
    fetchPendingPickups();
    fetchDashboardStats();

    const interval = setInterval(() => {
      fetchPendingPickups();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Periodic live location tracking when there is a database pickup "On The Way"
  useEffect(() => {
    const activeJob = availableJobs.find(
      (job) => job.status === "On The Way" && !String(job._id || job.id).startsWith("mock-")
    );

    if (!activeJob) return;

    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              await API.put(
                `/pickups/${activeJob._id}/location`,
                {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                }
              );
            } catch (error) {
              console.error("Failed to update collector live location:", error);
            }
          },
          (error) => {
            console.error("Error fetching geolocation:", error);
          },
          { enableHighAccuracy: true }
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [availableJobs]);


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
          <div className="pickups-container-card">
            <div className="column-header">
              <h3>Available pickups nearby</h3>
              <Link to="/collector/jobs" className="view-all-link">
                VIEW ALL →
              </Link>
            </div>

            <div className="pickups-list">
              {availableJobs.slice(0, 3).length > 0 ? (
                availableJobs.slice(0, 3).map((job) => (
                  <div key={job._id || job.id} className="pickup-card">
                    <div className="pickup-card-row">
                      <span className="pickup-material">{job.material || job.materials?.[0]?.materialType || "General Scrap"}</span>
                      <span className="pickup-payout">₹{job.payout || job.totalAmount || 0}</span>
                    </div>

                    <div className="pickup-card-row info-row">
                      <span className="pickup-details">
                        {(typeof job.location === "string" ? job.location : job.address) || job.city || "Nearby"} &bull; {job.time || "Now"} &bull; {formatDistance(job.distance || "1.0 km")}
                      </span>
                      <span className="pickup-weight">{formatWeight(job.weight || job.totalWeight)}</span>
                    </div>

                    <div className="pickup-card-actions">
                      {(job.status === "Pending" || !job.status) && (
                        <button
                          onClick={() => handleAcceptJob(job)}
                          className="btn-accept"
                        >
                          Accept
                        </button>
                      )}

                      {job.status === "Accepted" && (
                        <button
                          onClick={() => updatePickupStatus(job._id || job.id, "On The Way")}
                          className="btn-accept"
                        >
                          On The Way
                        </button>
                      )}

                      {job.status === "On The Way" && (
                        <button
                          onClick={() => updatePickupStatus(job._id || job.id, "Completed")}
                          className="btn-accept"
                        >
                          Complete
                        </button>
                      )}

                      <button
                        onClick={() => handleSkipJob(job)}
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

          {/* COLUMN 2: OPTIMIZED ROUTE & TARGETS */}
          <div className="route-column">
            <div className="route-map-card">
              <div className="column-header">
                <h3>OPTIMIZED ROUTE</h3>
              </div>

              {/* SVG CUSTOM VECTOR MAP CANVAS */}
              <div className="route-map-canvas">
                <svg viewBox="0 0 300 240" className="vector-route-svg">
                  {/* Dotted Star Connections from center (150, 120) */}
                  {availableJobs.slice(0, 3).map((job) => (
                    <line
                      key={`line-${job._id || job.id}`}
                      x1="150"
                      y1="120"
                      x2={job.coords?.x || 150}
                      y2={job.coords?.y || 120}
                      stroke="#00c853"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      className="pulse-route-line"
                    />
                  ))}
                  
                  {/* Connection to Depot */}
                  {availableJobs.length > 0 && (
                    <line
                      x1="150"
                      y1="120"
                      x2={depotStop.x}
                      y2={depotStop.y}
                      stroke="#00c853"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      className="pulse-route-line"
                    />
                  )}

                  {/* Outer Stops (Jobs) */}
                  {availableJobs.slice(0, 3).map((job) => (
                    <circle
                      key={`node-${job._id || job.id}`}
                      cx={job.coords?.x || 150}
                      cy={job.coords?.y || 120}
                      r="6.5"
                      fill="#050807"
                      className="svg-stop-node"
                    />
                  ))}

                  {/* Depot Stop */}
                  {availableJobs.length > 0 && (
                    <circle
                      cx={depotStop.x}
                      cy={depotStop.y}
                      r="6.5"
                      fill="#050807"
                    />
                  )}

                  {/* Center Node (Collector Position) */}
                  <g className="svg-collector-node">
                    {/* Pulsing radar rings */}
                    <circle
                      cx="150"
                      cy="120"
                      r="14"
                      fill="rgba(0, 200, 83, 0.12)"
                      className="map-radar-pulse"
                    />
                    <circle
                      cx="150"
                      cy="120"
                      r="9"
                      fill="#00c853"
                    />
                    {/* White cross lines inside the green circle */}
                    <line x1="146.5" y1="116.5" x2="153.5" y2="123.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="153.5" y1="116.5" x2="146.5" y2="123.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                  </g>
                </svg>
              </div>

              {/* Route Summary */}
              <div className="route-summary-text">
                <h4>
                  {availableJobs.length > 0
                    ? `${activeStopsCount} stops • ${totalDistanceKm} km`
                    : "Route Empty"}
                </h4>
                <p>
                  {availableJobs.length > 0
                    ? `Est. ${totalMinutes} min • Save 14 min vs default`
                    : "No active pickups navigation route."}
                </p>
              </div>
            </div>

            {/* WEEKLY TARGET PANEL */}
            <div className="weekly-target-card">
              <span className="target-title">WEEKLY TARGET</span>
              <h2 className="target-value">₹{stats.thisWeekEarnings.toLocaleString()} / ₹12,000</h2>
              <div className="target-progress-bar">
                <div
                  className="target-progress-fill"
                  style={{ width: `${Math.min(100, (stats.thisWeekEarnings / 12000) * 100)}%` }}
                ></div>
              </div>
              <p className="target-subtext">
                ₹{Math.max(0, 12000 - stats.thisWeekEarnings).toLocaleString()} to bonus tier
              </p>
            </div>
          </div>

        </section>

      </div>
    </CollectorLayout>
  );
};

export default CollectorDashboard;