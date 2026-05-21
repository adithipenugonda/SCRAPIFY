import React from "react";

import Sidebar from "../components/common/Sidebar";

import "./CollectorLayout.css";


const CollectorLayout = ({
  children,
}) => {

  return (

    <div className="collector-layout">

      {/* ================================= */}
      {/* SIDEBAR */}
      {/* ================================= */}

      <Sidebar />


      {/* ================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ================================= */}

      <main className="collector-main">

        <div className="collector-page-content">

          {children}

        </div>

      </main>

    </div>

  );

};

export default CollectorLayout;