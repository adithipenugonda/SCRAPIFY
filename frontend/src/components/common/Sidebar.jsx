import React from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { 
  FaHouse, 
  FaBox, 
  FaLocationDot, 
  FaClockRotateLeft, 
  FaGift, 
  FaClipboardList, 
  FaIndianRupeeSign,
  FaChartPie,
  FaUsers,
  FaTruck,
  FaCircleDollarToSlot,
  FaArrowRightFromBracket
} from "react-icons/fa6";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // =====================================
  // USER LINKS
  // =====================================
  const userLinks = [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: <FaHouse />,
    },
    {
      name: "Schedule Pickup",
      path: "/schedule-pickup",
      icon: <FaBox />,
    },
    {
      name: "Track Pickup",
      path: "/track-pickup",
      icon: <FaLocationDot />,
    },
    {
      name: "History",
      path: "/pickup-history",
      icon: <FaClockRotateLeft />,
    },
    {
      name: "Payments",
      path: "/user/payment-history",
      icon: <FaIndianRupeeSign />,
    },
    {
      name: "Rewards",
      path: "/green-points",
      icon: <FaGift />,
    },
  ];

  // =====================================
  // COLLECTOR LINKS
  // =====================================
  const collectorLinks = [
    {
      name: "Dashboard",
      path: "/collector/dashboard",
      icon: <FaHouse />,
    },
    {
      name: "Available Jobs",
      path: "/collector/jobs",
      icon: <FaClipboardList />,
    },
    {
      name: "Earnings",
      path: "/collector/earnings",
      icon: <FaIndianRupeeSign />,
    },
  ];

  // =====================================
  // ADMIN LINKS
  // =====================================
  const adminLinks = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaChartPie />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FaUsers />,
    },
    {
      name: "Collectors",
      path: "/admin/collectors",
      icon: <FaTruck />,
    },
    {
      name: "Pickups",
      path: "/admin/pickups",
      icon: <FaClipboardList />,
    },
    {
      name: "Prices",
      path: "/admin/prices",
      icon: <FaCircleDollarToSlot />,
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
              ♻️
            </div>
            <div>
              <h2>SCRAPIFY</h2>
              <p>{user?.role || "USER"} CONSOLE</p>
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
                location.pathname === link.path
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
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="profile-info">
            <h4>{user?.name || "User Profile"}</h4>
            <button onClick={logout} className="exit-console-btn">
              <FaArrowRightFromBracket className="logout-icon" /> Exit console
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;