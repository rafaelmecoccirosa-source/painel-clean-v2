const cities = [
  { name: "Jaraguá do Sul",     phase: "active",    x: 12, y: 18 },
  { name: "Pomerode",           phase: "active",    x: 22, y: 25 },
  { name: "Florianópolis",      phase: "active",    x: 62, y: 88 },
  { name: "Blumenau",           phase: "expanding", x: 30, y: 32 },
  { name: "Itajaí",             phase: "expanding", x: 42, y: 45 },
  { name: "Brusque",            phase: "expanding", x: 35, y: 40 },
  { name: "Gaspar",             phase: "expanding", x: 38, y: 36 },
  { name: "Balneário Camboriú", phase: "soon",      x: 48, y: 54 },
  { name: "Navegantes",         phase: "soon",      x: 45, y: 50 },
  { name: "Itapema",            phase: "soon",      x: 52, y: 60 },
  { name: "Tijucas",            phase: "soon",      x: 56, y: 68 },
  { name: "São José",           phase: "soon",      x: 59, y: 82 },
  { name: "Palhoça",            phase: "soon",      x: 60, y: 86 },
];

const phaseColors = {
  active:    "#3DC45A",
  expanding: "#7A9A84",
  soon:      "#C8DFC0",
};

const phaseLabels = {
  active:    "Ativo agora",
  expanding: "Expansão (mês 3–6)",
  soon:      "Em breve (ano 2)",
};

export default function Coverage() {
  return (
    <section id="cobertura" style={{ background: "#F4F8F2", padding: "clamp(72px, 9vw, 110px) 0" }}>
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
          {/* SVG Map */}
          <div className="w-full md:w-80 flex-shrink-0">
            <svg
              viewBox="0 0 100 100"
              style={{ width: "100%", maxWidth: 320, display: "block", margin: "0 auto" }}
              aria-label="Mapa de cobertura"
            >
              {/* SC coastline rough outline */}
              <path
                d="M8 15 Q10 12 14 13 Q18 10 22 14 Q28 11 32 15 Q36 13 40 16 Q44 14 48 17 Q52 16 55 20 Q58 18 62 22 Q66 20 70 25 Q68 30 65 33 Q68 36 66 40 Q70 44 68 48 Q72 52 70 56 Q74 58 72 62 Q70 66 68 70 Q66 74 64 78 Q63 82 65 86 Q63 90 60 92 Q56 93 52 91 Q48 90 44 92 Q40 91 36 89 Q32 88 28 85 Q24 82 22 78 Q18 75 16 70 Q12 66 10 60 Q8 54 9 48 Q7 42 8 36 Q6 30 8 24 Z"
                fill="#EBF3E8"
                stroke="#C8DFC0"
                strokeWidth="0.8"
              />

              {/* City pins */}
              {cities.map(({ name, phase, x, y }) => (
                <g key={name}>
                  <circle
                    cx={x}
                    cy={y}
                    r={phase === "active" ? 2.5 : 1.8}
                    fill={phaseColors[phase as keyof typeof phaseColors]}
                    opacity={phase === "soon" ? 0.6 : 1}
                  />
                  {phase === "active" && (
                    <circle
                      cx={x}
                      cy={y}
                      r={4.5}
                      fill="none"
                      stroke="#3DC45A"
                      strokeWidth="0.6"
                      opacity="0.4"
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* City list */}
          <div className="flex-1 flex flex-col gap-6">
            {(["active", "expanding", "soon"] as const).map((phase) => (
              <div key={phase}>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="inline-block rounded-full"
                    style={{
                      width: 10,
                      height: 10,
                      background: phaseColors[phase],
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="font-heading font-bold text-brand-dark"
                    style={{ fontSize: "13px" }}
                  >
                    {phaseLabels[phase]}
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
                          background: phase === "active" ? "#DCFCE7" : "white",
                          color: phase === "active" ? "#1B3A2D" : "#7A9A84",
                          border: `1px solid ${phase === "active" ? "#C8DFC0" : "#E5EDE2"}`,
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
