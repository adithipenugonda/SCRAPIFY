import React from "react";

import "./JobCard.css";


const JobCard = ({
  material,
  address,
  weight,
  payout,
  distance,
  status = "Available",
  priority = "Medium",
  onAccept,
  onNavigate,
}) => {

  return (

    <div className="premium-job-card">

      {/* ================================= */}
      {/* TOP */}
      {/* ================================= */}

      <div className="premium-job-top">

        <div className="premium-job-left">

          <div className="premium-job-icon">
            ♻
          </div>

          <div>

            <h3>
              {material}
            </h3>

            <p>
              📍 {address}
            </p>

            <span>
              {distance}
            </span>

          </div>

        </div>


        {/* PRIORITY */}

        <div
          className={`priority-badge ${priority.toLowerCase()}`}
        >

          {priority}

        </div>

      </div>


      {/* ================================= */}
      {/* CENTER INFO */}
      {/* ================================= */}

      <div className="premium-job-center">

        <div>

          <h4>
            {weight}
          </h4>

          <p>
            Estimated Weight
          </p>

        </div>


        <div>

          <h4>
            {payout}
          </h4>

          <p>
            Payout
          </p>

        </div>

      </div>


      {/* ================================= */}
      {/* STATUS */}
      {/* ================================= */}

      <div className="job-status-wrapper">

        <span
          className={`job-status ${status.toLowerCase().replace(" ", "-")}`}
        >

          {status}

        </span>

      </div>


      {/* ================================= */}
      {/* ACTIONS */}
      {/* ================================= */}

      <div className="premium-job-actions">

        <button
          className="accept-btn"
          onClick={onAccept}
        >
          Accept Job
        </button>


        <button
          className="navigate-btn"
          onClick={onNavigate}
        >
          Navigate
        </button>

      </div>

    </div>

  );

};

export default JobCard;