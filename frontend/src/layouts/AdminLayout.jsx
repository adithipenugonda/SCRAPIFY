import React, { useState, useEffect } from "react";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";

import "./AdminLayout.css";

const AdminLayout = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth <= 992) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    // Cleanup on unmount or state change
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  return (
    <div className="admin-layout">

      {/* ================================= */}
      {/* SIDEBAR */}
      {/* ================================= */}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />


      {/* ================================= */}
      {/* MAIN */}
      {/* ================================= */}

      <div className="admin-layout-main">

        {/* NAVBAR */}
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />


        {/* CONTENT */}
        <main className="admin-layout-content">

          {children}

        </main>


        {/* FOOTER */}
        <Footer />

      </div>

    </div>
  );
};

export default AdminLayout;