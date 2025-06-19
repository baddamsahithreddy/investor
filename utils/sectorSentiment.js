// utils/sectorSentiment.js

import { fetchLatestNews } from './fetchNews';
import { getVolumeData } from './getVolumeData';
import { getPriceAction } from './priceAction';

/**
 * Evaluates sentiment and momentum for a given sector
 * Combines volume, news sentiment, and price movement
 */
export async function getSectorSentiment(sector, stockList) {
  try {
    // 1. Pull news sentiment for sector
    const news = await fetchLatestNews(sector);
    const sentiments = news.map(n => n.sentiment);
    const sentimentScore = calculateSentimentScore(sentiments);

    // 2. Analyze price + volume across all stocks in this sector
    let bullish = 0, bearish = 0;
    for (const stock of stockList) {
      const volumeData = await getVolumeData(stock);
      const priceAction = await getPriceAction(stock);

      const isStrong = volumeData?.spike === true && priceAction?.action === 'Breakout';
      const isWeak = volumeData?.drop === true && priceAction?.action === 'Breakdown';

      if (isStrong) bullish++;
      else if (isWeak) bearish++;
    }

    const total = stockList.length;
    const momentumScore = (bullish - bearish) / total;

    // 3. Final decision based on both
    const overallScore = sentimentScore + momentumScore;

    let tag = 'Neutral';
    if (overallScore > 0.5) tag = 'Bullish';
    else if (overallScore < -0.5) tag = 'Bearish';

    return {
      sector,
      sentimentScore,
      momentumScore,
      tag,
    };
  } catch (error) {
    console.error(`Error in sector sentiment for ${sector}:`, error.message);
    return {
      sector,
      sentimentScore: 0,
      momentumScore: 0,
      tag: 'Unknown',
    };
  }
}

function calculateSentimentScore(sentiments) {
  const scoreMap = { Positive: 1, Neutral: 0, Negative: -1 };
  if (sentiments.length === 0) return 0;
  const total = sentiments.reduce((sum, s) => sum + (scoreMap[s] || 0), 0);
  return total / sentiments.length;
}
