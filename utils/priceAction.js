// utils/priceAction.js

import axios from 'axios';

export async function getPriceAction(stockSymbol) {
  try {
    const url = `https://priceapi.moneycontrol.com/techCharts/indianMarket/stock/history?symbol=${stockSymbol}&resolution=5&from=${getFromDate()}&to=${getToDate()}`;
    const response = await axios.get(url);
    const { c: closes, h: highs, l: lows } = response.data;

    if (!
