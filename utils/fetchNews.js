// utils/fetchNews.js
import axios from 'axios';

export async function fetchNews(stockSymbol) {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    const url = `https://newsapi.org/v2/everything?q=${stockSymbol}&sortBy=publishedAt&apiKey=${apiKey}&language=en`;

    const response = await axios.get(url);
    const articles = response.data.articles;

    return articles.map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      publishedAt: a.publishedAt,
      source: a.source.name,
    }));
  } catch (error) {
    console.error("News fetch error:", error.message);
    return [];
  }
}
