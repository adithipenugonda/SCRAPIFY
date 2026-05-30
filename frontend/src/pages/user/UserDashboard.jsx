import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout";
import API from "../../services/api";
import useAuth from "../../hooks/useAuth";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "./UserDashboard.css";

const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [completedPickups, setCompletedPickups] = useState([]);
  const [activePickup, setActivePickup] = useState(null);
  const [scrapRates, setScrapRates] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const [pickupsRes, ratesRes] = await Promise.all([
        API.get("/pickups/my-pickups").catch(() => ({ data: { pickups: [] } })),
        API.get("/scrap-prices").catch(() => ({ data: { data: [] } }))
      ]);
      
      if (pickupsRes.data?.pickups) {
        const completed = pickupsRes.data.pickups.filter(p => p.status === "Completed");
        const active = pickupsRes.data.pickups.find(p => p.status !== "Completed" && p.status !== "Cancelled");
        setCompletedPickups(completed);
        setActivePickup(active);
      }

      if (ratesRes.data?.data) {
        setScrapRates(ratesRes.data.data.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Date formatting
  const today = new Date();
  const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions).toUpperCase();

  // Dynamic Stats calculation
  const totalEarnings = user?.totalEarnings || completedPickups.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const greenPoints = user?.greenPoints || 0;
  const totalWeight = user?.totalRecycledWeight || completedPickups.reduce((acc, curr) => acc + (curr.totalWeight || 0), 0);
  const co2Saved = (totalWeight * 1.2).toFixed(1);
  const treesSaved = (totalWeight * 1.2 / 21).toFixed(1);

  // Current month stats
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentMonthPickups = completedPickups.filter(p => {
    const d = new Date(p.pickupDate || p.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  
  const currentMonthEarnings = currentMonthPickups.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const currentMonthCO2 = (currentMonthPickups.reduce((acc, curr) => acc + (curr.totalWeight || 0), 0) * 1.2).toFixed(1);
  const currentMonthPoints = currentMonthPickups.reduce((acc, curr) => acc + (curr.greenPointsEarned || 0), 0);
  const userLevel = Math.floor(greenPoints / 100) + 1;

  const collectorPosition = activePickup ? [
    activePickup.tracking?.currentLatitude || 17.4474,
    activePickup.tracking?.currentLongitude || 78.3762,
  ] : null;

  return (
    <UserLayout>
      <div className="user-dashboard">
        {/* HEADER */}
        <div className="dash-header-section">
          <div className="dash-header-content">
            <span className="dash-date">{formattedDate}</span>
            <h1>Welcome back, {user?.name?.split(' ')[0] || "User"}</h1>
            <p>Here's what's happening with your recycling today.</p>
          </div>
          <Link to="/schedule-pickup" className="new-pickup-btn">
            + New Pickup
          </Link>
        </div>

        {/* STATS ROW */}
        <div className="dash-stats-row">
          <div className="stat-card green-points-card" style={{ background: '#0ea262', color: 'white' }}>
            <span className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>GREEN POINTS</span>
            <div className="stat-value-group">
              <h2 style={{ color: 'white' }}>{greenPoints.toLocaleString()}</h2>
              {currentMonthPoints > 0 && <span className="growth-pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>+{currentMonthPoints} This Month</span>}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>Level {userLevel} Recycler</p>
          </div>

          <div className="stat-card white-card">
            <span className="stat-label-dark">CO₂ OFFSET</span>
            <div className="stat-value-group">
              <h2 className="dark-val">{co2Saved} kg</h2>
              {currentMonthCO2 > 0 && <span className="growth-text">+{currentMonthCO2}kg This Month</span>}
            </div>
            <p className="dark-sub">≈ {treesSaved} trees saved</p>
          </div>

          <div className="stat-card white-card">
            <span className="stat-label-dark">EARNINGS</span>
            <div className="stat-value-group">
              <h2 className="dark-val">₹{totalEarnings.toLocaleString()}</h2>
              {currentMonthEarnings > 0 && <span className="growth-text">+₹{currentMonthEarnings} This Month</span>}
            </div>
            <p className="dark-sub">Lifetime Earnings</p>
          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="dash-bottom-grid">
          {/* ACTIVE PICKUP CARD */}
          <div className="dash-active-pickup">
            <div className="active-pickup-header">
              <span className="section-label">ACTIVE PICKUP</span>
              {activePickup ? (
                <span className="eta-badge">ETA 4 MIN</span>
              ) : null}
            </div>
            
            {activePickup ? (
              <>
                <h3 className="active-pickup-title">{activePickup.collector?.name || "Collector"} is on the way</h3>
                <div className="dash-map-container">
                  <MapContainer
                    center={collectorPosition}
                    zoom={13}
                    scrollWheelZoom={false}
                    zoomControl={false}
                    className="dash-map"
                  >
                    <ChangeMapView center={collectorPosition} />
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={collectorPosition} />
                  </MapContainer>
                </div>
              </>
            ) : (
              <div className="empty-active-pickup">
                <p>No active pickups right now.<br/>Schedule one to start earning!</p>
              </div>
            )}
          </div>

          {/* TOP RATES CARD */}
          <div className="dash-top-rates">
            <span className="section-label">TODAY'S TOP RATES</span>
            <div className="rates-list">
              {scrapRates.length > 0 ? (
                scrapRates.map((rate, index) => (
                  <div key={index} className="rate-item">
                    <div className="rate-name">
                      <span className="rate-icon">🏷️</span>
                      {rate.item}
                    </div>
                    <div className="rate-price">₹{(rate.price).toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <div className="empty-active-pickup">
                  <p>No live rates available today.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;