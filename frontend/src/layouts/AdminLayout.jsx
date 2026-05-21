import React from "react";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";

import "./AdminLayout.css";


const AdminLayout = ({
  children,
}) => {

  return (
    <div className="admin-layout">

      {/* ================================= */}
      {/* SIDEBAR */}
      {/* ================================= */}

      <Sidebar />


      {/* ================================= */}
      {/* MAIN */}
      {/* ================================= */}

      <div className="admin-layout-main">

        {/* NAVBAR */}
        <Navbar />


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