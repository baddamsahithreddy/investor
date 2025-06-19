// utils/insiderDeals.js

import axios from 'axios';

/**
 * Fetches bulk or block deal info for a stock.
 * Currently using mock data — can later connect to NSE India bulk deal endpoint or Screener.in
 */
export async function getInsiderActivity(stockSymbol) {
  try {
    // Simulated insider/bulk deal data
    const insiderMap = {
      TATASTEEL: { type: 'Bulk Buy', confidence: 'High' },
      HINDALCO: { type: 'Block Sell', confidence: 'Medium' },
      INFY: { type: 'None', confidence: 'Low' },
    };

    const info = insiderMap[stockSymbol] || { type: 'None', confidence: 'Low' };

    return {
      symbol: stockSymbol,
      insiderType: info.type,
      insiderConfidence: info.confidence,
    };
  } catch (error) {
    console.error(`Insider deal check failed for ${stockSymbol}:`, error);
    return {
      symbol: stockSymbol,
      insiderType: 'Unknown',
      insiderConfidence: 'Unknown',
    };
  }
}
