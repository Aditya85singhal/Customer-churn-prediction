export default function RadarIllustration() {
  // Fixed customer positions around the radar, most safe, a couple at risk —
  // illustrates the actual job of the product: scanning a base for risk.
  const dots = [
    { x: 138, y: 66, r: "low" },
    { x: 70, y: 54, r: "low" },
    { x: 150, y: 120, r: "high" },
    { x: 58, y: 130, r: "low" },
    { x: 110, y: 158, r: "mid" },
    { x: 40, y: 90, r: "low" },
    { x: 160, y: 95, r: "low" },
    { x: 100, y: 42, r: "high" },
  ] as const;

  const color = { low: "var(--risk-low)", mid: "var(--risk-mid)", high: "var(--risk-high)" };

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[280px]" aria-hidden="true">
      <circle cx="100" cy="100" r="90" stroke="var(--border)" strokeWidth="1" fill="none" />
      <circle cx="100" cy="100" r="62" stroke="var(--border)" strokeWidth="1" fill="none" />
      <circle cx="100" cy="100" r="34" stroke="var(--border)" strokeWidth="1" fill="none" />
      <line x1="100" y1="10" x2="100" y2="190" stroke="var(--border)" strokeWidth="1" />
      <line x1="10" y1="100" x2="190" y2="100" stroke="var(--border)" strokeWidth="1" />

      <g className="radar-sweep">
        <path
          d="M100,100 L100,10 A90,90 0 0,1 163.6,36.4 Z"
          fill="url(#sweepGradient)"
        />
      </g>

      <defs>
        <linearGradient id="sweepGradient" x1="100" y1="10" x2="163.6" y2="36.4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--brand)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={4} fill={color[d.r]} />
      ))}

      <circle cx="100" cy="100" r="3" fill="var(--text)" />
    </svg>
  );
}
