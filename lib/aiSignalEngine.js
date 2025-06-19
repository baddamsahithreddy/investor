// lib/aiSignalEngine.js
import { getVolumeScore } from '../utils/getVolumeData';
import { getRSIScore } from '../utils/rsiAnalysis';
import { getCandlePatternScore } from '../utils/candlePatterns';
import { getNewsSentimentScore } from '../utils/fetchNews';
import { getEarningsScore } from '../utils/earningsData';
import { getPriceAction } from '../utils/priceAction';
import { getSectorSentiment } from '../utils/sectorSentiment';

export function generateSignalFromData(processedData) {
  const finalSignals = [];

  for (const stock of processedData) {
    const {
      symbol,
      lastPrice,
      volumeData,
      priceHistory,
      sector,
    } = stock;

    try {
      const volumeScore = getVolumeScore(volumeData);
      const rsiScore = getRSIScore(priceHistory);
      const candle = getCandlePatternScore(priceHistory);
      const sentiment = getNewsSentimentScore(symbol);
      const earnings = getEarningsScore(symbol);
      const priceAction = getPriceAction(symbol);
      const sectorScore = getSectorSentiment(sector);

      const confidence =
        volumeScore * 0.2 +
        rsiScore * 0.2 +
        candle.score * 0.1 +
        sentiment.score * 0.2 +
        earnings.score * 0.1 +
        sectorScore * 0.1 +
        priceAction.score * 0.1;

      finalSignals.push({
        stock: symbol,
        direction: candle.direction,
        confidence: Math.round(confidence),
        timeframe: "5m",
        entry: lastPrice,
        exit: (lastPrice * 1.012).toFixed(2),
        volume: volumeScore > 70 ? "High" : "Moderate",
        rsi: rsiScore,
        newsSentiment: sentiment.sentiment,
        earningsImpact: earnings.impact,
        sectorSentiment: sectorScore.sentiment,
        support: priceAction.support,
        resistance: priceAction.resistance,
        reason: candle.reason || "Mixed indicators",
        date: new Date().toISOString().slice(0, 10),
      });
    } catch (e) {
      console.warn(`Error scoring ${symbol}:`, e.message);
    }
  }

  return finalSignals;
}
