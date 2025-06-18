// pages/api/signals.js
export default function handler(req, res) {
  const signals = [
    {
      stock: "TATASTEEL",
      direction: "Long",
      confidence: 87,
      timeframe: "5m",
      entry: 150.45,
      exit: 153.10,
      volume: "High",
      rsi: 62,
      newsSentiment: "Positive",
      earningsImpact: "Neutral",
      reason: "High volume with bullish RSI and positive news sentiment"
    },
    {
      stock: "HINDALCO",
      direction: "Short",
      confidence: 78,
      timeframe: "15m",
      entry: 468.25,
      exit: 460.00,
      volume: "Moderate",
      rsi: 70,
      newsSentiment: "Negative",
      earningsImpact: "Negative",
      reason: "Overbought RSI and recent poor earnings report"
    },
    {
      stock: "INFY",
      direction: "Long",
      confidence: 81,
      timeframe: "10m",
      entry: 1345.60,
      exit: 1370.00,
      volume: "High",
      rsi: 55,
      newsSentiment: "Positive",
      earningsImpact: "Positive",
      reason: "Strong earnings, positive sentiment, and upward momentum"
    }
  ];

  res.status(200).json(signals);
}
