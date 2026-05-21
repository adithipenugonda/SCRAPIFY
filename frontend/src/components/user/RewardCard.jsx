import React from "react";

import Button from "../common/Button";

import "./RewardCard.css";


const RewardCard = ({
  title,
  pointsRequired,
  description,
  image,
  redeemed,
  onRedeem,
}) => {

  return (
    <div className="reward-card">

      {/* ===================================== */}
      {/* IMAGE */}
      {/* ===================================== */}

      <div className="reward-image">

        <img
          src={image}
          alt={title}
        />

      </div>


      {/* ===================================== */}
      {/* CONTENT */}
      {/* ===================================== */}

      <div className="reward-content">

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>


        {/* POINTS */}
        <div className="reward-points">

          🎁 {pointsRequired} Points

        </div>


        {/* BUTTON */}
        <Button
          text={
            redeemed
              ? "Redeemed"
              : "Redeem Reward"
          }

          onClick={onRedeem}

          disabled={redeemed}

          fullWidth={true}
        />

      </div>

    </div>
  );
};

export default RewardCard;