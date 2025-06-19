// pages/api/signals.js

import { generateSignalFromData } from '../../lib/aiSignalEngine';
import { preProcessData } from '../../lib/preProcessData';
import { fetchNSEData } from '../../lib/fetchNSEData'; // This fetches live stock data

export default async function handler(req, res) {
  try {
    // Step 1: Fetch raw stock data (live from NSE/BSE or fallback API)
    const rawStockData = await fetchNSEData();

    // Step 2: Preprocess (clean + structure)
    const processedData = preProcessData(rawStockData);

    // Step 3: Generate signals using AI engine
    const signals = generateSignalFromData(processedData);

    // Step 4: Return as API response
    res.status(200).json(signals);
  } catch (error) {
    console.error('Error generating signals:', error);
    res.status(500).json({ error: 'Failed to generate trading signals' });
  }
}
