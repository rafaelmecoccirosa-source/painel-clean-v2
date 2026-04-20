const stats = [
  { value: "2.400", suffix: "+", label: "usinas monitoradas" },
  { value: "180",   suffix: "+", label: "técnicos certificados" },
  { value: "4,9",   suffix: "★", label: "avaliação média" },
  { value: "13",    suffix: "",  label: "cidades em SC" },
];

export default function StatsBar() {
  return (
    <section
      style={{
        background: "white",
        borderTop: "1px solid #C8DFC0",
        borderBottom: "1px solid #C8DFC0",
        padding: "28px 0",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(({ value, suffix, label }) => (
            <div key={label} className="text-center">
              <div
                className="font-heading"
                style={{
                  fontWeight: 900,
                  fontSize: "clamp(28px, 4vw, 40px)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  color: "#1B3A2D",
                }}
              >
                {value}
                <span style={{ color: "#3DC45A" }}>{suffix}</span>
              </div>
              <div style={{ fontSize: 13, color: "#7A9A84", marginTop: 6, fontWeight: 500 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
