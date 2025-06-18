// pages/index.js
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [signals, setSignals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = today.getHours();
  const isMidnight = hour < 9; // before market opens

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/signals");
        const data = await response.json();
        setSignals(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch signals:", error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>LogicalInvestor Dashboard</h1>
      <p style={{ textAlign: "center" }}>AI-powered Intraday Trading Assistant</p>
      <p style={{ textAlign: "center", marginBottom: "20px" }}>Date: {dateStr}</p>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Link href="/history"><button style={{ padding: "10px 20px", fontSize: "16px" }}>📜 View Past Trades</button></Link>
      </div>

      <div>
        <h2>Intraday Trade Signals</h2>
        {isMidnight ? (
          <p>⚠️ Analysis for today is in progress. Please check back after 9:15 AM.</p>
        ) : isLoading ? (
          <p>Loading signals...</p>
        ) : signals.length === 0 ? (
          <p>No signals available.</p>
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
