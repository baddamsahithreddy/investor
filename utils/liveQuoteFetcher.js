// utils/liveQuoteFetcher.js

import axios from 'axios';

/**
 * Fetch live price, open, high, low, close (OHLC) for a stock
 * Uses NSE/BSE or fallback public API for data
 */
export async function getLiveQuote(stockSymbol) {
  try {
    const url = `https://priceapi.moneycontrol.com/pricefeed/nse/equitycash/${stockSymbol}`;
    const response = await axios.get(url);

    const data = response.data.data;
    if (!data) throw new Error("No live data");

    return {
      symbol: stockSymbol,
      ltp: parseFloat(data.pricecurrent),
      open: parseFloat(data.priceopen),
      high: parseFloat(data.pricehigh),
      low: parseFloat(data.pricelow),
      prevClose: parseFloat(data.priceprevclose),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Live quote fetch failed for ${stockSymbol}:`, error);
    return {
      symbol: stockSymbol,
      ltp: null,
      open: null,
      high: null,
      low: null,
      prevClose: null,
      timestamp: null,
    };
  }
}
