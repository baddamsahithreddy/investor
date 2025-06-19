// utils/insiderDeals.js

import axios from 'axios';

/**
 * Fetches recent insider, block, or bulk deal trades from NSE or available sources
 * Returns list of interesting stocks with deal type, quantity and price info
 */
export async function getInsiderDeals() {
  try {
    const url = `https://www.nseindia.com/api/corporate-announcements?index=equities`; // Mock URL for demonstration

    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.nseindia.com/',
    };

    const response = await axios.get(url, { headers });
    const data = response.data || [];

    // Example filter: only insider or block deals
    const filtered = data.filter((item) => {
      return (
        item.announcementTitle?.toLowerCase().includes("insider") ||
        item.announcementTitle?.toLowerCase().includes("bulk deal") ||
        item.announcementTitle?.toLowerCase().includes("block deal")
      );
    });

    return filtered.map((deal) => ({
      stock: deal.symbol || deal.companyName,
      type: deal.announcementTitle,
      date: deal.announcementDate,
      quantity: deal.quantity || 'N/A',
      price: deal.price || 'N/A',
    }));
  } catch (error) {
    console.error('Insider deal fetch failed:', error);
    return [];
  }
}
