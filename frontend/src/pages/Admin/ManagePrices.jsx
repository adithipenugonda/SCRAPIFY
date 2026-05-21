import React, {
  useState,
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

import Button from "../../components/common/Button";

import "./ManagePrices.css";


const ManagePrices = () => {

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
  // HANDLE PRICE CHANGE
  // ==========================================
  const handlePriceChange = (
    id,
    value
  ) => {

    setPrices((prevPrices) =>
      prevPrices.map((item) =>

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
  // SAVE PRICES
  // ==========================================
  const handleSave = () => {

    console.log(prices);

    alert(
      "Scrap prices updated successfully!"
    );
  };


  return (
    <AdminLayout>

      <div className="manage-prices-page">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="manage-prices-header">

          <h1>
            Manage Scrap Prices 💰
          </h1>

          <p>
            Update and control
            market prices for
            recyclable materials.
          </p>

        </div>


        {/* ================================= */}
        {/* PRICE TABLE */}
        {/* ================================= */}

        <div className="prices-card">

          <div className="prices-header">

            <h2>
              Current Scrap Rates
            </h2>

          </div>


          <div className="prices-table">

            {/* TABLE HEAD */}
            <div className="prices-row prices-head">

              <span>
                Material
              </span>

              <span>
                Price per KG
              </span>

              <span>
                Update Price
              </span>

            </div>


            {/* TABLE BODY */}
            {prices.map((item) => (

              <div
                key={item.id}
                className="prices-row"
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


          {/* BUTTON */}
          <div className="save-btn-container">

            <Button
              text="Save Changes"
              icon="💾"
              onClick={handleSave}
            />

          </div>

        </div>

      </div>

    </AdminLayout>
  );
};

export default ManagePrices;