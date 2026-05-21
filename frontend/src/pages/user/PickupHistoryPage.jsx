import React from "react";

import UserLayout from "../../layouts/UserLayout";

import PickupCard from "../../components/user/PickupCard";

import "./PickupHistoryPage.css";


const PickupHistoryPage = () => {

  // ==========================================
  // DUMMY HISTORY DATA
  // ==========================================
  const pickupHistory = [
    {
      id: 1,
      materialType: "Plastic Bottles",
      weight: 15,
      amount: 450,
      status: "Completed",
      pickupDate: "10 May 2026",
      collector: "Ravi Kumar",
    },

    {
      id: 2,
      materialType: "Old Newspapers",
      weight: 20,
      amount: 320,
      status: "Completed",
      pickupDate: "05 May 2026",
      collector: "Anil Sharma",
    },

    {
      id: 3,
      materialType: "E-Waste",
      weight: 7,
      amount: 780,
      status: "Completed",
      pickupDate: "28 April 2026",
      collector: "Suresh Reddy",
    },

    {
      id: 4,
      materialType: "Iron Scrap",
      weight: 35,
      amount: 1450,
      status: "Completed",
      pickupDate: "20 April 2026",
      collector: "Mahesh Kumar",
    },
  ];


  return (
    <UserLayout>

      <div className="pickup-history-page">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="history-header">

          <h1>
            Pickup History 🧾
          </h1>

          <p>
            View all your completed
            scrap pickup records and
            earnings history.
          </p>

        </div>


        {/* ================================= */}
        {/* SUMMARY CARDS */}
        {/* ================================= */}

        <div className="history-summary">

          <div className="summary-card">

            <h3>
              Total Pickups
            </h3>

            <h2>
              24
            </h2>

          </div>


          <div className="summary-card">

            <h3>
              Total Earnings
            </h3>

            <h2>
              ₹8,450
            </h2>

          </div>


          <div className="summary-card">

            <h3>
              Green Points
            </h3>

            <h2>
              1,240
            </h2>

          </div>

        </div>


        {/* ================================= */}
        {/* HISTORY LIST */}
        {/* ================================= */}

        <div className="history-list">

          {pickupHistory.map((pickup) => (

            <PickupCard
              key={pickup.id}

              materialType={
                pickup.materialType
              }

              weight={pickup.weight}

              amount={pickup.amount}

              status={pickup.status}

              pickupDate={
                pickup.pickupDate
              }

              collector={
                pickup.collector
              }
            />

          ))}

        </div>

      </div>

    </UserLayout>
  );
};

export default PickupHistoryPage;