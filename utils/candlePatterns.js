// utils/candlePatterns.js

// Identifies candlestick patterns based on OHLC data
export function detectCandlePattern(ohlc) {
  const { open, high, low, close } = ohlc;
  const bodySize = Math.abs(close - open);
  const range = high - low;
  const upperShadow = high - Math.max(open, close);
  const lowerShadow = Math.min(open, close) - low;

  const bodyToRangeRatio = bodySize / range;

  if (bodySize < range * 0.1) {
    return "Doji"; // Very small body
  }

  // Hammer pattern: small body near top, long lower shadow
  if (bodyToRangeRatio < 0.3 && lowerShadow > 2 * bodySize && upperShadow < bodySize) {
    return "Hammer";
  }

  // Inverted Hammer: small body near bottom, long upper shadow
  if (bodyToRangeRatio < 0.3 && upperShadow > 2 * bodySize && lowerShadow < bodySize) {
    return "Inverted Hammer";
  }

  // Bullish Engulfing
  if (open < close && bodySize > range * 0.6) {
    return "Bullish Engulfing";
  }

  // Bearish Engulfing
  if (open > close && bodySize > range * 0.6) {
    return "Bearish Engulfing";
  }

  return "Neutral";
}
