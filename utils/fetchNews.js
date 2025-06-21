// utils/fetchNews.js
/**
 * Fetches sentiment for a stock symbol using Marketaux.
 * Returns an object: { status: "Positive"|"Negative"|"Neutral" }.
 */
export async function getNewsSentiment(symbol) {
  try {
    const now = new Date().toISOString();
    const res = await fetch(
      `https://api.marketaux.com/v1/news/all?symbols=${symbol}&filter_entities=true&published_after=${now.slice(0,10)}T00:00:00&api_token=${process.env.MARKETAUX_KEY}`
    );
    const json = await res.json();
    const entity = json.data?.[0]?.entities?.find(e => e.symbol === symbol);
    if (!entity) return { status: "Neutral" };
    return entity.sentiment_score > 0.1
      ? { status: "Positive" }
      : entity.sentiment_score < -0.1
      ? { status: "Negative" }
      : { status: "Neutral" };
  } catch (e) {
    console.error("News fetch failed:", e);
    return { status: "Neutral" };
  }
}
