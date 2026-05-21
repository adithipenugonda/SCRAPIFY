import React from "react";

import PickupCard from "./PickupCard";

import "./PickupHistory.css";


const PickupHistory = ({
  pickups = [],
}) => {

  return (
    <div className="pickup-history">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="pickup-history-header">

        <h2>
          Recent Pickup History
        </h2>

        <p>
          View your previous scrap
          collection activities and
          earnings.
        </p>

      </div>


      {/* ================================= */}
      {/* PICKUP LIST */}
      {/* ================================= */}

      <div className="pickup-history-list">

        {pickups.length > 0 ? (

          pickups.map((pickup) => (

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

          ))

        ) : (

          <div className="no-history">

            <h3>
              No Pickup History Found
            </h3>

            <p>
              Your completed pickups
              will appear here.
            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default PickupHistory;