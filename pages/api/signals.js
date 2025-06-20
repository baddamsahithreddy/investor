import { fetchNSEData } from '../../lib/fetchNSEData';
import { preProcessData } from '../../lib/preProcessData';
import { generateSignalFromData } from '../../lib/aiSignalEngine';

export default async function handler(req, res) {
  try {
    const stockData = await fetchNSEData();

    console.log("📦 Raw stock data fetched:", stockData.length);  // ADD THIS

    const processedData = preProcessData(stockData);

    console.log("🧪 Processed data for signal engine:", processedData.length);  // ADD THIS

    const signals = await generateSignalFromData(processedData);

    console.log("📊 Final generated signals:", signals.length);  // ADD THIS

    res.status(200).json(signals);
  } catch (error) {
    console.error("❌ Signal API Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
