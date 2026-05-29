import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Button from "../../components/common/Button";
import API from "../../services/api";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await API.get("/admin/users");
      if (response.data && response.data.users) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (id) => {
    try {
      const response = await API.put(`/admin/toggle-user/${id}`);
      if (response.data && response.data.success) {
        fetchUsers();
      }
    } catch (err) {
      console.error("Error toggling user status:", err);
      alert("Failed to update user block status.");
    }
  };

  return (
    <AdminLayout>
      <div className="manage-users-page">
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="manage-users-header">
          <h1>Manage Users 👥</h1>
          <p>View, manage, and monitor registered platform users.</p>
        </div>

        {/* ================================= */}
        {/* TABLE */}
        {/* ================================= */}
        <div className="users-table-card">
          <div className="users-table-header">
            <h2>Registered Users</h2>
          </div>

          {loading ? (
            <p style={{ padding: "20px", color: "var(--text-light)" }}>Loading users...</p>
          ) : error ? (
            <p style={{ padding: "20px", color: "red" }}>{error}</p>
          ) : (
            <div className="users-table">
              {/* TABLE HEAD */}
              <div className="users-row users-head">
                <span>Name</span>
                <span>Email</span>
                <span>Pickups</span>
                <span>Points</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {/* TABLE BODY */}
              {users && users.length > 0 ? (
                users.map((user) => (
                  <div key={user._id} className="users-row">
                    <span>{user.name}</span>
                    <span>{user.email}</span>
                    <span>{user.pickupHistory?.length || 0}</span>
                    <span>{user.greenPoints || 0}</span>
                    <span
                      className={
                        !user.isBlocked ? "active-status" : "blocked-status"
                      }
                    >
                      {!user.isBlocked ? "Active" : "Blocked"}
                    </span>

                    {/* ACTIONS */}
                    <div className="user-actions">
                      <Button
                        text={user.isBlocked ? "Unblock" : "Block"}
                        variant={user.isBlocked ? "secondary" : "danger"}
                        onClick={() => handleToggleBlock(user._id)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ padding: "20px", color: "var(--text-light)", textAlign: "center" }}>
                  No registered users found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;