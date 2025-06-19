// utils/sectorSentiment.js

import axios from 'axios';
import sectorMap from '../data/sectorMap.json';

/**
 * Analyzes sentiment per sector based on news headlines and price momentum
 */
export async function getSectorSentiment(stockSymbol) {
  try {
    const sector = sectorMap[stockSymbol] || 'Unknown';
    if (sector === 'Unknown') return { sector, sentiment: 'Neutral' };

    // 1. Fetch sector-wise recent stock performance (simplified mock logic)
    const sectorPerformance = await fetchSectorPerformance(sector);

    // 2. Fetch recent sector-related news sentiment
    const newsSentiment = await fetchSectorNewsSentiment(sector);

    // 3. Combine logic to determine overall sector sentiment
    let sentiment = 'Neutral';
    if (sectorPerformance === 'Bullish' && newsSentiment === 'Positive') {
      sentiment = 'Strong Positive';
    } else if (sectorPerformance === 'Bearish' && newsSentiment === 'Negative') {
      sentiment = 'Strong Negative';
    } else if (newsSentiment === 'Positive') {
      sentiment = 'Positive';
    } else if (newsSentiment === 'Negative') {
      sentiment = 'Negative';
    }

    return { sector, sentiment };
  } catch (error) {
    console.error(`Sector sentiment error for ${stockSymbol}:`, error);
    return { sector: 'Unknown', sentiment: 'Neutral' };
  }
}

// Example: Dummy price momentum logic (replace with real sector indices API or data if available)
async function fetchSectorPerformance(sector) {
  const bullishSectors = ['IT', 'Banking', 'Auto'];
  const bearishSectors = ['Metals', 'Energy'];

  if (bullishSectors.includes(sector)) return 'Bullish';
  if (bearishSectors.includes(sector)) return 'Bearish';
  return 'Neutral';
}

// Example: Use free news API or headlines database
async function fetchSectorNewsSentiment(sector) {
  try {
    // Mocking news sentiment per sector for now
    const sentimentMap = {
      IT: 'Positive',
      Banking: 'Positive',
      Pharma: 'Negative',
      Metals: 'Neutral',
      Energy: 'Negative'
    };
    return sentimentMap[sector] || 'Neutral';
  } catch (err) {
    return 'Neutral';
  }
}
