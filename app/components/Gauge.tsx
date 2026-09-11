const R = 80;
const CX = 100;
const CY = 100;
const HALF_CIRCUMFERENCE = Math.PI * R; // ~251.33

const SEGMENTS = [
  { from: 0, to: 0.4, color: "var(--risk-low)" },
  { from: 0.4, to: 0.7, color: "var(--risk-mid)" },
  { from: 0.7, to: 1, color: "var(--risk-high)" },
];

function bandFor(t: number) {
  if (t < 0.4) return { label: "Low risk", color: "var(--risk-low)" };
  if (t < 0.7) return { label: "Moderate risk", color: "var(--risk-mid)" };
  return { label: "High risk", color: "var(--risk-high)" };
}

export default function Gauge({ probability }: { probability: number }) {
  const t = Math.min(1, Math.max(0, probability));
  const band = bandFor(t);
  const needleAngle = t * 180 - 90; // -90 (left) .. 90 (right), 0 = straight up

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-[260px]">
        {/* muted background track, per risk band */}
        {SEGMENTS.map((seg, i) => (
          <path
            key={i}
            d={`M20,100 A${R},${R} 0 0 1 180,100`}
            fill="none"
            stroke={seg.color}
            strokeOpacity="0.18"
            strokeWidth="14"
            strokeLinecap="butt"
            strokeDasharray={`${(seg.to - seg.from) * HALF_CIRCUMFERENCE} 999`}
            strokeDashoffset={-(seg.from * HALF_CIRCUMFERENCE)}
          />
        ))}

        {/* active fill up to the predicted probability */}
        <path
          className="gauge-fill"
          d={`M20,100 A${R},${R} 0 0 1 180,100`}
          fill="none"
          stroke={band.color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${t * HALF_CIRCUMFERENCE} 999`}
        />

        {/* needle */}
        <g
          className="gauge-needle"
          style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: `${CX}px ${CY}px` }}
        >
          <line x1={CX} y1={CY} x2={CX} y2={CY - 62} stroke="var(--text)" strokeWidth="2" strokeLinecap="round" />
        </g>
        <circle cx={CX} cy={CY} r="4.5" fill="var(--text)" />
      </svg>

      <div className="-mt-2 text-center">
        <p className="font-display text-3xl font-semibold tabular">{Math.round(t * 100)}%</p>
        <p className="text-sm mt-0.5" style={{ color: band.color }}>
          {band.label}
        </p>
      </div>
    </div>
  );
}
