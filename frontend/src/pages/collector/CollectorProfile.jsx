import React, { useState } from "react";
import toast from "react-hot-toast";
import CollectorLayout from "../../layouts/CollectorLayout";
import { useAuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import "./CollectorProfile.css";

const CollectorProfile = () => {
  const { user, loadUser } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    vehicleType: user?.vehicleType || "Bike",
    vehicleNumber: user?.vehicleNumber || "",
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const submitProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put("/users/profile", formData);
      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        await loadUser();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const submitPasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    try {
      const response = await API.put("/users/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (response.data.success) {
        toast.success("Password changed successfully!");
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <CollectorLayout>
      <div className="profile-page">
        <div className="profile-header">
          <h1>Collector Profile</h1>
          <p>Manage your professional details and vehicle information</p>
        </div>

        <div className="profile-content">
          {/* LEFT: INFO */}
          <div className="profile-card">
            <div className="profile-avatar-large">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" />
              ) : (
                <span>{user?.name?.charAt(0)?.toUpperCase() || "C"}</span>
              )}
            </div>
            
            <div className="profile-details">
              <h2>{user?.name}</h2>
              <p className="profile-role">Status: <span className={user?.availabilityStatus === 'Online' ? 'text-success' : ''}>{user?.availabilityStatus || 'Offline'}</span></p>
              
              <div className="profile-info-grid">
                <div className="info-group">
                  <label>Email</label>
                  <p>{user?.email}</p>
                </div>
                <div className="info-group">
                  <label>Phone</label>
                  <p>{user?.phone || "N/A"}</p>
                </div>
                <div className="info-group">
                  <label>Vehicle Type</label>
                  <p>{user?.vehicleType || "N/A"}</p>
                </div>
                <div className="info-group">
                  <label>Vehicle Number</label>
                  <p>{user?.vehicleNumber || "N/A"}</p>
                </div>
              </div>

              <div className="profile-actions">
                <button className="btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                <button className="btn-secondary" onClick={() => setIsChangingPassword(true)}>Change Password</button>
              </div>
            </div>
          </div>

          {/* RIGHT: STATS */}
          <div className="profile-stats-card">
            <h3>Your Performance</h3>
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-icon">⭐</span>
                <span className="stat-val">{user?.rating ? user.rating.toFixed(1) : "5.0"}</span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon">🚚</span>
                <span className="stat-val">{user?.completedPickups || 0}</span>
                <span className="stat-label">Completed Pickups</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon">💰</span>
                <span className="stat-val">₹{user?.monthlyEarnings || 0}</span>
                <span className="stat-label">Monthly Earnings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Edit Profile</h3>
              <form onSubmit={submitProfileUpdate}>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleProfileChange} required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleProfileChange} required />
                </div>
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <select name="vehicleType" value={formData.vehicleType} onChange={handleProfileChange} className="form-select">
                    <option value="Bicycle">Bicycle</option>
                    <option value="Bike">Bike</option>
                    <option value="Auto">Auto</option>
                    <option value="Mini Truck">Mini Truck</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Vehicle Number</label>
                  <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleProfileChange} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {isChangingPassword && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Change Password</h3>
              <form onSubmit={submitPasswordUpdate}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required minLength="6" />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required minLength="6" />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setIsChangingPassword(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Update Password</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CollectorLayout>
  );
};

export default CollectorProfile;
