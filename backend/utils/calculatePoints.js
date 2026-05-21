const calculatePoints = (
  totalWeight,
  materials = []
) => {
  let points = 0;

  // Base Points Per KG
  points += totalWeight * 5;

  // Bonus Points Based On Material
  materials.forEach((item) => {
    switch (item.materialType) {
      case "E-Waste":
        points += item.estimatedWeight * 10;
        break;

      case "Plastic":
        points += item.estimatedWeight * 7;
        break;

      case "Copper":
        points += item.estimatedWeight * 8;
        break;

      case "Iron Scrap":
        points += item.estimatedWeight * 6;
        break;

      default:
        points += item.estimatedWeight * 3;
    }
  });

  // Eco Bonus
  if (totalWeight >= 50) {
    points += 100;
  }

  // Round Value
  return Math.floor(points);
};

module.exports = calculatePoints;