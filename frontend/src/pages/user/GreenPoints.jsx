import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import UserLayout from "../../layouts/UserLayout";
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
    
    const alreadyRedeemed = user?.rewardsEarned?.includes(reward.title);
    if (alreadyRedeemed) {
      toast.error("You have already redeemed this reward!");
      return;
    }

    if (userPoints < reward.requiredPoints) {
      toast.error(`Not enough Green Points! You need ${reward.requiredPoints} points.`);
      return;
    }

    try {
      const response = await API.put(`/rewards/redeem/${reward._id}`);
      if (response.data && response.data.success) {
        toast.success(`${reward.title} redeemed successfully!`);
        await loadUser();
      }
    } catch (error) {
      console.error("Error redeeming reward:", error);
      toast.error(error.response?.data?.message || "Failed to redeem reward");
    }
  };

  const totalPoints = user?.greenPoints || 0;

  const getFormattedDate = () => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date().toLocaleDateString('en-US', options).toUpperCase();
  };

  return (
    <UserLayout>
      <div className="green-points-page">
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="gp-header">
          <span className="gp-date">{getFormattedDate()}</span>
          <h1>Green Points & Rewards</h1>
          <p>Cash out your impact.</p>
        </div>

        {/* ================================= */}
        {/* TOP SECTION */}
        {/* ================================= */}
        <div className="gp-top-grid">
          
          {/* BALANCE CARD */}
          <div className="gp-balance-card">
            <span className="balance-label">AVAILABLE BALANCE</span>
            <div className="balance-value">
              {totalPoints.toLocaleString()} <span className="pts-label">pts</span>
            </div>
            
            <div className="balance-progress-area">
              <div className="progress-labels">
                <span className="level-label">Level 4 • Sapling</span>
                <span className="next-level">320 pts to Canopy 🌱</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>

          {/* BADGES CARD */}
          <div className="gp-badges-card">
            <span className="badges-label">YOUR BADGES</span>
            <div className="badges-grid">
              <div className="badge-item active">
                <div className="badge-circle">🌱</div>
                <span className="badge-name">First<br/>Pickup</span>
              </div>
              <div className="badge-item active">
                <div className="badge-circle">🍃</div>
                <span className="badge-name">10kg<br/>Recycled</span>
              </div>
              <div className="badge-item active">
                <div className="badge-circle">🌳</div>
                <span className="badge-name">50kg<br/>Recycled</span>
              </div>
              <div className="badge-item active">
                <div className="badge-circle">♻️</div>
                <span className="badge-name">Plastic<br/>Hero</span>
              </div>
              <div className="badge-item inactive">
                <div className="badge-circle">📱</div>
                <span className="badge-name">E-Waste<br/>Saver</span>
              </div>
              <div className="badge-item inactive">
                <div className="badge-circle">🏆</div>
                <span className="badge-name">Top 10<br/>City</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================= */}
        {/* BOTTOM SECTION */}
        {/* ================================= */}
        <div className="gp-bottom-grid">
          
          {/* REWARDS AREA */}
          <div className="gp-rewards-area">
            <h3>Redeem at partner brands</h3>
            
            <div className="brands-grid">
              {loading ? (
                <p className="loading-text">Loading rewards...</p>
              ) : rewardsList.length > 0 ? (
                rewardsList.map((reward) => {
                  const redeemed = user?.rewardsEarned?.includes(reward.title) || false;
                  return (
                    <div className="brand-card" key={reward._id}>
                      <div className="brand-info">
                        <h4>{reward.title}</h4>
                        <p>{reward.description}</p>
                      </div>
                      <div className="brand-action">
                        <span className="brand-pts">{reward.requiredPoints} pts</span>
                        <button 
                          className={`brand-redeem-btn ${redeemed ? 'redeemed' : ''}`}
                          onClick={() => handleRedeem(reward)}
                          disabled={redeemed}
                        >
                          {redeemed ? 'Redeemed' : 'Redeem'}
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="empty-text">No rewards available currently.</p>
              )}
            </div>
          </div>

          {/* LEADERBOARD AREA */}
          <div className="gp-leaderboard-area">
            <div className="leaderboard-card">
              <h3>City Leaderboard</h3>
              
              <div className="leaderboard-list">
                <div className="lb-row">
                  <span className="lb-rank">#1</span>
                  <span className="lb-name">Ananya R.</span>
                  <span className="lb-score">4820</span>
                </div>
                <div className="lb-row">
                  <span className="lb-rank">#2</span>
                  <span className="lb-name">Vikram S.</span>
                  <span className="lb-score">4210</span>
                </div>
                <div className="lb-row">
                  <span className="lb-rank">#3</span>
                  <span className="lb-name">Priya N.</span>
                  <span className="lb-score">3905</span>
                </div>
                <div className="lb-row active-user">
                  <span className="lb-rank">#4</span>
                  <span className="lb-name">You ({user?.name?.split(' ')[0] || "User"})</span>
                  <span className="lb-score">{totalPoints}</span>
                </div>
                <div className="lb-row">
                  <span className="lb-rank">#5</span>
                  <span className="lb-name">Rohan K.</span>
                  <span className="lb-score">2310</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </UserLayout>
  );
};

export default GreenPoints;