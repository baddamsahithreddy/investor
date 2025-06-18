
// utils/fetchNews.js

import axios from 'axios';

const NEWS_SOURCES = [
  'moneycontrol.com',
  'economictimes.indiatimes.com',
  'reuters.com',
  'livemint.com',
  'ndtvprofit.com'
];

const API_KEY = process.env.NEWS_API_KEY; // e.g., NewsData.io or any other news API

export async function fetchNewsForStock(stockSymbol) {
  try {
    const query = `${stockSymbol} stock`;
    const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=${encodeURIComponent(query)}&country=in&language=en&category=business`;

    const response = await axios.get(url);
    const articles = response.data.results || [];

    // Sentiment summary logic (simple keyword based)
    let sentimentScore = 0;
    for (const article of articles) {
      const title = article.title.toLowerCase();
      if (title.includes('gain') || title.includes('rally') || title.includes('rise') || title.includes('up')) {
        sentimentScore++;
      } else if (title.includes('fall') || title.includes('drop') || title.includes('down') || title.includes('loss')) {
        sentimentScore--;
      }
    }

    let sentiment = 'Neutral';
    if (sentimentScore > 1) sentiment = 'Positive';
    else if (sentimentScore < -1) sentiment = 'Negative';

    return {
      sentiment,
      articles: articles.slice(0, 5).map((a) => ({ title: a.title, link: a.link }))
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      sentiment: 'Neutral',
      articles: []
    };
  }
}

