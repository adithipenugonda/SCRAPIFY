import React from "react";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";


import useAuth from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa6";

import "./Navbar.css";


const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();


  // ==========================================
  // HANDLE LOGOUT
  // ==========================================
  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  // const isDashboardPage =
  // location.pathname.includes("/dashboard") ||
  // location.pathname.includes("/collector") ||
  // location.pathname.includes("/admin");


  return (
    <nav className="navbar">

      <div className="container navbar-container">

        {/* ================================= */}
        {/* LOGO */}
        {/* ================================= */}

        <Link
          to="/"
          className="navbar-logo"
        >
          ♻️ Scrapify
        </Link>


        {/* ================================= */}
{/* NAV LINKS */}
{/* ================================= */}

<div className="navbar-links">

  <a href="/#how-it-works">
    How It Works
  </a>

  <a href="/#live-rates">
    Live Rates
  </a>

  <a href="/#impact">
    Impact
  </a>

</div>


        {/* ================================= */}
        {/* AUTH BUTTONS */}
        {/* ================================= */}

        <div className="navbar-auth">

          <button 
            className="theme-toggle-btn neo-btn-tactile" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <FaMoon className="theme-icon moon" /> : <FaSun className="theme-icon sun" />}
          </button>

          {isAuthenticated ? (
            <>
              <span className="navbar-user">
                Hi, {user?.name || "User"}
              </span>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="login-btn">
                  Login
                </button>
              </Link>

              <Link to="/register">
                <button className="register-btn">
                  Register
                </button>
              </Link>
            </>
          )}

        </div>

      </div>

    </nav>
  );
};

export default Navbar;