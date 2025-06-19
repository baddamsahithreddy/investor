// lib/fetchNSEData.js

import axios from 'axios';
import sampleStocks from '../data/sampleStocks.json';
import sectorMap from '../data/sectorMap.json';

/**
 * Fetches basic live data for each stock from NSE
 * Includes last traded price, volumes, OHLC, etc.
 */
export async function fetchNSEData() {
  const results = [];

  for (const stock of sampleStocks) {
    try {
      const url = `https://www.nseindia.com/api/quote-equity?symbol=${stock}`;
      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.nseindia.com/',
      };

      const response = await axios.get(url, { headers });
      const quote = response.data;

      results.push({
        symbol: stock,
        lastPrice: quote.priceInfo.lastPrice,
        volume: quote.priceInfo.totalTradedVolume,
        priceHistory: quote.priceInfo.intraDayHighLow || [],
        volumeHistory: [], // Add historical volume if you scrape or use NSE Bhavcopy
        sector: sectorMap[stock] || 'Unknown',
      });
    } catch (error) {
      console.error(`Failed to fetch data for ${stock}:`, error.message);
    }
  }

  return results;
}
