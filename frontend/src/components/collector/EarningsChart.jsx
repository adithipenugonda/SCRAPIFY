import React from "react";

import "./EarningsChart.css";


const EarningsChart = () => {

  // ==========================================
  // CHART DATA
  // ==========================================
  const chartData = [

    {
      day: "Mon",
      amount: 1200,
    },

    {
      day: "Tue",
      amount: 1800,
    },

    {
      day: "Wed",
      amount: 1500,
    },

    {
      day: "Thu",
      amount: 2400,
    },

    {
      day: "Fri",
      amount: 2100,
    },

    {
      day: "Sat",
      amount: 3000,
    },

    {
      day: "Sun",
      amount: 2600,
    },

  ];


  // ==========================================
  // MAX VALUE
  // ==========================================
  const maxValue = Math.max(
    ...chartData.map(
      (item) => item.amount
    )
  );


  return (

    <div className="premium-earnings-chart card">


      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="earnings-chart-header">

        <div>

          <p className="chart-subtitle">
            Revenue Analytics
          </p>

          <h2>
            Weekly Earnings
          </h2>

        </div>


        <div className="chart-growth">

          +18%

        </div>

      </div>


      {/* ================================= */}
      {/* CHART */}
      {/* ================================= */}

      <div className="premium-chart-wrapper">

        {chartData.map((item, index) => (

          <div
            key={index}
            className="premium-bar-group"
          >

            {/* VALUE */}

            <span className="premium-chart-value">

              ₹{item.amount}

            </span>


            {/* BAR */}

            <div
              className="premium-chart-bar"
              style={{
                height: `${
                  (item.amount / maxValue) * 220
                }px`,
              }}
            ></div>


            {/* LABEL */}

            <span className="premium-chart-label">

              {item.day}

            </span>

          </div>

        ))}

      </div>

    </div>

  );

};

export default EarningsChart;