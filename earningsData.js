// utils/earningsData.js

import axios from 'axios';

/**
 * Fetch and interpret recent earnings result of a stock
 * @param {string} symbol - NSE stock symbol
 * @returns {Promise<{ impact: string, epsGrowth: string }>}
 */
export async function getEarningsImpact(symbol) {
  try {
    // Example API - Replace with actual if you have one
    const url = `https://www.screener.in/api/company/${symbol}/consolidated/`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const data = response.data;
    const quarters = data?.data?.quarters;
    if (!quarters || quarters.length < 2) throw new Error("Not enough data");

    const latest = quarters[quarters.length - 1];
    const prev = quarters[quarters.length - 2];

    const epsLatest = parseFloat(latest.eps || 0);
    const epsPrev = parseFloat(prev.eps || 0);
    const growth = epsLatest - epsPrev;

    let impact = 'Neutral';
    if (growth > 5) impact = 'Positive';
    else if (growth < -5) impact = 'Negative';

    return {
      impact,
      epsGrowth: `${growth.toFixed(2)} EPS change`
    };

  } catch (error) {
    console.error(`Failed to fetch earnings for ${symbol}:`, error.message);
    return {
      impact: 'Unknown',
      epsGrowth: 'N/A'
    };
  }
}
