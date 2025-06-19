// lib/aiSignalEngine.js

import { getRSI } from '../utils/rsiAnalysis';
import { getVolumeSpike } from '../utils/getVolumeData';
import { getEarningsImpact } from '../utils/earningsData';
import { getPriceAction } from '../utils/priceAction';
// import { getNewsSentiment } from '../utils/fetchNews'; // ⛔ Commented for now
import { getSectorSentiment } from '../utils/sectorSentiment';
import { getInsiderDealStatus } from '../utils/insiderDeals';

export async function generateSignalFromData(stocks) {
  const signals = [];

  for (const stock of stocks) {
    try {
      const [
        rsiData,
        volumeData,
        earningsImpact,
        priceAction,
        // newsSentiment, // ⛔ Commented for now
        sectorSentiment,
        insiderStatus,
      ] = await Promise.all([
        getRSI(stock.priceHistory),
        getVolumeSpike(stock.volumeData),
        getEarningsImpact(stock.symbol),
        getPriceAction(stock.symbol),
        // getNewsSentiment(stock.symbol), // ⛔ Commented for now
        getSectorSentiment(stock.sector),
        getInsiderDealStatus(stock.symbol),
      ]);

      const newsSentiment = "Skipped"; // Placeholder value for now ✅

      const confidence = calculateConfidence({
        rsi: rsiData.value,
        volume: volumeData.category,
        earningsImpact,
        priceAction: priceAction.action,
        newsSentiment, // still used for placeholder
        sectorSentiment,
        insiderStatus,
      });

      const direction = getTradeDirection(rsiData.value, newsSentiment, priceAction.action);

      signals.push({
        stock: stock.symbol,
        direction,
        confidence,
        timeframe: "5m",
        entry: stock.lastPrice,
        exit: calculateTargetPrice(stock.lastPrice, direction),
        volume: volumeData.category,
        rsi: rsiData.value,
        newsSentiment,
        sectorSentiment,
        earningsImpact,
        reason: buildReason(volumeData.category, rsiData.value, newsSentiment, earningsImpact, priceAction.action),
      });

    } catch (err) {
      console.warn(`Signal generation failed for ${stock.symbol}:`, err);
    }
  }

  return signals;
}

function calculateConfidence(params) {
  let score = 0;
  if (params.volume === "High") score += 15;
  if (params.rsi > 55 && params.rsi < 70) score += 15;
  // if (params.newsSentiment === "Positive") score += 15; // ⛔ Commented for now
  if (params.earningsImpact === "Positive") score += 10;
  if (params.priceAction === "Breakout") score += 20;
  if (params.sectorSentiment === "Strong") score += 15;
  if (params.insiderStatus === "Buy") score += 10;

  return Math.min(100, score);
}

function getTradeDirection(rsi, sentiment, action) {
  if (rsi > 70 || sentiment === "Negative" || action === "Breakdown") return "Short";
  return "Long";
}

function calculateTargetPrice(entry, direction) {
  const buffer = direction === "Long" ? 1.5 : -1.5;
  return +(entry + buffer).toFixed(2);
}

function buildReason(volume, rsi, sentiment, earnings, priceAction) {
  return `Volume: ${volume}, RSI: ${rsi}, News: ${sentiment}, Earnings: ${earnings}, Action: ${priceAction}`;
}
