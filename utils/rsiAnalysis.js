// utils/rsiAnalysis.js

/**
 * Calculates RSI (Relative Strength Index) for a given price series.
 * Default period is 14 candles (e.g., 5-minute or 15-minute).
 */
export function calculateRSI(prices = [], period = 14) {
  if (prices.length < period + 1) return null;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) {
      gains += diff;
    } else {
      losses -= diff; // diff is negative
    }
  }

  const averageGain = gains / period;
  const averageLoss = losses / period;

  if (averageLoss === 0) return 100; // Avoid division by zero

  const rs = averageGain / averageLoss;
  const rsi = 100 - 100 / (1 + rs);

  return parseFloat(rsi.toFixed(2));
}
