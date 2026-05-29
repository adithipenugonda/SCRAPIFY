import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import UserLayout from "../../layouts/UserLayout";
import RewardCard from "../../components/user/RewardCard";
import Card from "../../components/common/Card";
import API from "../../services/api";
import { useAuthContext } from "../../context/AuthContext";
import "./GreenPoints.css";

const GreenPoints = () => {
  const { user, loadUser } = useAuthContext();
  const [rewardsList, setRewardsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all active rewards
  const fetchRewards = async () => {
    try {
      const response = await API.get("/rewards");
      if (response.data && response.data.rewards) {
        setRewardsList(response.data.rewards);
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  // Handle Reward Redemption
  const handleRedeem = async (reward) => {
    const userPoints = user?.greenPoints || 0;
    
    // Check if already redeemed
    const alreadyRedeemed = user?.rewardsEarned?.includes(reward.title);
    if (alreadyRedeemed) {
      toast.error("You have already redeemed this reward!");
      return;
    }

    // Check points eligibility
    if (userPoints < reward.requiredPoints) {
      toast.error(`Not enough Green Points! You need ${reward.requiredPoints} points.`);
      return;
    }

    try {
      const response = await API.put(`/rewards/redeem/${reward._id}`);
      if (response.data && response.data.success) {
        toast.success(`${reward.title} redeemed successfully!`);
        // Refresh the user profile to sync updated points and rewardsEarned
        await loadUser();
      }
    } catch (error) {
      console.error("Error redeeming reward:", error);
      toast.error(error.response?.data?.message || "Failed to redeem reward");
    }
  };

  const totalPoints = user?.greenPoints || 0;

  return (
    <UserLayout>
      <div className="green-points-page">
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="green-header">
          <h1>Green Rewards 🌱</h1>
          <p>
            Earn eco points through recycling and redeem exciting rewards.
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
        <div className="rewards-section">
          <h2>Available Rewards</h2>
          {loading ? (
            <p style={{ color: "var(--text-light)", fontSize: "14px", marginTop: "16px" }}>Loading rewards...</p>
          ) : rewardsList.length > 0 ? (
            <div className="rewards-grid" style={{ marginTop: "20px" }}>
              {rewardsList.map((reward) => {
                const redeemed = user?.rewardsEarned?.includes(reward.title) || false;
                return (
                  <RewardCard
                    key={reward._id}
                    title={reward.title}
                    pointsRequired={reward.requiredPoints}
                    description={reward.description}
                    image={reward.badgeImage || "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200"}
                    redeemed={redeemed}
                    onRedeem={() => handleRedeem(reward)}
                  />
                );
              })}
            </div>
          ) : (
            <p style={{ color: "var(--text-light)", fontSize: "14px", marginTop: "16px" }}>No rewards available currently.</p>
          )}
        </div>

        {/* ================================= */}
        {/* REDEMPTION HISTORY */}
        {/* ================================= */}
        <div className="redemption-history-section" style={{ marginTop: "48px" }}>
          <h2>Redemption History 📜</h2>
          {user?.rewardsEarned && user.rewardsEarned.length > 0 ? (
            <div className="history-list" style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "20px" }}>
              {user.rewardsEarned.map((rewardTitle, index) => (
                <div key={index} className="activity-item" style={{ background: "white", padding: "16px 20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ fontWeight: "600", fontSize: "16px", color: "var(--text-color)" }}>{rewardTitle}</h4>
                    <p style={{ color: "var(--text-light)", fontSize: "13px", marginTop: "4px" }}>Redeemed successfully</p>
                  </div>
                  <span className="status completed" style={{ color: "#00c853", background: "rgba(0, 200, 83, 0.1)", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>Redeemed</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-light)", fontSize: "14px", marginTop: "16px" }}>No rewards redeemed yet.</p>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default GreenPoints;