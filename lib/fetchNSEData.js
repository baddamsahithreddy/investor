// lib/fetchNSEData.js

import axios from 'axios';
import sampleStocks from '../data/sampleStocks.json';
import sectorMap from '../data/sectorMap.json';
import bannedStocks from '../data/bannedStocks.json';

/**
 * Fetch live data from NSE for the selected stock symbols
 * This is simplified using NSE stock quote API + fallback
 */
export async function fetchNSEData() {
  const validStocks = sampleStocks.filter(symbol => !bannedStocks.includes(symbol));
  const stockData = [];

  for (const symbol of validStocks) {
    try {
      const url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;
      const headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Referer": `https://www.nseindia.com/get-quotes/equity?symbol=${symbol}`,
      };

      const response = await axios.get(url, { headers });
      const data = response.data;

      const volume = parseInt(data?.marketDeptOrderBook?.totalTradedVolume) || 0;
      const lastPrice = parseFloat(data?.priceInfo?.lastPrice) || 0;

      stockData.push({
        symbol,
        lastPrice,
        sector: sectorMap[symbol] || 'Unknown',
        volumeHistory: generateDummyVolumeHistory(volume),
        priceHistory: generateDummyPriceHistory(lastPrice),
      });
    } catch (error) {
      console.error(`Failed to fetch for ${symbol}`, error.message);
    }
  }

  return stockData;
}

// Generates mock past 20 candles of volume data from current
function generateDummyVolumeHistory(currentVolume) {
  const variation = currentVolume * 0.1;
  return Array.from({ length: 20 }, () => Math.floor(currentVolume + (Math.random() - 0.5) * variation));
}

// Generates mock past 20 candles of price data from current
function generateDummyPriceHistory(currentPrice) {
  const variation = currentPrice * 0.01;
  return Array.from({ length: 20 }, () => parseFloat((currentPrice + (Math.random() - 0.5) * variation).toFixed(2)));
}
