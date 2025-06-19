// utils/sentimentUtils.js

/**
 * A basic sentiment analysis for stock news headlines/descriptions.
 * Can be upgraded to use ML later.
 */

const positiveKeywords = [
  "profit", "growth", "record", "expansion", "acquisition", "strong", "beats", "surge", "up", "gain", "bullish", "rises"
];

const negativeKeywords = [
  "loss", "fall", "drop", "decline", "misses", "cut", "weak", "bearish", "down", "slump", "delay", "negative"
];

export function analyzeSentiment(newsArticles = []) {
  let score = 0;

  newsArticles.forEach((article) => {
    const text = (article.title + " " + article.description).toLowerCase();

    positiveKeywords.forEach((keyword) => {
      if (text.includes(keyword)) score += 1;
    });

    negativeKeywords.forEach((keyword) => {
      if (text.includes(keyword)) score -= 1;
    });
  });

  if (score > 2) return "Positive";
  if (score < -2) return "Negative";
  return "Neutral";
}
