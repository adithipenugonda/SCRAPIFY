import React from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import "./Sidebar.css";


const Sidebar = () => {

  const location =
    useLocation();

  const { user, logout } =
    useAuth();


  // =====================================
  // USER LINKS
  // =====================================
  const userLinks = [

    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠",
    },

    {
      name: "Schedule Pickup",
      path: "/schedule-pickup",
      icon: "📦",
    },

    {
      name: "Track Pickup",
      path: "/track-pickup",
      icon: "📍",
    },

    {
      name: "History",
      path: "/pickup-history",
      icon: "🧾",
    },

    {
      name: "Rewards",
      path: "/green-points",
      icon: "🎁",
    },

  ];


  // =====================================
  // COLLECTOR LINKS
  // =====================================
  const collectorLinks = [

    {
      name: "Dashboard",
      path: "/collector/dashboard",
      icon: "◆",
    },

    {
      name: "Available Jobs",
      path: "/collector/jobs",
      icon: "☰",
    },

    {
      name: "Earnings",
      path: "/collector/earnings",
      icon: "₹",
    },

  ];


  // =====================================
  // ADMIN LINKS
  // =====================================
  const adminLinks = [

    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "📊",
    },

    {
      name: "Users",
      path: "/admin/users",
      icon: "👥",
    },

    {
      name: "Collectors",
      path: "/admin/collectors",
      icon: "🚚",
    },

    {
      name: "Prices",
      path: "/admin/prices",
      icon: "💰",
    },

  ];


  // =====================================
  // ROLE LINKS
  // =====================================
  let links = userLinks;

  if (user?.role === "collector") {

    links = collectorLinks;

  }

  if (user?.role === "admin") {

    links = adminLinks;

  }


  return (

    <aside className="sidebar">

      {/* ================================= */}
      {/* TOP */}
      {/* ================================= */}

      <div>

        {/* BRAND */}
        <div className="sidebar-top">

          <div className="sidebar-brand">

            <div className="brand-circle">
              S
            </div>

            <div>

              <h2>
                SCRAPIFY
              </h2>

              <p>
                {user?.role || "USER"} CONSOLE
              </p>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* NAVIGATION */}
        {/* ================================= */}

        <div className="sidebar-links">

          {links.map((link) => (

            <Link
              key={link.path}

              to={link.path}

              className={
                location.pathname ===
                link.path
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >

              <span className="sidebar-icon">
                {link.icon}
              </span>

              <span className="sidebar-text">
                {link.name}
              </span>

            </Link>

          ))}

        </div>

      </div>


      {/* ================================= */}
      {/* FOOTER */}
      {/* ================================= */}

      <div className="sidebar-footer">

        <div className="sidebar-profile">

          <div className="profile-avatar">

            {
              user?.name
                ?.charAt(0)
                ?.toUpperCase() || "R"
            }

          </div>

          <div className="profile-info">

            <h4>
              {user?.name ||
                "Rajesh Kumar"}
            </h4>

            <p
              onClick={logout}

              className="exit-console-btn"
            >
              Exit console
            </p>

          </div>

        </div>

      </div>

    </aside>

  );

};

export default Sidebar;