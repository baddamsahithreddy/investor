// utils/candlePatterns.js

/**
 * Detects candlestick patterns from OHLC data
 */
export function detectCandlePattern(ohlc) {
  const patterns = [];

  ohlc.forEach((bar, index) => {
    const { open, high, low, close } = bar;
    const body = Math.abs(close - open);
    const range = high - low;
    const upperShadow = high - Math.max(open, close);
    const lowerShadow = Math.min(open, close) - low;

    // Doji: Small body, large shadow
    if (body / range < 0.1) {
      patterns.push({ index, pattern: 'Doji' });
    }

    // Hammer: Small body, long lower shadow
    if (body / range < 0.3 && lowerShadow > 2 * body) {
      patterns.push({ index, pattern: 'Hammer' });
    }

    // Shooting Star: Small body, long upper shadow
    if (body / range < 0.3 && upperShadow > 2 * body) {
      patterns.push({ index, pattern: 'Shooting Star' });
    }

    // Engulfing (Bullish/Bearish)
    if (index > 0) {
      const prev = ohlc[index - 1];
      if (open < close && prev.open > prev.close && open < prev.close && close > prev.open) {
        patterns.push({ index, pattern: 'Bullish Engulfing' });
      } else if (open > close && prev.open < prev.close && open > prev.close && close < prev.open) {
        patterns.push({ index, pattern: 'Bearish Engulfing' });
      }
    }
  });

  return patterns;
}
