// pages/index.js
import React, { useEffect, useState } from "react";

export default function Home() {
  const [signals, setSignals] = useState([]);
  const [dateStr, setDateStr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    setDateStr(formatted);

    async function fetchData() {
      try {
        const res = await fetch("/api/signals");
        const data = await res.json();
        setSignals(data);
      } catch (err) {
        console.error("Error fetching signals:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const isTodayMidnightPast = () => {
    const now = new Date();
    return now.getHours() >= 0 && now.getHours() < 9;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>LogicalInvestor Dashboard</h1>
      <p style={{ textAlign: "center" }}>AI-powered Intraday Trading Assistant</p>
      <p style={{ textAlign: "center", fontWeight: 500 }}>Date: {dateStr}</p>

      {loading ? (
        <p>Loading signals...</p>
      ) : isTodayMidnightPast() && signals.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          🔄 Market closed. Signals for today will be available after 9:15 AM.  
        </p>
      ) : signals.length > 0 ? (
        <>
          <h2>Intraday Trade Signals</h2>
          <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Direction</th>
                <th>Confidence</th>
                <th>Timeframe</th>
                <th>Entry</th>
                <th>Exit</th>
                <th>Volume</th>
                <th>RSI</th>
                <th>News Sentiment</th>
                <th>Sector Sentiment</th>
                <th>Earnings Impact</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((s, i) => (
                <tr key={i}>
                  <td>{s.stock}</td>
                  <td>{s.direction}</td>
                  <td>{s.confidence}%</td>
                  <td>{s.timeframe}</td>
                  <td>{s.entry}</td>
                  <td>{s.exit}</td>
                  <td>{s.volume}</td>
                  <td>{s.rsi}</td>
                  <td>{s.newsSentiment}</td>
                  <td>{s.sectorSentiment || "—"}</td>
                  <td>{s.earningsImpact}</td>
                  <td>{s.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ marginTop: "20px" }}>
            🔍 <a href="/history">See previous signals →</a>
          </p>
        </>
      ) : (
        <p style={{ textAlign: "center" }}>No signals available for today.</p>
      )}
    </div>
  );
}
