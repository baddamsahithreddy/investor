// lib/aiSignalEngine.js

import { getVolumeSpike } from '../utils/getVolumeData';
import { getRSI } from '../utils/rsiAnalysis';
import { getPriceAction } from '../utils/priceAction';
import { getNewsSentiment } from '../utils/fetchNews';
import { getEarningsImpact } from '../utils/earningsData';
import { getSectorSentiment } from '../utils/sectorSentiment';
import { detectCandlestickPattern } from '../utils/candlePatterns';

export function generateSignalFromData(preprocessedStocks = []) {
  const signals = [];

  for (const stock of preprocessedStocks) {
    const { symbol, lastPrice, volumeData, priceHistory, sector } = stock;

    // === Call analysis utils ===
    const volumeSpike = getVolumeSpike(volumeData);
    const rsi = getRSI(priceHistory);
    const priceAction = getPriceAction(priceHistory);
    const newsSentiment = getNewsSentiment(symbol);
    const earningsImpact = getEarningsImpact(symbol);
    const sectorSent = getSectorSentiment(sector);
    const candle = detectCandlestickPattern(priceHistory);

    // === Apply AI logic (simple weight system for now) ===
    let confidence = 0;

    if (volumeSpike === 'High') confidence += 20;
    if (priceAction === 'Breakout') confidence += 20;
    if (rsi < 30 || rsi > 70) confidence += 10;
    if (newsSentiment === 'Positive') confidence += 15;
    if (earningsImpact === 'Positive') confidence += 10;
    if (sectorSent === 'Positive') confidence += 10;
    if (candle === 'BullishEngulfing' || candle === 'Hammer') confidence += 15;

    const direction = rsi < 30 || candle === 'BullishEngulfing' ? 'Long' : 'Short';

    signals.push({
      stock: symbol,
      direction,
      confidence: Math.min(confidence, 99),
      timeframe: "5m",
      entry: lastPrice,
      exit: direction === 'Long' ? lastPrice * 1.02 : lastPrice * 0.98,
      volume: volumeSpike,
      rsi,
      newsSentiment,
      earningsImpact,
      sectorSentiment: sectorSent,
      reason: `AI-weighted: ${volumeSpike} volume, RSI ${rsi}, ${priceAction}, ${newsSentiment} news`,
    });
  }

  return signals;
}
