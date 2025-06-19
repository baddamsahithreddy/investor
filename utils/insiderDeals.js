// utils/insiderDeals.js

import axios from 'axios';

/**
 * Dummy version to simulate insider/bulk/block trades.
 * You can replace this with NSE/BSE scraping or paid API if needed.
 */
export async function getInsiderDealStatus(stockSymbol) {
  try {
    // Simulated data based on hardcoded examples
    const insiderBuys = ["RELIANCE", "INFY", "TCS"];
    const insiderSells = ["ZOMATO", "PAYTM"];

    if (insiderBuys.includes(stockSymbol.toUpperCase())) {
      return "Buy";
    } else if (insiderSells.includes(stockSymbol.toUpperCase())) {
      return "Sell";
    } else {
      return "Neutral";
    }

    // If you have a real API:
    // const response = await axios.get(`https://your-insider-api.com/deals?symbol=${stockSymbol}`);
    // return response.data.status;

  } catch (error) {
    console.error(`Error fetching insider deals for ${stockSymbol}:`, error);
    return "Neutral";
  }
}
