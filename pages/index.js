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

      {/* Safely handle newsSentiment */}
      <td>
        {typeof signal.newsSentiment === "string"
          ? signal.newsSentiment
          : signal.newsSentiment?.summary || "N/A"}
      </td>

      {/* Safely handle sectorSentiment */}
      <td>
        {typeof signal.sectorSentiment === "object" && signal.sectorSentiment !== null
          ? `${signal.sectorSentiment.sector || "?"} - ${signal.sectorSentiment.sentiment || "?"}`
          : signal.sectorSentiment || "N/A"}
      </td>

      {/* Safely handle earningsImpact */}
      <td>
        {typeof signal.earningsImpact === "object" && signal.earningsImpact !== null
          ? `${signal.earningsImpact.type || "?"} (${signal.earningsImpact.effect || "?"})`
          : signal.earningsImpact || "N/A"}
      </td>

      <td>{signal.reason}</td>
    </tr>
  ))}
</tbody>
