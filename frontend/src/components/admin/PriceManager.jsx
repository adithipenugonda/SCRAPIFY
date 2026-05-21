import React, {
  useState,
} from "react";

import Button from "../common/Button";

import "./PriceManager.css";


const PriceManager = () => {

  // ==========================================
  // STATE
  // ==========================================
  const [prices, setPrices] =
    useState([
      {
        id: 1,
        material: "Plastic",
        price: 28,
      },

      {
        id: 2,
        material: "Paper",
        price: 12,
      },

      {
        id: 3,
        material: "Iron",
        price: 45,
      },

      {
        id: 4,
        material: "E-Waste",
        price: 85,
      },
    ]);


  // ==========================================
  // HANDLE CHANGE
  // ==========================================
  const handlePriceChange = (
    id,
    value
  ) => {

    setPrices((prev) =>
      prev.map((item) =>

        item.id === id
          ? {
              ...item,
              price: value,
            }
          : item
      )
    );
  };


  // ==========================================
  // HANDLE SAVE
  // ==========================================
  const handleSave = () => {

    console.log(prices);

    alert(
      "Prices updated successfully!"
    );
  };


  return (
    <div className="price-manager-card">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="price-manager-header">

        <h2>
          Scrap Price Management 💰
        </h2>

        <p>
          Update recyclable material
          prices based on market rates.
        </p>

      </div>


      {/* ================================= */}
      {/* TABLE */}
      {/* ================================= */}

      <div className="price-table">

        {/* TABLE HEAD */}
        <div className="price-row price-head">

          <span>
            Material
          </span>

          <span>
            Current Price
          </span>

          <span>
            Update Price
          </span>

        </div>


        {/* TABLE BODY */}
        {prices.map((item) => (

          <div
            key={item.id}
            className="price-row"
          >

            <span>
              ♻️ {item.material}
            </span>


            <span className="price-value">
              ₹{item.price}/kg
            </span>


            <input
              type="number"

              value={item.price}

              onChange={(e) =>
                handlePriceChange(
                  item.id,
                  e.target.value
                )
              }
            />

          </div>

        ))}

      </div>


      {/* ================================= */}
      {/* BUTTON */}
      {/* ================================= */}

      <div className="price-save-btn">

        <Button
          text="Save Prices"
          icon="💾"
          onClick={handleSave}
        />

      </div>

    </div>
  );
};

export default PriceManager;