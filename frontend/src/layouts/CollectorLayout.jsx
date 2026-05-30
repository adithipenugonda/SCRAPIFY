import React, { useState } from "react";
import Navbar from "../components/common/Navbar";

import Sidebar from "../components/common/Sidebar";

import "./CollectorLayout.css";


const CollectorLayout = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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