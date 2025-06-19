// lib/aiSignalEngine.js

import { analyzeVolume } from '../utils/getVolumeData';
import { getRSI } from '../utils/rsiAnalysis';
import { getPriceAction } from '../utils/priceAction';
import { detectPatterns } from '../utils/candlePatterns';
import { fetchNewsSentiment } from '../utils/fetchNews';
import { getEarningsImpact } from '../utils/earningsData';
import { getSectorSentiment } from '../utils/sectorSentiment';

export async function generateSignalFromData(processedData = []) {
  const results = [];

  for (const stock of processedData) {
    try {
      const [
        volumeScore,
        rsiResult,
        priceAction,
        pattern,
        news,
        earnings,
        sector,
      ] = await Promise.all([
        analyzeVolume(stock.volumeData),
        getRSI(stock.priceHistory),
        getPriceAction(stock.symbol),
        detectPatterns(stock.priceHistory),
        fetchNewsSentiment(stock.symbol),
        getEarningsImpact(stock.symbol),
        getSectorSentiment(stock.sector),
      ]);

      // Confidence scoring system (out of 100)
      let confidence = 0;
      const reasons = [];

      if (volumeScore === 'High') {
        confidence += 15;
        reasons.push('High volume detected');
      }

      if (rsiResult.zone === 'Bullish') {
        confidence += 15;
        reasons.push('RSI indicates bullish momentum');
      } else if (rsiResult.zone === 'Bearish') {
        confidence += 10;
        reasons.push('RSI indicates bearish momentum');
      }

      if (priceAction.action === 'Breakout') {
        confidence += 20;
        reasons.push('Price breakout above resistance');
      } else if (priceAction.action === 'Breakdown') {
        confidence += 15;
        reasons.push('Price breakdown below support');
      }

      if (pattern && pattern !== 'None') {
        confidence += 10;
        reasons.push(`Candlestick pattern: ${pattern}`);
      }

      if (news.sentiment === 'Positive') {
        confidence += 10;
        reasons.push('Positive news sentiment');
      } else if (news.sentiment === 'Negative') {
        confidence -= 5;
        reasons.push('Negative news sentiment');
      }

      if (earnings.impact === 'Positive') {
        confidence += 5;
        reasons.push('Strong recent earnings');
      } else if (earnings.impact === 'Negative') {
        confidence -= 5;
        reasons.push('Weak earnings impact');
      }

      if (sector.sentiment === 'Strong') {
        confidence += 10;
        reasons.push('Sector is trending strong today');
      }

      const direction = confidence >= 65 ? 'Long' : confidence <= 45 ? 'Short' : 'Neutral';

      results.push({
        stock: stock.symbol,
        direction,
        confidence,
        timeframe: '5m',
        entry: stock.lastPrice,
        exit: direction === 'Long'
          ? (stock.lastPrice * 1.02).toFixed(2)
          : (stock.lastPrice * 0.98).toFixed(2),
        volume: volumeScore,
        rsi: rsiResult.value,
        newsSentiment: news.sentiment,
        earningsImpact: earnings.impact,
        sectorSentiment: sector.sentiment,
        reason: reasons.join(', '),
      });
    } catch (err) {
      console.error(`Error generating signal for ${stock.symbol}:`, err);
    }
  }

  return results;
}
