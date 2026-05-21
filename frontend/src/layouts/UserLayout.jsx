import React from "react";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";

import "./UserLayout.css";


const UserLayout = ({
  children,
}) => {
  return (
    <div className="user-layout">

      {/* ===================================== */}
      {/* SIDEBAR */}
      {/* ===================================== */}

      <Sidebar />


      {/* ===================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================== */}

      <div className="user-layout-main">

        {/* NAVBAR */}
        <Navbar />


        {/* PAGE CONTENT */}
        <main className="user-layout-content">

          {children}

        </main>


        {/* FOOTER */}
        <Footer />

      </div>

    </div>
  );
};

export default UserLayout;