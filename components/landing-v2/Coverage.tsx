"use client";

import { useState } from "react";

const cities = [
  { name: "Jaraguá do Sul",     phase: "active",    x: 18, y: 16 },
  { name: "Pomerode",           phase: "active",    x: 28, y: 22 },
  { name: "Blumenau",           phase: "expanding", x: 34, y: 28 },
  { name: "Gaspar",             phase: "expanding", x: 40, y: 32 },
  { name: "Brusque",            phase: "expanding", x: 38, y: 38 },
  { name: "Itajaí",             phase: "expanding", x: 46, y: 42 },
  { name: "Balneário Camboriú", phase: "soon",      x: 50, y: 50 },
  { name: "Camboriú",           phase: "soon",      x: 48, y: 54 },
  { name: "Navegantes",         phase: "soon",      x: 44, y: 47 },
  { name: "Itapema",            phase: "soon",      x: 54, y: 58 },
  { name: "Tijucas",            phase: "soon",      x: 56, y: 65 },
  { name: "São José",           phase: "soon",      x: 60, y: 80 },
  { name: "Florianópolis",      phase: "active",    x: 63, y: 87 },
] as const;

type Phase = "active" | "expanding" | "soon";

const phaseConfig: Record<Phase, { fill: string; stroke?: string; label: string; pulse: boolean }> = {
  active:    { fill: "#1B3A2D", label: "Ativa",      pulse: true  },
  expanding: { fill: "#3DC45A", label: "Expandindo", pulse: true  },
  soon:      { fill: "#C8DFC0", stroke: "#7A9A84", label: "Em breve", pulse: false },
};

export default function Coverage() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="cobertura" style={{ background: "#F4F8F2", padding: "clamp(72px, 9vw, 110px) 0" }}>
      <style>{`
        @keyframes pc-pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%       { opacity: 0.05; transform: scale(1.6); }
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12 animate-on-scroll">
          <p
            className="text-brand-green uppercase tracking-widest mb-3"
            style={{ fontSize: "11px", letterSpacing: "0.1em", fontWeight: 600 }}
          >
            📍 Onde atuamos
          </p>
          <h2
            className="font-heading font-extrabold text-brand-dark mb-3"
            style={{ fontSize: "2.5rem", letterSpacing: "-0.02em" }}
          >
            13 cidades em Santa Catarina
          </h2>
          <p className="max-w-xl mx-auto text-brand-muted" style={{ fontSize: "1.1rem" }}>
            Do corredor Jaraguá do Sul–Florianópolis, com expansão programada para toda a faixa litorânea.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-start justify-center animate-on-scroll">

          {/* SVG map */}
          <div
            style={{
              width: "100%",
              maxWidth: 340,
              margin: "0 auto",
              background: "white",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(27,58,45,0.10)",
              padding: 16,
              flexShrink: 0,
            }}
          >
            <svg
              viewBox="0 0 100 120"
              style={{ width: "100%", display: "block" }}
              aria-label="Mapa de cobertura — Santa Catarina"
            >
              {/* Background */}
              <rect x="1" y="1" width="98" height="118" rx="8" fill="#EBF3E8" stroke="#C8DFC0" strokeWidth="0.8" />

              {/* Coastline bezier */}
              <path
                d="M 22,10 C 30,14 26,20 32,26 C 38,32 42,36 46,42 C 50,48 52,54 54,60 C 56,66 58,72 60,80 C 61,83 62,85 63,87"
                stroke="#C8DFC0"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* City pins */}
              {cities.map(({ name, phase, x, y }) => {
                const cfg = phaseConfig[phase];
                const isHovered = hovered === name;
                return (
                  <g
                    key={name}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHovered(name)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Pulse halo */}
                    {cfg.pulse && (
                      <circle
                        cx={x}
                        cy={y}
                        r={5}
                        fill={cfg.fill}
                        style={{ animation: "pc-pulse 2.5s ease-in-out infinite" }}
                      />
                    )}

                    {/* Main pin */}
                    <circle
                      cx={x}
                      cy={y}
                      r={2.8}
                      fill={cfg.fill}
                      stroke={cfg.stroke ?? "none"}
                      strokeWidth={cfg.stroke ? 0.8 : 0}
                    />

                    {/* Tooltip */}
                    {isHovered && (
                      <g transform={`translate(${x}, ${y - 10})`}>
                        <rect
                          x={-22}
                          y={-10}
                          width={44}
                          height={11}
                          rx={3}
                          fill="white"
                          filter="drop-shadow(0 1px 4px rgba(0,0,0,0.15))"
                        />
                        <text
                          textAnchor="middle"
                          style={{ fontSize: "5px", fill: "#1B3A2D", fontWeight: 600, fontFamily: "sans-serif" }}
                          y={-3}
                        >
                          {name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-3">
              {(["active", "expanding", "soon"] as Phase[]).map((phase) => {
                const cfg = phaseConfig[phase];
                return (
                  <div key={phase} className="flex items-center gap-1.5">
                    <span
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: cfg.fill,
                        border: cfg.stroke ? `1px solid ${cfg.stroke}` : undefined,
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 11, color: "#7A9A84" }}>{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* City list */}
          <div className="flex-1 flex flex-col gap-6">
            {(["active", "expanding", "soon"] as Phase[]).map((phase) => (
              <div key={phase}>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: phaseConfig[phase].fill,
                      border: phaseConfig[phase].stroke ? `1px solid ${phaseConfig[phase].stroke}` : undefined,
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  <span className="font-heading font-bold text-brand-dark" style={{ fontSize: 13 }}>
                    {phaseConfig[phase].label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cities
                    .filter((c) => c.phase === phase)
                    .map(({ name }) => (
                      <span
                        key={name}
                        className="text-xs font-medium px-3 py-1 rounded-full"
                        style={{
                          background: phase === "active" ? "#DCFCE7" : phase === "expanding" ? "#F0FAF2" : "white",
                          color: phase === "soon" ? "#7A9A84" : "#1B3A2D",
                          border: "1px solid #C8DFC0",
                        }}
                      >
                        {name}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
