import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import CollectorLayout from "../../layouts/CollectorLayout";
import API from "../../services/api";
import "./AvailableJobs.css";

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

const AvailableJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingPickups = async () => {
    try {
      const response = await API.get("/pickups/pending");
      if (response.data && response.data.pickups) {
        setJobs(response.data.pickups);
      }
    } catch (error) {
      console.log("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPickups();
    const interval = setInterval(() => {
      fetchPendingPickups();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAcceptJob = async (job) => {
    try {
      if (String(job._id || job.id).startsWith("mock-")) {
        setJobs((prev) => prev.filter((j) => j.id !== job.id));
        toast.success("Job accepted!");
        return;
      }
      
      await API.put(`/pickups/accept/${job._id}`);
      toast.success(`Job accepted: Pickup at ${job.address}`, {
        icon: "🚚",
        style: {
          borderRadius: "12px",
          background: "#060b08",
          color: "#fff",
        },
      });

      fetchPendingPickups();
    } catch (error) {
      console.log(error);
      toast.error("Failed to accept pickup");
    }
  };

  const handleNavigate = (job) => {
    const destination = `${(typeof job.location === "string" ? job.location : job.address) || job.city}, Hyderabad`;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.location.href = googleMapsUrl;
  };

  const getFormattedDate = () => {
    const date = new Date();
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    const day = date.getDate();
    const monthName = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    return `${dayName}, ${day} ${monthName}`;
  };

  return (
    <CollectorLayout>
      <div className="available-jobs-container">
        
        {/* ================================= */}
        {/* HEADER SECTION */}
        {/* ================================= */}
        <header className="jobs-header">
          <span className="header-date">{getFormattedDate()}</span>
          <h1>Available jobs</h1>
          <p className="header-subtext">
            Accept jobs that fit your route and capacity.
          </p>
        </header>

        {/* ================================= */}
        {/* JOBS GRID */}
        {/* ================================= */}
        <section className="jobs-grid-section">
          {loading && jobs.length === 0 ? (
            <div className="empty-jobs-view">
              <p>Loading available jobs...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <div key={job._id || job.id} className="job-grid-card">
                  <div className="job-card-top">
                    <h3 className="job-material">{job.material || job.materials?.[0]?.materialType || "General Scrap"}</h3>
                    <span className="job-payout">₹{job.payout || job.totalAmount || 0}</span>
                  </div>

                  <div className="job-card-middle">
                    <div className="job-row">
                      <span className="job-label">Address</span>
                      <span className="job-value">{(typeof job.location === "string" ? job.location : job.address) || job.city || "Nearby"}</span>
                    </div>
                    <div className="job-row">
                      <span className="job-label">Weight</span>
                      <span className="job-value">{formatWeight(job.weight || job.totalWeight)}</span>
                    </div>
                    <div className="job-row">
                      <span className="job-label">Time & Dist</span>
                      <span className="job-value highlighted">{job.time || "Now"} • {formatDistance(job.distance || "1.0 km")}</span>
                    </div>
                  </div>

                  <div className="job-card-actions">
                    <button
                      onClick={() => handleAcceptJob(job)}
                      className="btn-accept"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleNavigate(job)}
                      className="btn-navigate"
                    >
                      Navigate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-jobs-view">
              <div className="empty-icon">🎉</div>
              <h3>All caught up!</h3>
              <p>There are no active pickup requests in your area right now.</p>
            </div>
          )}
        </section>

      </div>
    </CollectorLayout>
  );
};

export default AvailableJobs;