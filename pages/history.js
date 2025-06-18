// pages/history.js
import React, { useEffect, useState } from "react";

export default function TradeHistory() {
  const [history, setHistory] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/data/history.json");
        const data = await res.json();
        setHistory(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load trade history:", err);
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>📜 Past Intraday Trade History</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : Object.keys(history).length === 0 ? (
        <p>No history data available.</p>
      ) : (
        Object.entries(history).map(([date, trades], idx) => (
          <div key={idx} style={{ marginBottom: "30px" }}>
            <h3 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>{date}</h3>
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
                {trades.map((trade, index) => (
                  <tr key={index}>
                    <td>{trade.stock}</td>
                    <td>{trade.direction}</td>
                    <td>{trade.confidence}%</td>
                    <td>{trade.timeframe}</td>
                    <td>{trade.entry}</td>
                    <td>{trade.exit}</td>
                    <td>{trade.volume}</td>
                    <td>{trade.rsi}</td>
                    <td>{trade.newsSentiment}</td>
                    <td>{trade.sectorSentiment}</td>
                    <td>{trade.earningsImpact}</td>
                    <td>{trade.reason}</td>
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
