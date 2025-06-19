// utils/fetchNews.js

import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/everything';

/**
 * Fetch latest financial news related to Indian stocks or sectors
 * Used for news sentiment analysis
 */
export async function fetchLatestNews(query = "Indian stock market") {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 10,
        apiKey: NEWS_API_KEY,
      },
    });

    const articles = response.data.articles.map((article) => ({
      title: article.title,
      source: article.source.name,
      publishedAt: article.publishedAt,
      url: article.url,
      sentiment: analyzeSentiment(article.title), // optional quick sentiment logic
    }));

    return articles;
  } catch (error) {
    console.error("Failed to fetch news:", error.message);
    return [];
  }
}

/**
 * Simple sentiment analyzer for headlines
 * Later can be replaced with better NLP model
 */
function analyzeSentiment(text) {
  const lower = text.toLowerCase();
  if (lower.includes("gain") || lower.includes("surge") || lower.includes("profit") || lower.includes("up")) return "Positive";
  if (lower.includes("loss") || lower.includes("fall") || lower.includes("down") || lower.includes("crash")) return "Negative";
  return "Neutral";
}
