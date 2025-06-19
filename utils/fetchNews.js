// utils/fetchNews.js

import axios from 'axios';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();
const NEWS_API_KEY = process.env.NEWS_API_KEY;

/**
 * Fetch news headlines and perform sentiment analysis.
 * @param {string} stockName - Company name like "TATA Steel"
 * @returns {Promise<{ sentiment: string, headline: string }>}
 */
export async function fetchNewsSentiment(stockName) {
  try {
    const url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=${encodeURIComponent(stockName)}&country=in&language=en&category=business`;
    const res = await axios.get(url);
    const articles = res.data?.results;

    if (!articles || articles.length === 0) {
      return { sentiment: 'Neutral', headline: 'No recent news found' };
    }

    const headlines = articles.slice(0, 3).map(a => a.title).join('. ');
    const score = sentiment.analyze(headlines).score;

    let sentimentLabel = 'Neutral';
    if (score > 2) sentimentLabel = 'Positive';
    else if (score < -2) sentimentLabel = 'Negative';

    return {
      sentiment: sentimentLabel,
      headline: articles[0].title
    };

  } catch (err) {
    console.error(`News fetch failed for ${stockName}:`, err.message);
    return {
      sentiment: 'Unknown',
      headline: 'Unable to fetch news'
    };
  }
}
