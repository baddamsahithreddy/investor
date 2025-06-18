// pages/api/signals.js
import fetch from 'node-fetch';
import { generateSignalFromData } from '../../lib/aiSignalEngine';
import { preProcessData } from '../../lib/preProcessData';
import { fetchNSEData } from '../../lib/fetchNSEData';

export default async function handler(req, res) {
  try {
    // Step 1: Fetch raw stock data
    const stockData = await fetchNSEData(); // This will use fallback APIs internally

    // Step 2: Pre-process the data (normalize, structure, etc.)
    const processedData = preProcessData(stockData);

    // Step 3: Generate AI signals
    const signals = generateSignalFromData(processedData);

    // Step 4: Return as JSON
    res.status(200).json(signals);
  } catch (error) {
    console.error("API Error in /api/signals:", error);
    res.status(500).json({ error: 'Failed to generate signals' });
  }
}
