// lib/aiSignalEngine.js

import { getRSIAnalysis } from '../utils/rsiAnalysis';
import { getVolumeAnalysis } from '../utils/getVolumeData';
import { getPriceAction } from '../utils/priceAction';
import { detectCandlePattern } from '../utils/candlePatterns';
import { fetchNewsSentiment } from '../utils/fetchNews';
import { getEarningsImpact } from '../utils/earningsData';
import { getSectorSentiment } from '../utils/sectorSentiment';
import { checkVolatility } from '../utils/volatilityCheck';
import { getInsiderDeals } from '../utils/insiderDeals';

export function generateSignalFromData(stockDataList) {
  const signals = [];

  for (const stock of stockDataList) {
    try {
      const rsi = getRSIAnalysis(stock.priceHistory);
      const volume = getVolumeAnalysis(stock.volumeData);
      const priceAction = getPriceAction(stock.symbol);
      const candlePattern = detectCandlePattern(stock.priceHistory);
      const newsSentiment = fetchNewsSentiment(stock.symbol);
      const earningsImpact = getEarningsImpact(stock.symbol);
      const sectorSentiment = getSectorSentiment(stock.sector);
      const volatility = checkVolatility(stock.priceHistory);
      const insider = getInsiderDeals(stock.symbol);

      // AI Confidence Scoring
      let score = 0;
      if (volume === 'High') score += 15;
      if (rsi.status === 'Bullish') score += 15;
      if (priceAction.action === 'Breakout') score += 20;
      if (candlePattern === 'Bullish') score += 10;
      if (newsSentiment === 'Positive') score += 10;
      if (earningsImpact === 'Positive') score += 10;
      if (sectorSentiment === 'Positive') score += 10;
      if (volatility === 'Low') score += 5;
      if (insider === 'Buy') score += 5;

      const confidence = Math.min(score, 100);
      let direction = 'Neutral';

      if (confidence >= 75) direction = 'Long';
      else if (rsi.status === 'Bearish' && newsSentiment === 'Negative' && confidence >= 60)
        direction = 'Short';

      const reason = `Volume: ${volume}, RSI: ${rsi.value} (${rsi.status}), Price Action: ${priceAction.action}, Pattern: ${candlePattern}, News: ${newsSentiment}, Earnings: ${earningsImpact}`;

      signals.push({
        stock: stock.symbol,
        direction,
        confidence,
        timeframe: '5m',
        entry: stock.lastPrice,
        exit:
          direction === 'Long'
            ? (stock.lastPrice * 1.02).toFixed(2)
            : (stock.lastPrice * 0.98).toFixed(2),
        volume,
        rsi: rsi.value,
        newsSentiment,
        earningsImpact,
        sectorSentiment,
        reason,
      });
    } catch (error) {
      console.error(`Signal generation failed for ${stock.symbol}:`, error.message);
    }
  }

  return signals;
}
