// pages/history.js
import React, { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch("/data/history.json");
        const data = await response.json();
        setHistory(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch trade history", err);
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>📜 Historical Trade Signals</h1>
      {loading ? (
        <p>Loading history...</p>
      ) : Object.keys(history).length === 0 ? (
        <p>No past trades found.</p>
      ) : (
        Object.entries(history).map(([date, trades]) => (
          <div key={date} style={{ marginBottom: "40px" }}>
            <h2>{date}</h2>
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
                {trades.map((signal, index) => (
                  <tr key={index}>
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
