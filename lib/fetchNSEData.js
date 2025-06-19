// lib/fetchNSEData.js

import axios from 'axios';
import sampleStocks from '../data/sampleStocks.json';
import sectorMap from '../data/sectorMap.json';

/**
 * Fetch stock data for a list of symbols from NSE India
 * Returns: [{ symbol, lastPrice, volumeHistory, priceHistory, sector }]
 */
export async function fetchNSEData() {
  try {
    const results = await Promise.all(
      sampleStocks.map(async (symbol) => {
        const url = `https://priceapi.moneycontrol.com/techCharts/indianMarket/stock/history?symbol=${symbol}&resolution=5&from=${getFromDate()}&to=${getToDate()}`;
        const response = await axios.get(url);
        const data = response.data;

        return {
          symbol,
          lastPrice: data?.c?.slice(-1)[0] || 0,
          volumeHistory: data?.v || [],
          priceHistory: data?.c || [],
          sector: sectorMap[symbol] || 'Unknown',
        };
      })
    );

    return results;
  } catch (error) {
    console.error("fetchNSEData error:", error.message);
    return []; // return empty to prevent crash
  }
}

function getFromDate() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return Math.floor(date.getTime() / 1000);
}

function getToDate() {
  return Math.floor(Date.now() / 1000);
}
