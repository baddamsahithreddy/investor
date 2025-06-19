// lib/fetchNSEData.js

import axios from 'axios';
import { bannedStocks } from '../data/bannedStocks.json';
import { sectorMap } from '../data/sectorMap.json';
import sampleStocks from '../data/sampleStocks.json';

/**
 * Fetches live data for selected stocks from NSE India public endpoint.
 * If API is blocked or fails, returns fallback test data.
 */
export async function fetchNSEData() {
  try {
    const results = [];

    for (const symbol of sampleStocks) {
      if (bannedStocks.includes(symbol)) continue;

      const url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json',
          'Referer': `https://www.nseindia.com/get-quotes/equity?symbol=${symbol}`,
        },
      });

      const data = response.data;
      const volume = parseInt(data.volumeTraded || 0, 10);
      const price = parseFloat(data.priceInfo?.lastPrice || 0);
      const ohlc = {
        open: data.priceInfo?.open || 0,
        high: data.priceInfo?.intraDayHighLow?.max || 0,
        low: data.priceInfo?.intraDayHighLow?.min || 0,
        close: price,
      };

      results.push({
        symbol,
        lastPrice: price,
        volumeHistory: [volume],
        priceHistory: [ohlc.close],
        sector: sectorMap[symbol] || "Others",
      });

      // Throttle to avoid NSE blocking
      await new Promise((r) => setTimeout(r, 300));
    }

    return results;
  } catch (error) {
    console.error("Error fetching NSE data:", error);
    return sampleFallbackData(); // You can define this for dev mode
  }
}
