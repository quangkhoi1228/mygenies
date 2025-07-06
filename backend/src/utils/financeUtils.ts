export function formatNumber(number: number) {
  return parseFloat(number.toFixed(2)).toLocaleString('en-US');
}
export const formatPrice = (number: number) => {
  return formatNumber(number / 1000);
};
export const formatVolume = (number: number) => {
  return formatNumber(number);
};

export function getPortfolioPercentage(
  price: number,
  volume: number,
  nav: number,
) {
  return formatNumber(((price * volume) / nav) * 100) + '%';
}
