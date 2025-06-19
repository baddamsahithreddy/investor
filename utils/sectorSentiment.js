// utils/sectorSentiment.js

/**
 * Aggregates sector-level sentiment using stock-level performance
 * Returns a map like: { "IT": "Positive", "BANK": "Neutral", ... }
 */

export function analyzeSectorSentiment(processedStocks) {
  const sectorMap = {};

  processedStocks.forEach(stock => {
    const { sector, priceHistory } = stock;

    if (!sector || !priceHistory || priceHistory.length < 2) return;

    const latestPrice = priceHistory[priceHistory.length - 1];
    const prevPrice = priceHistory[0];

    const gain = ((latestPrice - prevPrice) / prevPrice) * 100;

    if (!sectorMap[sector]) {
      sectorMap[sector] = { gainSum: 0, count: 0 };
    }

    sectorMap[sector].gainSum += gain;
    sectorMap[sector].count += 1;
  });

  const sentimentMap = {};

  for (const [sector, data] of Object.entries(sectorMap)) {
    const avgGain = data.gainSum / data.count;

    if (avgGain > 1.5) {
      sentimentMap[sector] = 'Positive';
    } else if (avgGain < -1) {
      sentimentMap[sector] = 'Negative';
    } else {
      sentimentMap[sector] = 'Neutral';
    }
  }

  return sentimentMap;
}
