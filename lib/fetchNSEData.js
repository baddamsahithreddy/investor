// lib/fetchNSEData.js

import axios from 'axios';
import sampleStocks from '../data/sampleStocks.json';
import sectorMap from '../data/sectorMap.json';
import bannedStocks from '../data/bannedStocks.json';

/**
 * Fetches live market data for all tracked stocks
 * Combines NSE quote, historical price & volume
 */
export async function fetchNSEData() {
  const results = [];

  for (const symbol of sampleStocks) {
    if (bannedStocks.includes(symbol)) continue;

    try {
      const quote = await getNSEQuote(symbol);
      const history = await getHistoricalData(symbol);

      results.push({
        symbol,
        lastPrice: quote.lastPrice,
        volumeHistory: history.volume,
        priceHistory: history.close,
        sector: sectorMap[symbol] || 'Unknown',
      });
    } catch (err) {
      console.warn(`Failed fetching data for ${symbol}:`, err.message);
    }
  }

  return results;
}

/**
 * Fetch NSE quote data (price, volume)
 */
async function getNSEQuote(symbol) {
  const url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;
  const headers = {
    'User-Agent': 'Mozilla/5.0',
    'Referer': 'https://www.nseindia.com/',
  };

  const response = await axios.get(url, { headers });
  const data = response.data;

  return {
    lastPrice: parseFloat(data.priceInfo?.lastPrice?.toString().replace(/,/g, '')),
    volume: data.marketDeptOrderBook?.totalTradedVolume,
  };
}

/**
 * Fetch recent 5-min candle data for past 1–2 days
 */
async function getHistoricalData(symbol) {
  const now = Math.floor(Date.now() / 1000);
  const from = now - 2 * 24 * 60 * 60;

  const url = `https://priceapi.moneycontrol.com/techCharts/indianMarket/stock/history?symbol=${symbol}&resolution=5&from=${from}&to=${now}`;
  const response = await axios.get(url);
  const data = response.data;

  return {
    close: data.c || [],
    volume: data.v || [],
  };
}
