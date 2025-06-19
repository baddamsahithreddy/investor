import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Past Trade Recommendations</h1>
      {history.length === 0 ? (
        <p>Loading...</p>
      ) : (
        history.map((day, index) => (
          <div key={index} style={{ marginBottom: "30px" }}>
            <h2>{day.date}</h2>
            <table
              border="1"
              cellPadding="10"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
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
                  <th>News</th>
                  <th>Sector</th>
                  <th>Earnings</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {day.signals.map((signal, idx) => (
                  <tr key={idx}>
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
