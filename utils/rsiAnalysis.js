export function getRSI(symbol, prices) {
  // Basic RSI calculation for the last 14 periods
  if (!prices || prices.length < 15) {
    return { value: 50 }; // neutral fallback
  }

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= 14; i++) {
    const diff = prices[prices.length - i] - prices[prices.length - i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  const avgGain = gains / 14;
  const avgLoss = losses / 14;

  if (avgLoss === 0) return { value: 100 };

  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);

  return { value: parseFloat(rsi.toFixed(2)) };
}
