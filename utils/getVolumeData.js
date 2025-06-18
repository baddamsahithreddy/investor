// utils/getVolumeData.js
// Compares today's volume with the average volume of the past 5 trading days

export function analyzeVolumeSpikes(stockOHLCMap) {
  const volumeSignals = {};

  Object.entries(stockOHLCMap).forEach(([stock, ohlcData]) => {
    const todayData = ohlcData[ohlcData.length - 1];
    const pastVolumes = ohlcData.slice(0, -1).map(day => day.volume);

    const avgVolume = pastVolumes.reduce((a, b) => a + b, 0) / pastVolumes.length;

    if (avgVolume === 0) {
      volumeSignals[stock] = { spike: false, spikeRatio: 0 };
      return;
    }

    const spikeRatio = todayData.volume / avgVolume;
    volumeSignals[stock] = {
      spike: spikeRatio > 1.5,
      spikeRatio: parseFloat(spikeRatio.toFixed(2)),
      currentVolume: todayData.volume,
      averageVolume: parseInt(avgVolume)
    };
  });

  return volumeSignals;
}
