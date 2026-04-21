import { COLORS } from '@/lib/brand-tokens';

export default function Donut({
  value,
  size = 180,
  stroke = 7,
  color = COLORS.green,
  baseline,
  label,
  deltaLabel,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  baseline?: number;
  label?: string;
  deltaLabel?: string;
}) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const PAD = 10;
  return (
    <div
      style={{
        display: 'inline-flex',
        padding: PAD,
        margin: -PAD,
        overflow: 'visible',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{ overflow: 'visible', display: 'block' }}
      >
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth={stroke} />
      {baseline != null && (
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,.35)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c * (baseline / 100)} ${c}`}
          transform="rotate(-90 50 50)"
        />
      )}
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${c * (value / 100)} ${c}`}
        transform="rotate(-90 50 50)"
        style={{ filter: `drop-shadow(0 0 8px ${color}88)`, transition: 'stroke-dasharray 1s ease-out' }}
      />
      <text
        x="50"
        y={label || deltaLabel ? 44 : 52}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Montserrat,sans-serif"
        fontWeight="900"
        fontSize="22"
        fill="white"
        letterSpacing="-0.03em"
      >
        {value}%
      </text>
      {label && (
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fontFamily="Open Sans,sans-serif"
          fontWeight="700"
          fontSize="6"
          fill="rgba(255,255,255,.6)"
          letterSpacing=".15em"
        >
          {label}
        </text>
      )}
      {deltaLabel && (
        <text
          x="50"
          y="70"
          textAnchor="middle"
          fontFamily="Montserrat,sans-serif"
          fontWeight="800"
          fontSize="7"
          fill={color}
          letterSpacing="-0.02em"
        >
          {deltaLabel}
        </text>
      )}
      </svg>
    </div>
  );
}

export function ProgressBar({
  value,
  height = 6,
  color = COLORS.green,
  track = COLORS.border,
  style = {},
}: {
  value: number;
  height?: number;
  color?: string;
  track?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ height, background: track, borderRadius: 9999, overflow: 'hidden', ...style }}>
      <div
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          height: '100%',
          background: color,
          borderRadius: 9999,
          transition: 'width 1.2s ease-out',
        }}
      />
    </div>
  );
}
