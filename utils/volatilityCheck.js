// utils/volatilityCheck.js

/**
 * Check if stock is too volatile (e.g. large wicks, gaps, swings)
 * You can tune the sensitivity threshold as needed.
 */

export function checkVolatility(stock) {
  if (!stock.priceHistory || stock.priceHistory.length < 2) {
    return false; // Not enough data to judge
  }

  const recentPrices = stock.priceHistory;
  const max = Math.max(...recentPrices);
  const min = Math.min(...recentPrices);
  const spread = max - min;
  const avgPrice = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;

  const spreadPercent = (spread / avgPrice) * 100;

  // Example rule: flag if swing is more than 5% in short time
  return spreadPercent > 5;
}
