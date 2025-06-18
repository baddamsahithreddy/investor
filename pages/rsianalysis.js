// utils/rsiAnalysis.js

import axios from 'axios';

/**
 * Calculates RSI from historical price data
 * Formula source: https://www.investopedia.com/terms/r/rsi.asp
 */
export async function getRSI(stockSymbol) {
  try {
    const url = `https://priceapi.moneycontrol.com/techCharts/indianMarket/stock/history?symbol=${stockSymbol}&resolution=1D&from=${getFromDate()}&to=${getToDate()}`;

    const response = await axios.get(url);
    const prices = response.data.c; // closing prices

    if (!prices || prices.length < 15) {
      throw new Error("Insufficient price data for RSI");
    }

    const rsi = calculateRSI(prices);

    let zone = 'Neutral';
    if (rsi > 70) zone = 'Overbought';
    else if (rsi < 30) zone = 'Oversold';

    return { rsi: Math.round(rsi), zone };
  } catch (error) {
    console.error(`RSI fetch failed for ${stockSymbol}:`, error);
    return { rsi: null, zone: 'Unknown' };
  }
}

function calculateRSI(closingPrices, period = 14) {
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = closingPrices[i] - closingPrices[i - 1];
    if (change > 0) gains += change;
    else losses -= change; // change is negative
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  const rs = avgGain / (avgLoss || 1);
  const rsi = 100 - 100 / (1 + rs);
  return rsi;
}

function getFromDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return Math.floor(date.getTime() / 1000);
}

function getToDate() {
  return Math.floor(Date.now() / 1000);
}
