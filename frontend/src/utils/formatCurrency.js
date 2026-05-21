// ==========================================
// FORMAT CURRENCY
// ==========================================
const formatCurrency = (
  amount,
  currency = "INR"
) => {

  if (
    amount === null ||
    amount === undefined
  ) {
    return "₹0";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: currency,

      maximumFractionDigits: 0,
    }
  ).format(amount);

};

export default formatCurrency;