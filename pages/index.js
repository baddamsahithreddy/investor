// pages/index.js
import React, { useEffect, useState } from "react";

export default function Home() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/signals");
      const data = await response.json();
      setSignals(data);
    }
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>LogicalInvestor Dashboard</h1>
      <p style={{ textAlign: "center" }}>Welcome! Deployment is successful.</p>
      <div>
        <h2>Intraday Trade Signals</h2>
        {signals.length === 0 ? (
          <p>Loading signals...</p>
        ) : (
          <table border="1" cellPadding="10" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Direction</th>
                <th>Confidence</th>
                <th>Timeframe</th>
                <th>Entry</th>
                <th>Exit</th>
                <th>Reason</th>
                <th>RSI</th>
                <th>Volume Spike</th>
                <th>News Sentiment</th>
                <th>Sector Sentiment</th>
                <th>Earnings Impact</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((signal, index) => (
                <tr key={index}>
                  <td>{signal.stock}</td>
                  <td>{signal.direction}</td>
                  <td>{signal.confidence}%</td>
                  <td>{signal.timeframe}</td>
                  <td>{signal.entry}</td>
                  <td>{signal.exit}</td>
                  <td>{signal.reason}</td>
                  <td>{signal.rsi}</td>
                  <td>{signal.volumeSpike}</td>
                  <td>{signal.newsSentiment}</td>
                  <td>{signal.sectorSentiment}</td>
                  <td>{signal.earningsImpact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
