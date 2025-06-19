// utils/insiderDeals.js

import axios from 'axios';

/**
 * Fetch recent insider or bulk/block deals for the given stock
 */
export async function getInsiderActivity(stockSymbol) {
  try {
    // Example: Screener-like public endpoint (replace with your own source or scrape)
    const url = `https://api.example.com/deals?symbol=${stockSymbol}`;
    const response = await axios.get(url);

    const data = response.data || [];

    // Filter recent bulk or insider trades (last 7 days)
    const now = new Date();
    const recentDeals = data.filter(deal => {
      const dealDate = new Date(deal.date);
      const daysDiff = (now - dealDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });

    const hasBulkBuy = recentDeals.some(deal => deal.type === 'BUY' && deal.category === 'Bulk');
    const hasInsiderSell = recentDeals.some(deal => deal.type === 'SELL' && deal.category === 'Insider');

    return {
      bulkBuy: hasBulkBuy,
      insiderSell: hasInsiderSell,
      count: recentDeals.length,
    };
  } catch (error) {
    console.error(`Insider deals fetch failed for ${stockSymbol}:`, error.message);
    return {
      bulkBuy: false,
      insiderSell: false,
      count: 0,
    };
  }
}
