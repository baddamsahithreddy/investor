// utils/rsiAnalysis.js

export function calculateRSI(closes, period = 14) {
  if (!closes || closes.length <= period) {
    return { rsi: null, signal: "Not enough data" };
  }

  let gains = 0;
  let losses = 0;

  // Initial average gain/loss
  for (let i = 1; i <= period; i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Smooth the averages
  for (let i = period + 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) - change) / period;
    }
  }

  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);

  let signal = "Neutral";
  if (rsi > 70) signal = "Overbought";
  else if (rsi < 30) signal = "Oversold";

  return {
    rsi: parseFloat(rsi.toFixed(2)),
    signal
  };
}
