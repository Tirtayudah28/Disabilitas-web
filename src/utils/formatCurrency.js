export const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return "0";

  const num = Number(value);

  const format = (n, suffix) => {
    let formatted = n % 1 === 0 ? n.toString() : n.toFixed(1);

    formatted = formatted.replace(".", ",");

    return formatted + suffix;
  };

  if (num >= 1_000_000_000) {
    return format(num / 1_000_000_000, " miliar");
  }
  if (num >= 1_000_000) {
    return format(num / 1_000_000, " juta");
  }
  if (num >= 1_000) {
    return format(num / 1_000, " rb");
  }

  return num.toString();
};
