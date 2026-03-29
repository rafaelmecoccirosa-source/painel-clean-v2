// Static SVG donut chart — no client state needed

interface Fatia {
  label: string;
  pct: number;
  color: string;
  faixa: string;
}

const fatias: Fatia[] = [
  { label: "Até 10 módulos",  pct: 30, color: "#CBD5E1", faixa: "R$ 180" },
  { label: "11–30 módulos",   pct: 45, color: "#3DC45A", faixa: "R$ 300" },
  { label: "31–60 módulos",   pct: 20, color: "#1B3A2D", faixa: "R$ 520" },
  { label: "61+ módulos",     pct: 5,  color: "#F59E0B", faixa: "Consulta" },
];

// r=45, cx=60, cy=60 → C = 2π×45 ≈ 282.74
const R = 45;
const CX = 60;
const CY = 60;
const C = 2 * Math.PI * R;

export default function AdminDonut() {
  let cumulative = 0;

  return (
    <div className="card">
      <h2 className="font-heading font-bold text-brand-dark text-base mb-5">
        🍩 Distribuição por faixa de serviço
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Donut */}
        <div className="relative flex-shrink-0">
          <svg
            viewBox="0 0 120 120"
            width={160}
            height={160}
            style={{ transform: "rotate(-90deg)" }}
          >
            {fatias.map((f, i) => {
              const len = (f.pct / 100) * C;
              const offset = -cumulative;
              cumulative += len;
              return (
                <circle
                  key={i}
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke={f.color}
                  strokeWidth={18}
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={offset}
                />
              );
            })}
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-heading font-bold text-brand-dark text-lg leading-tight">
              R$ 293
            </p>
            <p className="text-[10px] text-brand-muted">ticket médio</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3 w-full">
          {fatias.map((f) => (
            <div key={f.label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: f.color }}
                />
                <span className="text-sm text-brand-dark truncate">{f.label}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-brand-muted">{f.faixa}</span>
                <span className="text-xs font-bold text-brand-dark w-8 text-right">
                  {f.pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
