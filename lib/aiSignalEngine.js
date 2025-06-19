// lib/aiSignalEngine.js

import { getVolumeSpike } from '../utils/getVolumeData';
import { getRSIAnalysis } from '../utils/rsiAnalysis';
import { detectCandlePattern } from '../utils/candlePatterns';
import { getPriceAction } from '../utils/priceAction';
import { getEarningsImpact } from '../utils/earningsData';
import { getNewsSentiment } from '../utils/fetchNews';
import { getSectorSentiment } from '../utils/sectorSentiment';

export async function generateSignalFromData(processedStockData = []) {
  const signals = [];

  
  for (const stock of processedStockData) {
    try {
      const [
        volumeInfo,
        rsiInfo,
        candleInfo,
        priceActionInfo,
        earningsInfo,
        newsInfo,
        sectorInfo
      ] = await Promise.all([
        getVolumeSpike(stock),
        getRSIAnalysis(stock),
        detectCandlePattern(stock),
        getPriceAction(stock.symbol),
        getEarningsImpact(stock.symbol),
        getNewsSentiment(stock.symbol),
        getSectorSentiment(stock.symbol)
      ]);

      // Scoring logic (0–100) based on weighted importance
      let score = 0;
      if (volumeInfo.isSpike) score += 15;
      if (rsiInfo.trend === 'Bullish') score += 15;
      if (priceActionInfo.action === 'Breakout') score += 15;
      if (candleInfo.pattern !== 'None') score += 10;
      if (earningsInfo.impact === 'Positive') score += 10;
      if (newsInfo.sentiment === 'Positive') score += 10;
      if (sectorInfo.sentiment.includes('Positive')) score += 10;

      const direction =
        rsiInfo.trend === 'Bullish' && priceActionInfo.action === 'Breakout'
          ? 'Long'
          : rsiInfo.trend === 'Bearish' && priceActionInfo.action === 'Breakdown'
          ? 'Short'
          : 'Neutral';

      if (direction !== 'Neutral') {
        signals.push({
          stock: stock.symbol,
          direction,
          confidence: score,
          timeframe: '5m',
          entry: stock.lastPrice,
          exit: direction === 'Long'
            ? (stock.lastPrice * 1.015).toFixed(2)
            : (stock.lastPrice * 0.985).toFixed(2),
          volume: volumeInfo.level,
          rsi: rsiInfo.value,
          newsSentiment: newsInfo.sentiment,
          sectorSentiment: sectorInfo.sentiment,
          earningsImpact: earningsInfo.impact,
          reason: `${candleInfo.pattern} pattern, ${priceActionInfo.action}, ${newsInfo.sentiment} news`
        });
      }
    } catch (error) {
      console.error(`Signal generation failed for ${stock.symbol}:`, error);
    }
  }

  return signals;
}
