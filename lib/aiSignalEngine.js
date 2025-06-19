// lib/aiSignalEngine.js
import { analyzeVolumeSpike } from '../utils/getVolumeData';
import { calculateRSI } from '../utils/rsiAnalysis';
import { getEarningsImpact } from '../utils/earningsData';
import { getPriceAction } from '../utils/priceAction';
import { fetchNews } from '../utils/fetchNews';
import { analyzeSentiment } from '../utils/sentimentUtils';

export async function generateSignalFromData(stockDataArray = []) {
  const results = [];

  for (const stock of stockDataArray) {
    const {
      symbol,
      lastPrice,
      volumeData,
      priceHistory,
      sector
    } = stock;

    try {
      // 1. Volume Spike Analysis
      const volumeResult = analyzeVolumeSpike(volumeData);

      // 2. RSI Analysis
      const rsi = calculateRSI(priceHistory);

      // 3. Earnings Impact
      const earningsImpact = await getEarningsImpact(symbol);

      // 4. Price Action (breakout, resistance, etc.)
      const priceAction = await getPriceAction(symbol);

      // 5. Fetch news and calculate sentiment
      const newsArticles = await fetchNews(symbol);
      const newsSentiment = analyzeSentiment(newsArticles);

      // 6. Combine logic to decide direction
      const direction =
        newsSentiment === 'Positive' && rsi < 70 && priceAction.action === 'Breakout'
          ? 'Long'
          : newsSentiment === 'Negative' && rsi > 60 && priceAction.action === 'Breakdown'
          ? 'Short'
          : 'Neutral';

      const confidence =
        Math.min(
          100,
          Math.round(
            (volumeResult.score || 0) +
              (direction !== 'Neutral' ? 20 : 0) +
              (rsi > 70 || rsi < 30 ? 10 : 0) +
              (newsSentiment === 'Positive' ? 15 : newsSentiment === 'Negative' ? -15 : 0)
          )
        );

      results.push({
        stock: symbol,
        direction,
        confidence,
        timeframe: "5m",
        entry: parseFloat(lastPrice),
        exit:
          direction === 'Long'
            ? (lastPrice * 1.02).toFixed(2)
            : direction === 'Short'
            ? (lastPrice * 0.98).toFixed(2)
            : null,
        volume: volumeResult.label,
        rsi,
        newsSentiment,
        earningsImpact,
        priceAction,
        reason: `Based on ${volumeResult.label} volume, RSI ${rsi}, ${priceAction.action}, and ${newsSentiment} news`
      });
    } catch (error) {
      console.error(`Signal generation failed for ${symbol}:`, error.message);
    }
  }

  return results;
}
