// pages/api/signals.js

import { fetchNSEData } from '../../lib/fetchNSEData';
import { preProcessData } from '../../lib/preProcessData';
import { generateSignalFromData } from '../../lib/aiSignalEngine';

export default async function handler(req, res) {
  try {
    // Step 1: Fetch raw stock data (NIFTY50, safe midcaps)
    const rawData = await fetchNSEData();

    // Step 2: Preprocess (standardize, clean)
    const cleanedData = preProcessData(rawData);

    // Step 3: Generate AI trade signals
    const signals = await generateSignalFromData(cleanedData);

    // Step 4: Respond
    res.status(200).json(signals);
  } catch (err) {
    console.error("API Error at /api/signals:", err);
    res.status(500).json({ error: "Failed to generate intraday signals." });
  }
}
