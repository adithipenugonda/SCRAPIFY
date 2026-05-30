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
      name: "Overview",
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
      name: "Green Points",
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

  let links = userLinks;
  if (user?.role === "collector") links = collectorLinks;
  if (user?.role === "admin") links = adminLinks;

  return (
    <aside className="sidebar">
      {/* TOP SECTION */}
      <div>
        <div className="sidebar-top">
          <Link to="/" className="sidebar-brand">
            <div className="brand-logo-s">S</div>
            <div className="brand-text-container">
              <h2>SCRAPIFY</h2>
              <p>{user?.role || "USER"} CONSOLE</p>
            </div>
          </Link>
        </div>

        {/* NAVIGATION */}
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
              <span className="sidebar-icon">{link.icon}</span>
              <span className="sidebar-text">{link.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* FOOTER SECTION */}
      <div className="sidebar-footer">
        <Link to={`/${user?.role || "user"}/profile`} className="sidebar-profile-link">
          <div className="profile-avatar-small">
            {user?.profileImage ? (
              <img src={user.profileImage.startsWith('http') ? user.profileImage : `${import.meta.env.VITE_API_URL.replace('/api', '')}${user.profileImage}`} alt="User" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
          <div className="profile-info-compact">
            <h4>{user?.name || "User"}</h4>
            <button onClick={(e) => { e.preventDefault(); logout(); }} className="exit-console-text">
              <FaArrowRightFromBracket /> Exit console
            </button>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;