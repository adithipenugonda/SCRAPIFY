import React, { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import "./CollectorLayout.css";

const CollectorLayout = ({
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
    <div className="collector-layout">

      {/* ================================= */}
      {/* SIDEBAR */}
      {/* ================================= */}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />


      {/* ================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ================================= */}

      <main className="collector-main">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="collector-page-content">

          {children}

        </div>

      </main>

    </div>

  );

};

export default CollectorLayout;