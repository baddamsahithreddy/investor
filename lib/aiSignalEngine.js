// lib/aiSignalEngine.js
import { getVolumeData } from '../utils/getVolumeData';
import { getRSI } from '../utils/rsiAnalysis';
import { getNewsSentiment } from '../utils/fetchNews';
import { getPriceAction } from '../utils/priceAction';
import { getEarningsImpact } from '../utils/earningsData';
import { getSectorSentiment } from '../utils/sectorSentiment';
import sampleStocks from '../data/sampleStocks.json';
import bannedStocks from '../data/bannedStocks.json';

export async function generateSignalFromData(liveStockData) {
  const signals = [];

  for (const stock of sampleStocks) {
    if (bannedStocks.includes(stock)) continue;

    try {
      const [volume, rsi, news, priceAction, earnings, sector] = await Promise.all([
        getVolumeData(stock),
        getRSI(stock),
        getNewsSentiment(stock),
        getPriceAction(stock),
        getEarningsImpact(stock),
        getSectorSentiment(stock),
      ]);

      let score = 0;
      if (volume === 'High') score += 20;
      if (rsi < 30 || rsi > 70) score += 15;
      if (priceAction.action === 'Breakout') score += 20;
      if (news === 'Positive') score += 15;
      if (earnings === 'Positive') score += 10;
      if (sector === 'Positive') score += 10;

      let direction = rsi < 30 || priceAction.action === 'Breakout' ? 'Long' : 'Short';
      const confidence = Math.min(score, 100);

      signals.push({
        stock,
        direction,
        confidence,
        timeframe: '5m',
        entry: liveStockData[stock]?.price || null,
        exit: calculateExit(liveStockData[stock]?.price, direction),
        volume,
        rsi,
        newsSentiment: news,
        earningsImpact: earnings,
        sectorSentiment: sector,
        reason: `Signal generated from volume: ${volume}, RSI: ${rsi}, news: ${news}, priceAction: ${priceAction.action}`
      });

    } catch (err) {
      console.error(`Signal generation failed for ${stock}:`, err.message);
    }
  }

  return signals;
}

function calculateExit(price, direction) {
  if (!price) return null;
  return direction === 'Long'
    ? +(price * 1.02).toFixed(2)
    : +(price * 0.98).toFixed(2);
}
