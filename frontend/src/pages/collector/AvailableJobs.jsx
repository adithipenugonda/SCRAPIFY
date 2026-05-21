import React, { useState } from "react";
import toast from "react-hot-toast";
import CollectorLayout from "../../layouts/CollectorLayout";
import "./AvailableJobs.css";

const AvailableJobs = () => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      material: "Paper + Plastic",
      payout: "145",
      address: "HSR Sector 2",
      weight: "9kg",
      timeDistance: "Now • 1.2 km",
    },
    {
      id: 2,
      material: "E-Waste",
      payout: "332",
      address: "Koramangala 5th Block",
      weight: "3.5kg",
      timeDistance: "Now • 2.4 km",
    },
    {
      id: 3,
      material: "Iron Scrap",
      payout: "616",
      address: "BTM Layout",
      weight: "22kg",
      timeDistance: "30 min • 0.8 km",
    },
    {
      id: 4,
      material: "Paper + Plastic",
      payout: "145",
      address: "HSR Sector 2",
      weight: "9kg",
      timeDistance: "Now • 1.2 km",
    },
    {
      id: 5,
      material: "E-Waste",
      payout: "332",
      address: "Koramangala 5th Block",
      weight: "3.5kg",
      timeDistance: "Now • 2.4 km",
    },
    {
      id: 6,
      material: "Iron Scrap",
      payout: "616",
      address: "BTM Layout",
      weight: "22kg",
      timeDistance: "30 min • 0.8 km",
    },
  ]);

  const handleAcceptJob = (job) => {
    toast.success(`Job accepted: Pickup at ${job.address}`, {
      icon: "🚚",
      style: {
        borderRadius: "12px",
        background: "#060b08",
        color: "#fff",
      },
    });

    setJobs((prev) => prev.filter((j) => j.id !== job.id));
  };

  const handleNavigate = (job) => {
    toast.success(`Opening directions to ${job.address}...`, {
      icon: "📍",
      style: {
        borderRadius: "12px",
        background: "#060b08",
        color: "#fff",
      },
    });
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
          {jobs.length > 0 ? (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <div key={job.id} className="job-grid-card">
                  <div className="job-card-top">
                    <h3 className="job-material">{job.material}</h3>
                    <span className="job-payout">₹{job.payout}</span>
                  </div>

                  <div className="job-card-middle">
                    <div className="job-row">
                      <span className="job-label">Address</span>
                      <span className="job-value">{job.address}</span>
                    </div>
                    <div className="job-row">
                      <span className="job-label">Weight</span>
                      <span className="job-value">{job.weight}</span>
                    </div>
                    <div className="job-row">
                      <span className="job-label">Time & Dist</span>
                      <span className="job-value highlighted">{job.timeDistance}</span>
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