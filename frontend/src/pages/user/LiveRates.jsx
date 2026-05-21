import React from "react";

import "./LiveRates.css";

const LiveRates = () => {

  const rates = [
    {
      icon: "📰",
      name: "NEWSPAPER",
      price: "₹14.50",
      change: "+0.4",
    },

    {
      icon: "📦",
      name: "CARDBOARD",
      price: "₹8.20",
      change: "-0.3",
    },

    {
      icon: "🧴",
      name: "PLASTIC (PET)",
      price: "₹12.00",
      change: "+0.5",
    },

    {
      icon: "🔩",
      name: "IRON SCRAP",
      price: "₹28.00",
      change: "+1.2",
    },

    {
      icon: "🪙",
      name: "COPPER",
      price: "₹412.00",
      change: "+6",
    },

    {
      icon: "🥫",
      name: "ALUMINUM",
      price: "₹145.00",
      change: "--",
    },

    {
      icon: "💻",
      name: "E-WASTE",
      price: "₹95.00",
      change: "+2",
    },

    {
      icon: "🍾",
      name: "GLASS",
      price: "₹3.50",
      change: "--",
    },
  ];


  return (

    <div className="live-rates-page">

      <div className="rates-header">

        <span>
          01 / RATES
        </span>

        <div className="rates-header-top">

          <div>

            <h1>
              Live market prices
            </h1>

            <p>
              Updated every 15 minutes from verified scrap markets.
              What you see is what you get.
            </p>

          </div>

          <div className="last-updated">
            Last updated:
            <span> just now</span>
          </div>

        </div>

      </div>


      <div className="rates-grid">

        {rates.map((item, index) => (

          <div
            key={index}
            className="rate-card"
          >

            <div className="rate-top">

              <div className="rate-icon">
                {item.icon}
              </div>

              <div
                className={
                  item.change.includes("-")
                    ? "rate-down"
                    : "rate-up"
                }
              >
                {item.change}
              </div>

            </div>


            <h3>
              {item.name}
            </h3>

            <h2>
              {item.price}
              <span>/kg</span>
            </h2>

          </div>

        ))}

      </div>

    </div>

  );
};

export default LiveRates;