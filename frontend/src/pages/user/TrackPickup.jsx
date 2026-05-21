import React from "react";

import UserLayout from "../../layouts/UserLayout";

import PickupCard from "../../components/user/PickupCard";

import "./TrackPickup.css";


const TrackPickup = () => {

  // ==========================================
  // DUMMY PICKUP DATA
  // ==========================================
  const pickups = [
    {
      id: 1,
      materialType: "Plastic Waste",
      weight: 12,
      amount: 340,
      status: "Pending",
      pickupDate: "20 May 2026",
      collector: "Ravi Kumar",
    },

    {
      id: 2,
      materialType: "E-Waste",
      weight: 8,
      amount: 620,
      status: "In Progress",
      pickupDate: "22 May 2026",
      collector: "Anil Sharma",
    },

    {
      id: 3,
      materialType: "Iron Scrap",
      weight: 25,
      amount: 1200,
      status: "Completed",
      pickupDate: "15 May 2026",
      collector: "Suresh Reddy",
    },
  ];


  return (
    <UserLayout>

      <div className="track-pickup-page">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="track-header">

          <h1>
            Track Your Pickups 📍
          </h1>

          <p>
            Monitor your scheduled
            pickups and their current
            status in real time.
          </p>

        </div>


        {/* ================================= */}
        {/* PICKUP LIST */}
        {/* ================================= */}

        <div className="pickup-list">

          {pickups.map((pickup) => (

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

export default TrackPickup;