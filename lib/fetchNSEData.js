// lib/fetchNSEData.js

import axios from 'axios';

// Simple stock list for demonstration — replace with your actual stock list or load from data/sampleStocks.json
const stockList = ['TCS', 'INFY', 'RELIANCE', 'HDFCBANK', 'ITC'];

export async function fetchNSEData() {
  const results = {};

  for (const symbol of stockList) {
    try {
      const url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json",
        },
      });

      const data = response.data;
      results[symbol] = {
        price: data?.priceInfo?.lastPrice,
        volume: data?.priceInfo?.totalTradedVolume,
        open: data?.priceInfo?.open,
        high: data?.priceInfo?.intraDayHighLow?.max,
        low: data?.priceInfo?.intraDayHighLow?.min,
        close: data?.priceInfo?.close,
      };
    } catch (err) {
      console.warn(`Failed to fetch data for ${symbol}:`, err.message);
    }
  }

  return results;
}
