// utils/sectorSentiment.js

import axios from 'axios';
import sectorMap from '../data/sectorMap.json';

/**
 * Analyze sector sentiment using sector performance and news
 */
export async function getSectorSentiment(stockSymbol) {
  try {
    const sector = sectorMap[stockSymbol.toUpperCase()];
    if (!sector) throw new Error("Sector mapping not found");

    // Dummy endpoint for sector performance (Replace with a real one or scrape)
    const url = `https://api.moneycontrol.com/sector/performance?sector=${encodeURIComponent(sector)}`;
    const response = await axios.get(url);

    const performance = response.data?.performanceScore || 0;

    let sentiment = 'Neutral';
    if (performance > 1) sentiment = 'Positive';
    else if (performance < -1) sentiment = 'Negative';

    return {
      sector,
      sentiment,
    };
  } catch (error) {
    console.error(`Sector sentiment fetch failed for ${stockSymbol}:`, error.message);
    return {
      sector: null,
      sentiment: 'Unknown',
    };
  }
}
