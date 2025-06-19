// pages/index.js
import React, { useEffect, useState } from "react";

export default function Home() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString("en-IN");
  const currentHour = new Date().getHours();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/signals");
        const data = await res.json();
        setSignals(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching signals:", err);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>LogicalInvestor Dashboard</h1>
      <p style={{ textAlign: "center" }}>
        AI-powered Intraday Trading Assistant | Date: <b>{today}</b>
      </p>

      {currentHour >= 0 && currentHour < 9 && (
        <p style={{ textAlign: "center", color: "orange" }}>
          ⚠️ Signals are being prepared for today. Please check again after 9:15 AM.
        </p>
      )}

      <div style={{ marginTop: "20px" }}>
        <h2>Intraday Trade Signals</h2>

        {loading ? (
          <p>Loading signals...</p>
        ) : signals.length === 0 ? (
          <p>No signals available yet.</p>
        ) : (
          <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f2f2f2" }}>
              <tr>
                <th>Stock</th>
                <th>Direction</th>
                <th>Confidence</th>
                <th>Timeframe</th>
                <th>Entry</th>
                <th>Exit</th>
                <th>Volume</th>
                <th>RSI</th>
                <th>News</th>
                <th>Sector Sentiment</th>
                <th>Earnings</th>
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

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <a href="/history" style={{ color: "#0070f3", textDecoration: "underline" }}>
          📊 View Past Signal History
        </a>
      </div>
    </div>
  );
}
