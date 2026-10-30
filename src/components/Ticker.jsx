const ITEMS = [
  "Development", "✧", "Pixels", "✧", "Websites", "✧",
  "Designing", "✧", "Animations", "✧", "Community", "✧",
  "Angular", "✧", "TypeScript", "✧", "Healthcare", "✧",
  "AI Platforms", "✧", "EdTech", "✧",
];

export default function Ticker() {
  const row = ITEMS.concat(ITEMS).concat(ITEMS);
  return (
    <div style={{
      overflow: "hidden", whiteSpace: "nowrap",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      padding: "18px 0", position: "relative",
    }}>
      <div style={{
        display: "inline-flex", gap: 32,
        animation: "tickerScroll 30s linear infinite",
        willChange: "transform",
      }}>
        {row.map((item, i) => (
          <span key={i} style={{
            fontSize: 14, fontWeight: item === "✧" ? 400 : 500,
            color: item === "✧" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.35)",
            letterSpacing: "1px", textTransform: "uppercase",
            fontFamily: "'Inter', sans-serif",
          }}>{item}</span>
        ))}
      </div>
    </div>
  );
}
