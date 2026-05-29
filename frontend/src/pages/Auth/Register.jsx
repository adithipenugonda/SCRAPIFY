import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import useAuth from "../../hooks/useAuth";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // ==========================================
  // STATES
  // ==========================================
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // HANDLE CHANGE
  // ==========================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // HANDLE SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await register(formData);

    if (result.success) {
      if (result.role === "collector") {
        navigate("/collector/dashboard");
      } else if (result.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />

      <div className="auth-page">
        <div className="auth-container">
          {/* ================================= */}
          {/* LEFT PANEL */}
          {/* ================================= */}
          <div className="auth-left">
            <div className="auth-left-logo">
              ♻️ SCRAPIFY
            </div>

            <div className="auth-left-body">
              <h1>
                Recycling that pays<br />
                you back<span>.</span>
              </h1>
              <p>
                Join the platform turning everyday household waste into
                wealth — one pickup at a time.
              </p>
            </div>

            <div className="auth-left-footer">
              © 2026 SCRAPIFY • WASTE → WEALTH
            </div>
          </div>

          {/* ================================= */}
          {/* RIGHT PANEL */}
          {/* ================================= */}
          <div className="auth-right">
            <div className="auth-card" style={{ margin: "20px 0" }}>
              <span className="auth-tag">Sign Up</span>
              <h2>Create Account</h2>
              <p className="auth-subtitle">
                Already have an account? <Link to="/login">Log in</Link>
              </p>

              {/* ERROR DISPLAY */}
              {error && <div className="auth-error">{error}</div>}

              {/* FORM */}
              <form onSubmit={handleSubmit}>
                {/* NAME */}
                <div className="auth-input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className="auth-input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* PHONE */}
                <div className="auth-input-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div className="auth-input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* ADDRESS */}
                <div className="auth-input-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {/* CITY */}
                <div className="auth-input-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                {/* STATE */}
                <div className="auth-input-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>

                {/* PINCODE */}
                <div className="auth-input-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Enter pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>

                {/* ROLE */}
                <div className="auth-input-group">
                  <label>Select Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="user">User</option>
                    <option value="collector">Collector</option>
                  </select>
                </div>

                {/* REGISTER BUTTON */}
                <button type="submit" className="auth-submit-btn">
                  Create Account &rarr;
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;