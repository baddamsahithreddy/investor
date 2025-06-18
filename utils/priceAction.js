// utils/priceAction.js

import axios from 'axios';

/**
 * Detect breakout, support/resistance for a stock using live data
 */
export async function getPriceAction(stockSymbol) {
  try {
    const url = `https://priceapi.moneycontrol.com/techCharts/indianMarket/stock/history?symbol=${stockSymbol}&resolution=5&from=${getFromDate()}&to=${getToDate()}`;
    const response = await axios.get(url);
    const prices = response.data.c;

    if (!prices || prices.length < 20) throw new Error("Insufficient data");

    const recentClose = prices[prices.length - 1];
    const support = Math.min(...prices.slice(-20));
    const resistance = Math.max(...prices.slice(-20));

    const breakout = recentClose > resistance * 1.01;
    const breakdown = recentClose < support * 0.99;

    let action = 'Range Bound';
    if (breakout) action = 'Breakout';
    else if (breakdown) action = 'Breakdown';

    return {
      support: support.toFixed(2),
      resistance: resistance.toFixed(2),
      action,
    };
  } catch (error) {
    console.error(`Price action fetch failed for ${stockSymbol}:`, error);
    return {
      support: null,
      resistance: null,
      action: 'Unknown',
    };
  }
}

function getFromDate() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return Math.floor(date.getTime() / 1000);
}

function getToDate() {
  return Math.floor(Date.now() / 1000);
}
