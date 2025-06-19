// utils/sectorSentiment.js

import axios from 'axios';

/**
 * Returns sentiment and trend for a given sector (e.g., IT, Auto, Pharma).
 * This is based on % change in sector index and mock news score (for now).
 */
export async function getSectorSentiment(sector) {
  try {
    // Mock sector index data — in a real-world case, fetch from NSE or broker API
    const sectorData = await fetchSectorIndexData(sector);

    const changePercent = sectorData.changePercent;
    const newsSentimentScore = await getNewsSentimentScore(sector); // Simulated for now

    let sentiment = 'Neutral';
    if (changePercent > 1.5 && newsSentimentScore > 0.4) sentiment = 'Positive';
    else if (changePercent < -1.5 && newsSentimentScore < -0.4) sentiment = 'Negative';

    return {
      sector,
      changePercent,
      newsSentimentScore,
      sentiment,
    };
  } catch (error) {
    console.error(`Sector sentiment failed for ${sector}:`, error);
    return {
      sector,
      changePercent: 0,
      newsSentimentScore: 0,
      sentiment: 'Unknown',
    };
  }
}

// Simulate sector index % change
async function fetchSectorIndexData(sector) {
  const dummyChanges = {
    IT: 1.8,
    Energy: -0.5,
    Auto: 0.9,
    Pharma: -1.2,
    Banks: 2.2,
    FMCG: 0.4,
  };

  return {
    sector,
    changePercent: dummyChanges[sector] || 0,
  };
}

// Simulate sentiment score based on sector name
async function getNewsSentimentScore(sector) {
  const dummyScores = {
    IT: 0.6,
    Energy: -0.2,
    Auto: 0.3,
    Pharma: -0.5,
    Banks: 0.7,
    FMCG: 0.1,
  };

  return dummyScores[sector] || 0;
}
