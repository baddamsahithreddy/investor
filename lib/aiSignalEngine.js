// lib/aiSignalEngine.js

import { getVolumeData } from '../utils/getVolumeData';
import { getPriceAction } from '../utils/priceAction';
import { getRSI } from '../utils/rsiAnalysis';
import { getNewsSentiment } from '../utils/fetchNews';
import { getEarningsImpact } from '../utils/earningsData';
import { getSectorSentiment } from '../utils/sectorSentiment';
import { getCandlePattern } from '../utils/candlePatterns';
import { getInsiderActivity } from '../utils/insiderDeals';

export function generateSignalFromData(processedStocks) {
  const signals = [];

  for (const stock of processedStocks) {
    const {
      symbol,
      priceHistory,
      volumeData,
      sector,
    } = stock;

    // Run all AI checks (assuming data is already pre-fetched and structured)
    const volume = getVolumeData(volumeData);
    const priceAction = getPriceAction(symbol, priceHistory);
    const rsi = getRSI(priceHistory);
    const news = getNewsSentiment(symbol);
    const earnings = getEarningsImpact(symbol);
    const sectorInfo = getSectorSentiment(sector);
    const candle = getCandlePattern(priceHistory);
    const insider = getInsiderActivity(symbol);

    // Basic scoring weights (out of 100)
    let score = 0;
    if (volume === 'High') score += 15;
    if (priceAction.action === 'Breakout') score += 15;
    if (rsi.value >= 50 && rsi.value <= 70) score += 10;
    if (news === 'Positive') score += 10;
    if (earnings === 'Positive') score += 10;
    if (sectorInfo === 'Bullish') score += 10;
    if (candle === 'BullishEngulfing' || candle === 'Hammer') score += 10;
    if (insider.bulkBuy && !insider.insiderSell) score += 10;

    const direction = priceAction.action === 'Breakout' ? 'Long' :
                      priceAction.action === 'Breakdown' ? 'Short' : 'Neutral';

    if (direction !== 'Neutral') {
      signals.push({
        stock: symbol,
        direction,
        confidence: score,
        timeframe: "5m",
        entry: stock.lastPrice,
        exit: direction === 'Long'
          ? (stock.lastPrice * 1.015).toFixed(2)
          : (stock.lastPrice * 0.985).toFixed(2),
        volume,
        rsi: rsi.value,
        newsSentiment: news,
        earningsImpact: earnings,
        sectorSentiment: sectorInfo,
        reason: `Signal based on volume: ${volume}, price: ${priceAction.action}, candle: ${candle}`,
      });
    }
  }

  return signals;
}
