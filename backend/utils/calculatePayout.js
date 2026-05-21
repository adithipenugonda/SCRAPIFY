const calculatePayout = (materials = []) => {
  let totalAmount = 0;

  const calculatedMaterials = materials.map(
    (item) => {
      const estimatedAmount =
        item.estimatedWeight *
        item.pricePerKg;

      totalAmount += estimatedAmount;

      return {
        ...item,
        estimatedAmount,
      };
    }
  );

  return {
    calculatedMaterials,

    totalAmount: Math.floor(totalAmount),
  };
};

module.exports = calculatePayout;