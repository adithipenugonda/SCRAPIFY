// ==========================================
// CALCULATE REWARD POINTS
// ==========================================
const calculateRewards = (
  weight,
  materialType
) => {

  // POINTS PER KG
  const rewardRates = {
    Plastic: 10,
    Paper: 5,
    Iron: 15,
    "E-Waste": 25,
    Glass: 8,
  };


  // GET RATE
  const rate =
    rewardRates[materialType] || 2;


  // CALCULATE TOTAL
  const totalPoints =
    weight * rate;


  return totalPoints;
};

export default calculateRewards;