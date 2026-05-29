import React, {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

import UserLayout from "../../layouts/UserLayout";

import PickupCard from "../../components/user/PickupCard";

import "./PickupHistoryPage.css";


const PickupHistoryPage = () => {
  const [pickupHistory, setPickupHistory] =
  useState([]);

  const fetchCompletedPickups =
  async () => {

    try {

      const response =
        await API.get(
          "/pickups/my-pickups"
        );

      const completed =
        response.data.pickups.filter(
          (pickup) =>
            pickup.status ===
            "Completed"
        );

      setPickupHistory(
        completed
      );

    } catch (error) {

      console.log(error);

    }

};

useEffect(() => {

  fetchCompletedPickups();

}, []);

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
              {pickupHistory.length}
            </h2>

          </div>


          <div className="summary-card">

            <h3>
              Total Earnings
            </h3>

            <h2>
              ₹{
  pickupHistory.reduce(
    (acc, curr) =>
      acc + curr.totalAmount,
    0
  )
}
            </h2>

          </div>


          <div className="summary-card">

            <h3>
              Green Points
            </h3>

            <h2>
              {
  pickupHistory.reduce(
    (acc, curr) =>
      acc +
      curr.greenPointsEarned,
    0
  )
}
            </h2>

          </div>

        </div>


        {/* ================================= */}
        {/* HISTORY LIST */}
        {/* ================================= */}

        <div className="history-list">

          {pickupHistory.map((pickup) => (

            <PickupCard
              key={pickup._id}

              materialType={
                pickup.materials?.[0]
  ?.materialType
              }

              weight={pickup.totalWeight}

              amount={pickup.totalAmount}

              status={pickup.status}

              pickupDate={
                new Date(
  pickup.pickupDate
).toLocaleDateString()
              }

              collector={
                pickup.collector?.name
              }

              paymentMethod={pickup.paymentMethod}

              paymentStatus={pickup.paymentStatus}
            />

          ))}

        </div>

      </div>

    </UserLayout>
  );
};

export default PickupHistoryPage;