// pages/history.js
import React, { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch("/api/history");
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>📊 Past Intraday Signals</h1>
      <p style={{ textAlign: "center" }}>View all previous day’s trade ideas for backtesting and analysis.</p>

      {loading ? (
        <p>Loading history...</p>
      ) : history.length === 0 ? (
        <p>No historical data available yet.</p>
      ) : (
        history.map((day, i) => (
          <div key={i} style={{ marginBottom: "40px" }}>
