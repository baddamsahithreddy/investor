// pages/index.js
import React, { useEffect, useState } from "react";

export default function Home() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSignals() {
      try {
        const response = await fetch("/api/signals");
        if (!response.ok) throw new Error("Failed to fetch signals");
        const data = await response.json();
        setSignals(data);
      } catch (err) {
        setError("Unable to load signals. Please try again later.");
        console.error("Signal fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSignals();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>LogicalInvestor Dashboard</h1>
      <p style={{ textAlign: "center" }}>AI-powered Intraday Trading Assistant</p>

      {loading && <p>Loading today's signals...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && signals.length > 0 && (
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
          <tbody>
  {signals.map((signal, i) => (
    <tr key={i}>
      <td>{signal.stock}</td>
      <td>{signal.direction}</td>
      <td>{signal.confidence}%</td>
      <td>{signal.timeframe}</td>
      <td>{signal.entry}</td>
      <td>{signal.exit}</td>
      <td>{signal.volume}</td>
      <td>{signal.rsi}</td>

      {/* Safely stringify if still object */}
      <td>{JSON.stringify(signal.newsSentiment || "-")}</td>
      <td>{JSON.stringify(signal.sectorSentiment || "-")}</td>
      <td>{JSON.stringify(signal.earningsImpact || "-")}</td>

      <td>{signal.reason}</td>
    </tr>
  ))}
</tbody>
        </table>
      )}

      {!loading && !error && signals.length === 0 && (
        <p>No signals generated for today. Please check back later.</p>
      )}
    </div>
  );
}
