import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import UserLayout from "../../layouts/UserLayout";
import { useAuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCity, 
  FaMapPin, 
  FaCamera, 
  FaEdit, 
  FaKey,
  FaGift,
  FaRupeeSign,
  FaWeightHanging,
  FaTruck
} from "react-icons/fa";
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
      <div className="premium-profile-page">
        {/* HERO BANNER SECTION */}
        <div className="profile-hero">
          <div className="hero-banner"></div>
          
          <div className="hero-content">
            <div className="hero-avatar-wrapper">
              <div className="hero-avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" />
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
            </div>

            <div className="hero-info">
              <div className="hero-title-group">
                <h1>{user?.name || "User"}</h1>
                <span className="role-badge">{user?.role || "User"}</span>
              </div>
              <p className="hero-email"><FaEnvelope className="inline-icon" /> {user?.email}</p>
            </div>

            <div className="hero-actions">
              <button className="neo-btn primary" onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
              <button className="neo-btn secondary" onClick={() => setIsChangingPassword(true)}>
                <FaKey /> Change Password
              </button>
            </div>
          </div>
        </div>

        <div className="premium-profile-grid">
          {/* LEFT: INFO CARDS */}
          <div className="profile-details-column">
            <div className="glass-card info-card">
              <h3>Contact Details</h3>
              <div className="info-list">
                <div className="info-item">
                  <div className="info-icon"><FaPhone /></div>
                  <div className="info-text">
                    <label>Phone Number</label>
                    <p>{user?.phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><FaEnvelope /></div>
                  <div className="info-text">
                    <label>Email Address</label>
                    <p>{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card info-card">
              <h3>Location Details</h3>
              <div className="info-list">
                <div className="info-item">
                  <div className="info-icon"><FaMapMarkerAlt /></div>
                  <div className="info-text">
                    <label>Address</label>
                    <p>{user?.address || "Not provided"}</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><FaCity /></div>
                  <div className="info-text">
                    <label>City & State</label>
                    <p>{[user?.city, user?.state].filter(Boolean).join(", ") || "Not provided"}</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><FaMapPin /></div>
                  <div className="info-text">
                    <label>Pincode</label>
                    <p>{user?.pincode || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: STATS GRID */}
          <div className="profile-stats-column">
            <div className="stats-2x2">
              <div className="glass-card stat-card neo-hover">
                <div className="stat-icon-wrapper green">
                  <FaGift />
                </div>
                <div className="stat-data">
                  <p className="stat-label">Green Points</p>
                  <h4 className="stat-value">{user?.greenPoints || 0}</h4>
                </div>
              </div>

              <div className="glass-card stat-card neo-hover">
                <div className="stat-icon-wrapper blue">
                  <FaRupeeSign />
                </div>
                <div className="stat-data">
                  <p className="stat-label">Total Earnings</p>
                  <h4 className="stat-value">₹{user?.totalEarnings || 0}</h4>
                </div>
              </div>

              <div className="glass-card stat-card neo-hover">
                <div className="stat-icon-wrapper orange">
                  <FaWeightHanging />
                </div>
                <div className="stat-data">
                  <p className="stat-label">Recycled Weight</p>
                  <h4 className="stat-value">{user?.totalRecycledWeight || 0} kg</h4>
                </div>
              </div>

              <div className="glass-card stat-card neo-hover">
                <div className="stat-icon-wrapper purple">
                  <FaTruck />
                </div>
                <div className="stat-data">
                  <p className="stat-label">Total Pickups</p>
                  <h4 className="stat-value">{user?.pickupHistory?.length || 0}</h4>
                </div>
              </div>

              <div className="glass-card stat-card neo-hover" style={{ gridColumn: "span 2" }}>
                <div className="stat-icon-wrapper" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
                  <FaIndianRupeeSign />
                </div>
                <div className="stat-data">
                  <p className="stat-label">Total Paid</p>
                  <h4 className="stat-value">₹{user?.totalPaid || 0}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {isEditing && (
          <div className="neo-modal-overlay" onClick={() => setIsEditing(false)}>
            <div className="neo-modal-content" onClick={e => e.stopPropagation()}>
              <div className="neo-modal-header">
                <h3>Edit Profile</h3>
                <button className="neo-close-btn" onClick={() => setIsEditing(false)}>&times;</button>
              </div>
              <form onSubmit={submitProfileUpdate} className="neo-form">
                <div className="neo-form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleProfileChange} required className="neo-input" />
                </div>
                <div className="neo-form-group">
                  <label>Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleProfileChange} required className="neo-input" />
                </div>
                <div className="neo-form-group">
                  <label>Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleProfileChange} className="neo-input" />
                </div>
                <div className="neo-form-row">
                  <div className="neo-form-group">
                    <label>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleProfileChange} className="neo-input" />
                  </div>
                  <div className="neo-form-group">
                    <label>State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleProfileChange} className="neo-input" />
                  </div>
                  <div className="neo-form-group">
                    <label>Pincode</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleProfileChange} className="neo-input" />
                  </div>
                </div>
                <div className="neo-modal-actions">
                  <button type="button" className="neo-btn secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button type="submit" className="neo-btn primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isChangingPassword && (
          <div className="neo-modal-overlay" onClick={() => setIsChangingPassword(false)}>
            <div className="neo-modal-content" onClick={e => e.stopPropagation()}>
              <div className="neo-modal-header">
                <h3>Change Password</h3>
                <button className="neo-close-btn" onClick={() => setIsChangingPassword(false)}>&times;</button>
              </div>
              <form onSubmit={submitPasswordUpdate} className="neo-form">
                <div className="neo-form-group">
                  <label>Current Password</label>
                  <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required className="neo-input" />
                </div>
                <div className="neo-form-group">
                  <label>New Password</label>
                  <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required minLength="6" className="neo-input" />
                </div>
                <div className="neo-form-group">
                  <label>Confirm New Password</label>
                  <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required minLength="6" className="neo-input" />
                </div>
                <div className="neo-modal-actions">
                  <button type="button" className="neo-btn secondary" onClick={() => setIsChangingPassword(false)}>Cancel</button>
                  <button type="submit" className="neo-btn primary">Update Password</button>
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
