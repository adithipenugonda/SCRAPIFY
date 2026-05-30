import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import UserLayout from "../../layouts/UserLayout";
import { FaPhoneAlt, FaCommentDots } from "react-icons/fa";
import "./TrackPickup.css";

// Helper component to center map dynamically when coordinates change
const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const TrackPickup = () => {
  const [pickups, setPickups] = useState([]);

  const activePickup = pickups.find(pickup => pickup.status !== "Completed" && pickup.status !== "Cancelled");

  const collectorPosition = [
    activePickup?.tracking?.currentLatitude || 17.4474,
    activePickup?.tracking?.currentLongitude || 78.3762,
  ];

  const fetchUserPickups = async () => {
    try {
      const response = await API.get("/pickups/my-pickups");
      setPickups(response.data.pickups);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelPickup = async () => {
    if (!activePickup) return;
    
    // Confirm before cancelling
    if (!window.confirm("Are you sure you want to cancel this pickup?")) return;

    try {
      const response = await API.put(`/pickups/${activePickup._id}/status`, {
        status: "Cancelled"
      });

      if (response.data.success) {
        toast.success("Pickup cancelled successfully.");
        fetchUserPickups(); // Refresh the list to remove the active pickup from the screen
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to cancel pickup");
    }
  };

  useEffect(() => {
    fetchUserPickups();
    const interval = setInterval(fetchUserPickups, 5000);
    return () => clearInterval(interval);
  }, []);

  // Format ID for UI
  const displayId = activePickup ? `SCR-${activePickup._id.slice(-4).toUpperCase()}` : "";
  
  const etaMinutes = activePickup?.tracking?.estimatedTimeMinutes || "--";

  const currentStatus = activePickup?.status || "Pending";
  
  // Determine timeline steps based on status
  const getTimelineSteps = () => {
    const timeFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    const placedTime = activePickup?.createdAt ? timeFormat.format(new Date(activePickup.createdAt)) : "Just now";
    const updateTime = activePickup?.updatedAt ? timeFormat.format(new Date(activePickup.updatedAt)) : "-";

    const isAssigned = currentStatus === "Accepted" || currentStatus === "On The Way";
    const isEnRoute = currentStatus === "On The Way";

    return [
      { label: "Request placed", active: true, time: placedTime },
      { label: "Collector assigned", active: isAssigned, time: isAssigned ? updateTime : "-" },
      { label: "Collector en route", active: isEnRoute, time: isEnRoute ? updateTime : "-", current: isEnRoute },
      { label: "Materials collected", active: false, time: "-" },
      { label: "Payment settled", active: false, time: "-" }
    ];
  };

  const steps = getTimelineSteps();
  
  const totalAmount = activePickup?.totalAmount || 0;
  const totalWeight = activePickup?.totalWeight || 0;
  const materialType = activePickup?.materials?.map(m => m.materialType).join(", ") || "Items pending";

  return (
    <UserLayout>
      <div className="track-page">
        {/* HEADER */}
        <div className="track-header">
          <h1>Track pickup</h1>
          {activePickup ? (
            <p>Pickup #{displayId} • ETA {etaMinutes} {etaMinutes !== "--" ? "minutes" : ""}</p>
          ) : (
            <p>View the live status of your active pickups.</p>
          )}
        </div>

        {activePickup ? (
          <div className="track-grid">
            {/* LEFT AREA: MAP & COLLECTOR INFO */}
            <div className="track-left">
              <div className="track-map-wrapper">
                <div className="map-container-box">
                  <MapContainer
                    center={collectorPosition}
                    zoom={13}
                    scrollWheelZoom={true}
                    className="live-map"
                    zoomControl={false}
                  >
                    <ChangeMapView center={collectorPosition} />
                    <TileLayer
                      attribution='&copy; OpenStreetMap contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {activePickup?.collector && (
                      <Marker position={collectorPosition}>
                        <Popup>Collector is here 🚚</Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>

                {/* COLLECTOR DETAILS */}
                <div className="collector-details-box">
                  <div className="collector-info-left">
                    <div className="collector-avatar">
                      {activePickup?.collector?.name?.substring(0, 2).toUpperCase() || "..."}
                    </div>
                    <div className="collector-text">
                      <h4>{activePickup?.collector?.name || "Assigning Collector..."}</h4>
                      <p>{activePickup?.collector ? "Verified Partner" : "Waiting for a collector to accept"}</p>
                    </div>
                  </div>
                  <div className="collector-actions">
                    <button className="action-btn call-btn"><FaPhoneAlt /></button>
                    <button className="action-btn chat-btn"><FaCommentDots /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT AREA: TIMELINE & PAYOUT */}
            <div className="track-right">
              {/* TIMELINE CARD */}
              <div className="timeline-card">
                <h3>STATUS TIMELINE</h3>
                <div className="timeline-list">
                  {steps.map((step, index) => (
                    <div key={index} className={`timeline-step ${step.active ? 'active' : ''} ${step.current ? 'current' : ''}`}>
                      <div className="step-indicator">
                        <div className="step-dot"></div>
                        {index < steps.length - 1 && <div className="step-line"></div>}
                      </div>
                      <div className="step-content">
                        <h4>{step.label}</h4>
                        <p>{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PAYOUT CARD */}
              <div className="payout-card">
                <span className="payout-label">ESTIMATED PAYOUT</span>
                <div className="payout-amount">₹{totalAmount > 0 ? totalAmount : "---"}</div>
                <div className="payout-details">
                  {totalWeight > 0 ? `${totalWeight} kg` : "Weight pending"} • {materialType}
                </div>
                <button className="cancel-pickup-btn" onClick={handleCancelPickup}>CANCEL PICKUP</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-pickup-state">
            <div className="empty-box">
              <h3>No active pickup</h3>
              <p>You don't have any pickups currently in progress.</p>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default TrackPickup;