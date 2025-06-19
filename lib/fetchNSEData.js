// lib/fetchNSEData.js

import axios from 'axios';
import sampleStocks from '../data/sampleStocks.json';
import sectorMap from '../data/sectorMap.json';

/**
 * Simulates fetching live price and volume data from NSE/BSE APIs.
 * Replace mock with live API or scraper as needed.
 */
export async function fetchNSEData() {
  const stockData = [];

  for (const symbol of sampleStocks) {
    try {
      // Placeholder: Replace this URL with actual API like Trendlyne or broker API
      const url = `https://priceapi.moneycontrol.com/techCharts/indianMarket/stock/history?symbol=${symbol}&resolution=5&from=${getFromDate()}&to=${getToDate()}`;
      const res = await axios.get(url);
      const ohlc = res.data || {};

      const priceHistory = ohlc?.c?.slice(-20) || [];
      const volumeHistory = ohlc?.v?.slice(-20) || [];

      const lastPrice = priceHistory[priceHistory.length - 1] || 0;

      stockData.push({
        symbol,
        lastPrice,
        priceHistory,
        volumeHistory,
        sector: sectorMap[symbol] || 'Unknown',
      });
    } catch (err) {
      console.warn(`Failed to fetch data for ${symbol}`, err.message);
    }
  }

  return stockData;
}

function getFromDate() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return Math.floor(date.getTime() / 1000);
}

function getToDate() {
  return Math.floor(Date.now() / 1000);
}
