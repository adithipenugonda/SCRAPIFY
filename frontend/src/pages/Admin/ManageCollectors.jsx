import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Button from "../../components/common/Button";
import API from "../../services/api";
import "./ManageCollectors.css";

const ManageCollectors = () => {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCollectors = async () => {
    try {
      const response = await API.get("/admin/collectors");
      if (response.data && response.data.collectors) {
        setCollectors(response.data.collectors);
      }
    } catch (err) {
      console.error("Error fetching collectors:", err);
      setError("Failed to load collectors from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  const handleToggleBlock = async (id) => {
    try {
      const response = await API.put(`/admin/toggle-collector/${id}`);
      if (response.data && response.data.success) {
        fetchCollectors();
      }
    } catch (err) {
      console.error("Error toggling collector status:", err);
      alert("Failed to update collector block status.");
    }
  };

  return (
    <AdminLayout>
      <div className="manage-collectors-page">
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="manage-collectors-header">
          <h1>Manage Collectors 🚚</h1>
          <p>Monitor collector activity, earnings, and pickup performance.</p>
        </div>

        {/* ================================= */}
        {/* TABLE CARD */}
        {/* ================================= */}
        <div className="collectors-table-card">
          <div className="collectors-table-header">
            <h2>Registered Collectors</h2>
          </div>

          {loading ? (
            <p style={{ padding: "20px", color: "var(--text-light)" }}>Loading collectors...</p>
          ) : error ? (
            <p style={{ padding: "20px", color: "red" }}>{error}</p>
          ) : (
            <div className="collectors-table">
              {/* TABLE HEAD */}
              <div className="collectors-row collectors-head">
                <span>Name</span>
                <span>Email</span>
                <span>Jobs Completed</span>
                <span>Earnings</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {/* TABLE BODY */}
              {collectors && collectors.length > 0 ? (
                collectors.map((collector) => (
                  <div key={collector._id} className="collectors-row">
                    <span>{collector.name}</span>
                    <span>{collector.email}</span>
                    <span>{collector.completedPickups || 0}</span>
                    <span>₹{(collector.totalEarnings || 0).toLocaleString()}</span>
                    <span
                      className={
                        !collector.isBlocked ? "active-status" : "inactive-status"
                      }
                    >
                      {!collector.isBlocked ? "Active" : "Blocked"}
                    </span>

                    {/* ACTIONS */}
                    <div className="collector-actions">
                      <Button
                        text={collector.isBlocked ? "Unblock" : "Block"}
                        variant={collector.isBlocked ? "secondary" : "danger"}
                        onClick={() => handleToggleBlock(collector._id)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ padding: "20px", color: "var(--text-light)", textAlign: "center" }}>
                  No registered collectors found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageCollectors;