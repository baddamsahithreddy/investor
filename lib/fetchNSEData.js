// lib/fetchNSEData.js

import axios from 'axios';
import sampleStocks from '../data/sampleStocks.json';
import sectorMap from '../data/sectorMap.json';

/**
 * Fetches live quote & volume data from NSE India for all sample stocks.
 * Returns an array of stock objects with price, volume history, etc.
 */
export async function fetchNSEData() {
  const results = [];

  for (const symbol of sampleStocks) {
    try {
      const url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept-Language": "en-US,en;q=0.9"
        }
      });

      const data = response.data;
      const lastPrice = parseFloat(data?.priceInfo?.lastPrice);
      const volume = parseInt(data?.securityWiseDP?.tradedQuantity || 0);

      results.push({
        symbol,
        lastPrice,
        volumeHistory: [volume], // Extend later with last 5–20 candles
        priceHistory: [lastPrice],
        sector: sectorMap[symbol] || "Unknown"
      });
    } catch (err) {
      console.error(`NSE fetch failed for ${symbol}:`, err.message);
    }
  }

  return results;
}
