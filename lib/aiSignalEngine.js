// lib/aiSignalEngine.js

import { getVolumeSpike } from '../utils/getVolumeData';
import { analyzeRSI } from '../utils/rsiAnalysis';
import { getPriceAction } from '../utils/priceAction';
import { getNewsSentiment } from '../utils/fetchNews';
import { getEarningsImpact } from '../utils/earningsData';
import { detectCandles } from '../utils/candlePatterns';
import { getSectorSentiment } from '../utils/sectorSentiment';

/**
 * Runs AI scoring logic to determine intraday trade signals
 */
export function generateSignalFromData(processedStocks = []) {
  const signals = [];

  for (const stock of processedStocks) {
    const rsi = analyzeRSI(stock.priceHistory);
    const volume = getVolumeSpike(stock.volumeData);
    const priceAction = getPriceAction(stock.symbol);
    const sentiment = getNewsSentiment(stock.symbol);
    const earnings = getEarningsImpact(stock.symbol);
    const candle = detectCandles(stock.priceHistory);
    const sector = getSectorSentiment(stock.sector);

    // ✅ Simple logic to combine all into one score
    let confidence = 0;
    let direction = 'Neutral';
    let reason = [];

    if (rsi.direction) {
      direction = rsi.direction;
      confidence += rsi.score;
      reason.push(`RSI shows ${rsi.direction}`);
    }

    if (volume.spike) {
      confidence += 10;
      reason.push('Unusual volume spike');
    }

    if (priceAction.action === 'Breakout' && direction === 'Long') {
      confidence += 15;
      reason.push('Breakout detected');
    } else if (priceAction.action === 'Breakdown' && direction === 'Short') {
      confidence += 15;
      reason.push('Breakdown confirmed');
    }

    if (sentiment === 'Positive') {
      confidence += 10;
      reason.push('News sentiment is positive');
    } else if (sentiment === 'Negative') {
      confidence -= 10;
      reason.push('Negative sentiment warning');
    }

    if (earnings === 'Positive') {
      confidence += 8;
      reason.push('Strong earnings impact');
    } else if (earnings === 'Negative') {
      confidence -= 8;
      reason.push('Weak earnings report');
    }

    if (sector === 'Strong') {
      confidence += 5;
      reason.push('Sector showing momentum');
    }

    if (candle.pattern && candle.bias === direction) {
      confidence += 6;
      reason.push(`Pattern: ${candle.pattern}`);
    }

    // ⛔ Skip if low confidence or unknown direction
    if (confidence < 60 || direction === 'Neutral') continue;

    signals.push({
      stock: stock.symbol,
      direction,
      confidence: Math.min(confidence, 100),
      timeframe: '5m',
      entry: stock.lastPrice,
      exit: direction === 'Long'
        ? (stock.lastPrice * 1.015).toFixed(2)
        : (stock.lastPrice * 0.985).toFixed(2),
      volume: volume.level,
      rsi: rsi.value,
      newsSentiment: sentiment,
      sectorSentiment: sector,
      earningsImpact: earnings,
      reason: reason.join(', ')
    });
  }

  return signals;
}
