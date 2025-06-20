export async function fetchNSEData() {
  try {
    // TODO: Replace this later with real API
    const data = [
      {
        symbol: "INFY",
        lastPrice: 1450,
        sector: "IT",
        priceHistory: [1440, 1442, 1448, 1450, 1452, 1454, 1455],
        volumeData: [12000, 12500, 13000, 13500, 14000, 15000, 16000]
      },
      {
        symbol: "TCS",
        lastPrice: 3650,
        sector: "IT",
        priceHistory: [3600, 3610, 3625, 3635, 3645, 3650],
        volumeData: [10000, 11000, 12000, 13000, 15000, 16000]
      }
    ];

    return data;
  } catch (error) {
    console.error("⚠️ Error fetching NSE data:", error);
    return [];
  }
}
