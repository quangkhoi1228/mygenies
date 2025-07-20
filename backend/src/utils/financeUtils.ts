export function formatNumber(number: number) {
  return parseFloat(number.toFixed(2)).toLocaleString('en-US');
}
export const formatPrice = (number: number) => {
  return formatNumber(number / 1000);
};
export const formatVolume = (number: number) => {
  return formatNumber(number);
};

export function getPercentage(value: number, total: number) {
  return formatNumber((value / total) * 100) + '%';
}

export function getPortfolioPercentage(
  price: number,
  volume: number,
  nav: number,
) {
  return getPercentage(price * volume, nav);
}
