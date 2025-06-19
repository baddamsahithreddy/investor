export function getVolumeSpike(symbol, volumeData) {
  if (!volumeData || volumeData.length < 5) {
    return { status: 'Unknown' };
  }

  const recent = volumeData[volumeData.length - 1];
  const avg = volumeData.slice(0, -1).reduce((a, b) => a + b, 0) / (volumeData.length - 1);

  return {
    status: recent > avg * 1.5 ? 'High' : 'Normal',
    recent,
    average: avg
  };
}
