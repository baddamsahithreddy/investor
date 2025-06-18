// pages/history.js
import React, { useEffect, useState } from "react";

export default function History() {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch("/data/history.json");
        const data = await response.json();
        setHistoryData(data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>📜 Past Intraday Trade Signals</h1>
      {historyData.length === 0 ? (
        <p style={{ textAlign: "center" }}>Loading past trades...</p>
      ) : (
        historyData.map((day, idx) => (
          <div key={idx} style={{ marginBottom: "40px" }}>
            <h2>{day.date}</h2>
            <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Direction</th>
                  <th>Confidence</th>
                  <th>Timeframe</th>
                  <th>Entry</th>
                  <th>Exit</th>
                  <th>Volume Spike</th>
                  <th>RSI</th>
                  <th>News Sentiment</th>
                  <th>Sector Sentiment</th>
                  <th>Earnings Impact</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {day.signals.map((signal, i) => (
                  <tr key={i}>
                    <td>{signal.stock}</td>
                    <td>{signal.direction}</td>
                    <td>{signal.confidence}%</td>
                    <td>{signal.timeframe}</td>
                    <td>{signal.entry}</td>
                    <td>{signal.exit}</td>
                    <td>{signal.volume}</td>
                    <td>{signal.rsi}</td>
                    <td>{signal.newsSentiment}</td>
                    <td>{signal.sectorSentiment}</td>
                    <td>{signal.earningsImpact}</td>
                    <td>{signal.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
