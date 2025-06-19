// utils/getVolumeData.js

/**
 * Analyze volume spikes for intraday trading.
 * Compares today's volume vs past 5-candle average.
 */
export function getVolumeSpike(volumeData = []) {
  if (!volumeData || volumeData.length < 6) {
    return {
      category: "Unknown",
      spikeRatio: 0,
      currentVolume: 0,
      averageVolume: 0
    };
  }

  const currentVolume = volumeData[volumeData.length - 1];
  const pastVolumes = volumeData.slice(0, -1);
  const averageVolume = pastVolumes.reduce((a, b) => a + b, 0) / pastVolumes.length;
  const spikeRatio = currentVolume / averageVolume;

  let category = "Low";
  if (spikeRatio > 1.5) category = "High";
  else if (spikeRatio > 1.2) category = "Moderate";

  return {
    category,                    // High, Moderate, Low
    spikeRatio: +spikeRatio.toFixed(2),
    currentVolume,
    averageVolume: Math.round(averageVolume)
  };
}

