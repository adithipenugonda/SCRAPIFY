import React from "react";

import UserLayout from "../../layouts/UserLayout";

import Card from "../../components/common/Card";

import "./UserDashboard.css";


const UserDashboard = () => {

  // ==========================================
  // DUMMY DATA
  // ==========================================
  const stats = [
    {
      title: "Total Pickups",
      value: "24",
      icon: "🚚",
    },

    {
      title: "Green Points",
      value: "1,240",
      icon: "🎁",
    },

    {
      title: "Total Earnings",
      value: "₹5,480",
      icon: "💰",
    },

    {
      title: "CO₂ Saved",
      value: "320kg",
      icon: "🌍",
    },
  ];


  return (
    <UserLayout>

      <div className="user-dashboard">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="dashboard-header">

          <div>

            <h1>
              User Dashboard
            </h1>

            <p>
              Track your recycling
              activity and rewards.
            </p>

          </div>

        </div>


        {/* ================================= */}
        {/* STATS GRID */}
        {/* ================================= */}

        <div className="dashboard-grid">

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

        <div className="dashboard-section">

          <div className="card">

            <h2>
              Recent Pickup Activity
            </h2>

            <div className="activity-list">

              <div className="activity-item">

                <div>
                  <h4>
                    Plastic & Paper Pickup
                  </h4>

                  <p>
                    Scheduled for Tomorrow
                  </p>
                </div>

                <span className="status pending">
                  Pending
                </span>

              </div>


              <div className="activity-item">

                <div>
                  <h4>
                    E-Waste Collection
                  </h4>

                  <p>
                    Completed Successfully
                  </p>
                </div>

                <span className="status completed">
                  Completed
                </span>

              </div>


              <div className="activity-item">

                <div>
                  <h4>
                    Iron Scrap Pickup
                  </h4>

                  <p>
                    Collector Assigned
                  </p>
                </div>

                <span className="status progress">
                  In Progress
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* REWARDS SECTION */}
        {/* ================================= */}

        <div className="dashboard-section">

          <div className="card rewards-card">

            <h2>
              Green Rewards 🌱
            </h2>

            <p>
              You are only
              <strong>
                {" "}260 points{" "}
              </strong>
              away from unlocking
              the Eco Champion Badge.
            </p>

            <button className="primary-btn">
              Redeem Rewards
            </button>

          </div>

        </div>

      </div>

    </UserLayout>
  );
};

export default UserDashboard;