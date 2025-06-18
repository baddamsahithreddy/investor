// pages/index.js
import React, { useEffect, useState } from "react";

export default function Home() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/signals");
        const data = await response.json();
        setSignals(data);
      } catch (error) {
        console.error("Failed to fetch signals:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>LogicalInvestor Dashboard</h1>
      <p style={{ textAlign: "center" }}>AI-powered Intraday Trading Assistant</p>
      <div>
        <h2>Intraday Trade Signals</h2>
        {signals.length === 0 ? (
          <p>Loading signals...</p>
        ) : (
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
              {signals.map((signal, index) => (
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
        )}
      </div>
    </div> 
  );      
}
