import React from "react";

import UserLayout from "../../layouts/UserLayout";

import RewardCard from "../../components/user/RewardCard";

import Card from "../../components/common/Card";

import "./GreenPoints.css";


const GreenPoints = () => {

  // ==========================================
  // DUMMY USER DATA
  // ==========================================
  const totalPoints = 1240;

  const rewards = [
    {
      id: 1,
      title: "Amazon Gift Card",
      pointsRequired: 500,

      description:
        "Redeem a ₹500 Amazon gift card using your green points.",

      image:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200",

      redeemed: false,
    },

    {
      id: 2,
      title: "Eco Warrior Badge",
      pointsRequired: 800,

      description:
        "Unlock your exclusive eco warrior achievement badge.",

      image:
        "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1200",

      redeemed: true,
    },

    {
      id: 3,
      title: "Shopping Discount Coupon",
      pointsRequired: 1000,

      description:
        "Get exciting shopping discounts using your green points.",

      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200",

      redeemed: false,
    },
  ];


  // ==========================================
  // HANDLE REDEEM
  // ==========================================
  const handleRedeem = (
    rewardTitle
  ) => {

    alert(
      `${rewardTitle} redeemed successfully!`
    );

  };


  return (
    <UserLayout>

      <div className="green-points-page">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="green-header">

          <h1>
            Green Rewards 🌱
          </h1>

          <p>
            Earn eco points through
            recycling and redeem
            exciting rewards.
          </p>

        </div>


        {/* ================================= */}
        {/* POINTS CARD */}
        {/* ================================= */}

        <div className="points-summary">

          <Card
            title="Available Green Points"
            value={totalPoints}
            icon="🎁"
          />

        </div>


        {/* ================================= */}
        {/* REWARDS GRID */}
        {/* ================================= */}

        <div className="rewards-grid">

          {rewards.map((reward) => (

            <RewardCard
              key={reward.id}

              title={reward.title}

              pointsRequired={
                reward.pointsRequired
              }

              description={
                reward.description
              }

              image={reward.image}

              redeemed={reward.redeemed}

              onRedeem={() =>
                handleRedeem(
                  reward.title
                )
              }
            />

          ))}

        </div>

      </div>

    </UserLayout>
  );
};

export default GreenPoints;