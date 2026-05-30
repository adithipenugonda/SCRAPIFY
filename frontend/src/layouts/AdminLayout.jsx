import React, { useState } from "react";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";

import "./AdminLayout.css";


const AdminLayout = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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