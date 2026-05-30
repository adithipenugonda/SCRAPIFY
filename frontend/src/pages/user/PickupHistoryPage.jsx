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

  const totalPickups = pickupHistory.length;
  const totalEarnings = pickupHistory.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalKg = pickupHistory.reduce((acc, curr) => acc + curr.totalWeight, 0);
  const avgPayout = totalKg > 0 ? (totalEarnings / totalKg).toFixed(0) : 0;

  const getFormattedDate = () => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date().toLocaleDateString('en-US', options).toUpperCase();
  };

  return (
    <UserLayout>

      <div className="pickup-history-page">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="history-header">
          <span className="history-date">{getFormattedDate()}</span>
          <h1>Pickup history</h1>
          <p>Your full recycling ledger.</p>
        </div>


        {/* ================================= */}
        {/* SUMMARY CARDS */}
        {/* ================================= */}

        <div className="history-summary">

          <div className="summary-card">
            <h3>TOTAL PICKUPS</h3>
            <h2>{totalPickups}</h2>
          </div>

          <div className="summary-card">
            <h3>TOTAL KG RECYCLED</h3>
            <h2>{totalKg.toFixed(1)}</h2>
          </div>

          <div className="summary-card">
            <h3>LIFETIME EARNINGS</h3>
            <h2>₹{totalEarnings.toLocaleString()}</h2>
          </div>

          <div className="summary-card">
            <h3>AVG PAYOUT / KG</h3>
            <h2>₹{avgPayout}</h2>
          </div>

        </div>


        {/* ================================= */}
        {/* HISTORY LIST / TABLE */}
        {/* ================================= */}

        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>ITEMS</th>
                <th>WEIGHT</th>
                <th>COLLECTOR</th>
                <th>STATUS</th>
                <th>PAYOUT</th>
              </tr>
            </thead>
            <tbody>
              {pickupHistory.map((pickup) => (
                <tr key={pickup._id}>
                  <td className="id-col">SCR-{pickup._id.slice(-4).toUpperCase()}</td>
                  <td>{new Date(pickup.pickupDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
                  <td className="items-col">{pickup.materials?.[0]?.materialType || "Mixed Items"}</td>
                  <td>{pickup.totalWeight} kg</td>
                  <td>{pickup.collector?.name || "Unassigned"}</td>
                  <td>
                    <span className={`status-badge ${pickup.status.toLowerCase()}`}>
                      {pickup.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="payout-col">+₹{pickup.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </UserLayout>
  );
};

export default PickupHistoryPage;