// utils/rsiAnalysis.js
// Calculates RSI using closing prices and returns RSI value with signal

export function calculateRSI(closePrices, period = 14) {
  if (closePrices.length < period + 1) {
    return { rsi: null, signal: "Not enough data" };
  }

  let gains = 0, losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = closePrices[i] - closePrices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < closePrices.length; i++) {
    const diff = closePrices[i] - closePrices[i - 1];
    if (diff >= 0) {
      avgGain = (avgGain * (period - 1) + diff) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) - diff) / period;
    }
  }

  if (avgLoss === 0) return { rsi: 100, signal: "Overbought" };

  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);

  let signal = "Neutral";
  if (rsi > 70) signal = "Overbought";
  else if (rsi < 30) signal = "Oversold";

  return {
    rsi: parseFloat(rsi.toFixed(2)),
    signal
  };
}
