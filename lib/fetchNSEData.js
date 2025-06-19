// lib/fetchNSEData.js

import axios from 'axios';
import sampleStocks from '../data/sampleStocks.json';
import sectorMap from '../data/sectorMap.json';

export async function fetchNSEData() {
  const results = [];

  for (const symbol of sampleStocks) {
    try {
      const res = await axios.get(
        `https://priceapi.moneycontrol.com/techCharts/indianMarket/stock/history?symbol=${symbol}&resolution=5&from=${getFromDate()}&to=${getToDate()}`
      );

      const candles = res.data.c;
      const volumes = res.data.v;

      const stockData = {
        symbol,
        lastPrice: candles.at(-1),
        volumeHistory: volumes.slice(-30),
        priceHistory: candles.slice(-30),
        sector: sectorMap[symbol] || 'Unknown',
      };

      results.push(stockData);
    } catch (err) {
      console.warn(`Skipping ${symbol} due to fetch error`);
    }
  }

  return results;
}

function getFromDate() {
  const date = new Date();
  date.setDate(date.getDate() - 5);
  return Math.floor(date.getTime() / 1000);
}

function getToDate() {
  return Math.floor(Date.now() / 1000);
}
