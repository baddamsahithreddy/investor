// lib/aiSignalEngine.js

import { getRSI } from '../utils/rsiAnalysis';
import { getVolumeSpike } from '../utils/getVolumeData';
import { getPriceAction } from '../utils/priceAction';
import { getCandlePattern } from '../utils/candlePatterns';
import { getEarningsImpact } from '../utils/earningsData';
import { getNewsSentiment } from '../utils/fetchNews';
import { getSectorSentiment } from '../utils/sectorSentiment';
import { getInsiderActivity } from '../utils/insiderDeals';

export async function generateSignalFromData(processedStocks = []) {
  const signals = [];

  for (const stock of processedStocks) {
    const {
      symbol,
      lastPrice,
      volumeData,
      priceHistory,
      sector,
    } = stock;

    try {
      // Run all analytics modules
      const rsi = getRSI(priceHistory);
      const volumeSpike = getVolumeSpike(volumeData);
      const priceAction = await getPriceAction(symbol);
      const candle = getCandlePattern(priceHistory);
      const earnings = await getEarningsImpact(symbol);
      const news = await getNewsSentiment(symbol);
      const sectorData = await getSectorSentiment(sector);
      const insider = await getInsiderActivity(symbol);

      // Basic scoring
      let confidence = 50;
      let direction = 'Neutral';
      let reasons = [];

      if (rsi < 35 && volumeSpike) {
        confidence += 10;
        direction = 'Long';
        reasons.push('RSI oversold + volume spike');
      } else if (rsi > 70) {
        confidence += 10;
        direction = 'Short';
        reasons.push('RSI overbought');
      }

      if (priceAction.action === 'Breakout') {
        confidence += 15;
        direction = 'Long';
        reasons.push('Breakout above resistance');
      } else if (priceAction.action === 'Breakdown') {
        confidence += 15;
        direction = 'Short';
        reasons.push('Breakdown below support');
      }

      if (candle === 'Bullish') {
        confidence += 7;
        direction = 'Long';
        reasons.push('Bullish candlestick pattern');
      } else if (candle === 'Bearish') {
        confidence += 7;
        direction = 'Short';
        reasons.push('Bearish candlestick pattern');
      }

      if (earnings.impact === 'Positive') {
        confidence += 5;
        reasons.push('Positive earnings impact');
      }

      if (news.sentiment === 'Positive') {
        confidence += 5;
        reasons.push('Positive news sentiment');
      }

      if (sectorData.sentiment === 'Positive') {
        confidence += 5;
        reasons.push('Strong sector sentiment');
      }

      if (insider.insiderType === 'Bulk Buy') {
        confidence += 5;
        reasons.push('Recent insider bulk buying');
      }

      // Final signal object
      signals.push({
        stock: symbol,
        direction,
        confidence: Math.min(confidence, 100),
        entry: lastPrice,
        exit: direction === 'Long' ? (lastPrice * 1.015).toFixed(2) : (lastPrice * 0.985).toFixed(2),
        timeframe: '5m',
        rsi,
        volume: volumeSpike ? 'High' : 'Normal',
        priceAction: priceAction.action,
        candle,
        newsSentiment: news.sentiment,
        sectorSentiment: sectorData.sentiment,
        earningsImpact: earnings.impact,
        insiderType: insider.insiderType,
        reason: reasons.join(', '),
      });

    } catch (error) {
      console.error(`Signal generation failed for ${symbol}:`, error);
    }
  }

  return signals;
}
