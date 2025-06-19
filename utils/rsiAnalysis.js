// utils/rsiAnalysis.js

export function getRSI(prices = []) {
  if (prices.length < 14) return null;


  let gains = 0, losses = 0;
  for (let i = 1; i <= 14; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }

  const avgGain = gains / 14;
  const avgLoss = losses / 14;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return +(100 - 100 / (1 + rs)).toFixed(2);
}

export default getRSI;
