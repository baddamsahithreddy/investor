// utils/earningsData.js

import axios from 'axios';

/**
 * Get recent earnings data and return impact analysis.
 * Returns: { symbol, earningsImpact: 'Positive' | 'Negative' | 'Neutral' }
 */
export async function getEarningsImpact(symbol) {
  try {
    // Using Screener.in unofficial API as fallback
    const url = `https://www.screener.in/company/${symbol}/consolidated/`;

    const response = await axios.get(url);
    const html = response.data;

    // Simple logic: check if "Profit up" or "Profit down" is found
    const isPositive = html.includes('Profit has increased') || html.includes('Net Profit has increased');
    const isNegative = html.includes('Profit has decreased') || html.includes('Net Profit has decreased');

    let earningsImpact = 'Neutral';
    if (isPositive) earningsImpact = 'Positive';
    else if (isNegative) earningsImpact = 'Negative';

    return { symbol, earningsImpact };
  } catch (error) {
    console.error(`Failed to fetch earnings for ${symbol}:`, error.message);
    return { symbol, earningsImpact: 'Neutral' };
  }
}
