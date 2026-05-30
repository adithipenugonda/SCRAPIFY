import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import UserLayout from "../../layouts/UserLayout";
import { useAuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import { FaCamera, FaGift, FaWeightHanging, FaTruck } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import "./UserProfile.css";

const UserProfile = () => {
  const { user, loadUser } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const fileInputRef = useRef(null);
  
  // Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    pincode: user?.pincode || "",
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("profileImage", file);

    try {
      const response = await API.put("/users/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success("Profile picture updated!");
        await loadUser();
      }
    } catch (error) {
      toast.error("Failed to upload profile picture");
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <UserLayout>
      <div className="profile-page">
        <div className="profile-header">
          <h1>User Profile</h1>
          <p>Manage your account details and track your eco-impact</p>
        </div>

        <div className="profile-content">
          {/* LEFT: INFO */}
          <div className="profile-card">
            <div className="profile-avatar-large">
              {user?.profileImage ? (
                <img src={user.profileImage.startsWith('http') ? user.profileImage : `${import.meta.env.VITE_API_URL.replace('/api', '')}${user.profileImage}`} alt="Profile" />
              ) : (
                <span>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
              )}
              <button className="avatar-edit-btn" onClick={triggerFileInput} title="Upload Picture">
                <FaCamera />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
            
            <div className="profile-details">
              <h2>{user?.name}</h2>
              <p className="profile-role">Registered User</p>
              
              <div className="profile-info-grid">
                <div className="info-group">
                  <label>Email</label>
                  <p>{user?.email}</p>
                </div>
                <div className="info-group">
                  <label>Phone</label>
                  <p>{user?.phone || "Not provided"}</p>
                </div>
                <div className="info-group">
                  <label>Address</label>
                  <p>{user?.address || "Not provided"}</p>
                </div>
                <div className="info-group">
                  <label>City & State</label>
                  <p>{[user?.city, user?.state].filter(Boolean).join(", ") || "Not provided"}</p>
                </div>
                <div className="info-group">
                  <label>Pincode</label>
                  <p>{user?.pincode || "Not provided"}</p>
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
            <h3>Your Impact</h3>
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-icon"><FaGift /></span>
                <span className="stat-val">{user?.greenPoints || 0}</span>
                <span className="stat-label">Green Points</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon"><FaIndianRupeeSign /></span>
                <span className="stat-val">₹{user?.totalEarnings || 0}</span>
                <span className="stat-label">Total Earnings</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon"><FaWeightHanging /></span>
                <span className="stat-val">{user?.totalRecycledWeight || 0} kg</span>
                <span className="stat-label">Recycled Weight</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon"><FaTruck /></span>
                <span className="stat-val">{user?.pickupHistory?.length || 0}</span>
                <span className="stat-label">Total Pickups</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="modal-overlay" onClick={() => setIsEditing(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>Edit Profile</h3>
              <form onSubmit={submitProfileUpdate}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleProfileChange} required />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleProfileChange} required />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleProfileChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleProfileChange} />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleProfileChange} />
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleProfileChange} />
                  </div>
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
          <div className="modal-overlay" onClick={() => setIsChangingPassword(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
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
    </UserLayout>
  );
};

export default UserProfile;
