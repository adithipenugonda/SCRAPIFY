import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import useAuth from "../../hooks/useAuth";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ==========================================
  // STATES
  // ==========================================
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
  // HANDLE ROLE SHORTCUTS PREFILL
  // ==========================================
  const handleRolePrefill = (role) => {
    if (role === "user") {
      setFormData({
        email: "user@scrapify.com",
        password: "password123",
      });
    } else if (role === "collector") {
      setFormData({
        email: "collector@scrapify.com",
        password: "password123",
      });
    } else if (role === "admin") {
      setFormData({
        email: "admin@scrapify.com",
        password: "password123",
      });
    }
  };

  // ==========================================
  // HANDLE SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      if (result.role === "collector") {
        navigate("/collector/dashboard");
      } else if (result.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
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
            <div className="auth-card">
              <span className="auth-tag">Sign In</span>
              <h2>Welcome back</h2>
              <p className="auth-subtitle">
                New here? <Link to="/register">Create an account</Link>
              </p>

              {/* ERROR DISPLAY */}
              {error && <div className="auth-error">{error}</div>}

              {/* FORM */}
              <form onSubmit={handleSubmit}>
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

                {/* PASSWORD */}
                <div className="auth-input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* OPTIONS CHECKBOX & FORGOT LINK */}
                <div className="auth-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    Remember me
                  </label>
                  <Link to="#" onClick={() => alert("Password reset functionality is under maintenance.")} className="forgot-link">
                    Forgot?
                  </Link>
                </div>

                {/* LOGIN BUTTON */}
                <button type="submit" className="auth-submit-btn">
                  Log in &rarr;
                </button>
              </form>

              {/* OR CONTINUE AS SHORTCUTS */}
              <div className="auth-divider">Or continue as</div>
              <div className="auth-shortcuts">
                <button 
                  type="button" 
                  onClick={() => handleRolePrefill("user")} 
                  className="shortcut-btn"
                >
                  User
                </button>
                <button 
                  type="button" 
                  onClick={() => handleRolePrefill("collector")} 
                  className="shortcut-btn"
                >
                  Collector
                </button>
                <button 
                  type="button" 
                  onClick={() => handleRolePrefill("admin")} 
                  className="shortcut-btn"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;