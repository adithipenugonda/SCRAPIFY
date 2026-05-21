import React from "react";

import AdminLayout from "../../layouts/AdminLayout";

import Card from "../../components/common/Card";

import "./AdminDashboard.css";


const AdminDashboard = () => {

  // ==========================================
  // DUMMY STATS
  // ==========================================
  const stats = [
    {
      title: "Total Users",
      value: "2,450",
      icon: "👥",
    },

    {
      title: "Collectors",
      value: "124",
      icon: "🚚",
    },

    {
      title: "Total Pickups",
      value: "8,920",
      icon: "♻️",
    },

    {
      title: "Revenue",
      value: "₹12.4L",
      icon: "💰",
    },
  ];


  return (
    <AdminLayout>

      <div className="admin-dashboard">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="admin-header">

          <div>

            <h1>
              Admin Dashboard ⚙️
            </h1>

            <p>
              Monitor users, collectors,
              pickups, analytics, and
              overall platform activity.
            </p>

          </div>

        </div>


        {/* ================================= */}
        {/* STATS GRID */}
        {/* ================================= */}

        <div className="admin-grid">

          {stats.map((item, index) => (

            <Card
              key={index}

              title={item.title}

              value={item.value}

              icon={item.icon}
            />

          ))}

        </div>


        {/* ================================= */}
        {/* RECENT ACTIVITY */}
        {/* ================================= */}

        <div className="admin-section">

          <div className="card">

            <div className="section-header-admin">

              <h2>
                Recent Platform Activity
              </h2>

              <button className="primary-btn">
                View Reports
              </button>

            </div>


            <div className="activity-list">

              {/* ITEM */}
              <div className="activity-item">

                <div>

                  <h4>
                    New User Registered
                  </h4>

                  <p>
                    Adithi joined Scrapify
                  </p>

                </div>

                <span className="activity-time">
                  2 mins ago
                </span>

              </div>


              {/* ITEM */}
              <div className="activity-item">

                <div>

                  <h4>
                    Pickup Completed
                  </h4>

                  <p>
                    E-Waste pickup completed
                    in Madhapur
                  </p>

                </div>

                <span className="activity-time">
                  10 mins ago
                </span>

              </div>


              {/* ITEM */}
              <div className="activity-item">

                <div>

                  <h4>
                    New Collector Added
                  </h4>

                  <p>
                    Ravi Kumar joined as
                    collector
                  </p>

                </div>

                <span className="activity-time">
                  1 hour ago
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* ANALYTICS */}
        {/* ================================= */}

        <div className="admin-section">

          <div className="card analytics-card">

            <h2>
              Platform Insights 📊
            </h2>

            <p>
              Scrapify processed
              <strong>
                {" "}2.4 tons{" "}
              </strong>
              of recyclable waste this
              month with a
              <strong>
                {" "}34% growth{" "}
              </strong>
              compared to last month.
            </p>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
};

export default AdminDashboard;