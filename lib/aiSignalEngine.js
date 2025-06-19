// lib/aiSignalEngine.js

import { getRSIAnalysis } from '../utils/rsiAnalysis';
import { getVolumeData } from '../utils/getVolumeData';
import { getPriceAction } from '../utils/priceAction';
import { getCandlePattern } from '../utils/candlePatterns';
import { fetchLatestNews } from '../utils/fetchNews';
import { getEarningsImpact } from '../utils/earningsData';
import { getSectorSentiment } from '../utils/sectorSentiment';

/**
 * Core AI Signal Engine
 * Accepts cleaned stock data & runs multi-factor analysis to generate trade signals
 */
export async function generateSignalFromData(stockDataList = []) {
  const results = [];

  for (const stock of stockDataList) {
    const { symbol, lastPrice, volumeData, priceHistory, sector } = stock;

    try {
      // Run individual analyses
      const rsi = await getRSIAnalysis(priceHistory);
      const volume = await getVolumeData(symbol);
      const price = await getPriceAction(symbol);
      const candle = await getCandlePattern(priceHistory);
      const news = await fetchLatestNews(symbol);
      const earnings = await getEarningsImpact(symbol);
      const sectorInfo = await getSectorSentiment(sector, [symbol]);

      // Sentiment scoring
      const sentiment = computeNewsSentiment(news);
      const confidence = computeConfidence({ rsi, volume, price, candle, sentiment, earnings, sectorInfo });

      if (confidence < 65) continue; // Skip weak signals

      const direction = getTradeDirection(rsi, price, candle);

      results.push({
        stock: symbol,
        direction,
        confidence,
        timeframe: '5m',
        entry: lastPrice,
        exit: direction === 'Long' ? (lastPrice * 1.015).toFixed(2) : (lastPrice * 0.985).toFixed(2),
        volume: volume?.level || 'Unknown',
        rsi: rsi?.value || 50,
        newsSentiment: sentiment,
        sectorSentiment: sectorInfo?.tag || 'Neutral',
        earningsImpact: earnings?.impact || 'Neutral',
        reason: `Based on ${cand
