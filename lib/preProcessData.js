// lib/preProcessData.js

/**
 * Cleans and standardizes live stock data for AI signal engine.
 * Each stock should have: symbol, lastPrice, volumeHistory, priceHistory, sector
 */

export function preProcessData(rawStockData = []) {
  return rawStockData.map((stock) => {
    return {
      symbol: stock.symbol,
      lastPrice: parseFloat(stock.lastPrice),
      sector: stock.sector || 'Unknown',

      // Example historical volume and price from past 20 candles (5-min)
      volumeData: stock.volumeHistory?.slice(-20) || [],
      priceHistory: stock.priceHistory?.slice(-20) || [],
    };
  });
}
