"use client";

const inverters = ["Fronius", "SolarEdge", "Growatt", "Sungrow", "Hoymiles", "Deye"];

const cards = [
  {
    icon: "⚡",
    title: "Alerta automático",
    text: "Queda de 5% na geração dispara notificação. Agendamos antes do problema virar prejuízo.",
  },
  {
    icon: "📊",
    title: "Relatório mensal real",
    text: "Dados direto do inversor: geração, comparativo mês a mês, eficiência dos painéis.",
  },
  {
    icon: "🔍",
    title: "Diagnóstico preciso",
    text: "Sabemos exatamente qual painel está com problema antes de mandar o técnico.",
  },
];

export default function DiferencialTecnico() {
  return (
    <section style={{ background: "#1B3A2D", padding: "clamp(72px, 9vw, 110px) 0" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12 animate-on-scroll">
          <p
            className="uppercase tracking-widest mb-3"
            style={{ fontSize: "11px", letterSpacing: "0.1em", fontWeight: 600, color: "#3DC45A" }}
          >
            🔌 Tecnologia exclusiva
          </p>
          <h2
            className="font-heading font-extrabold"
            style={{
              fontSize: "clamp(2rem, 5vw, 2.75rem)",
              letterSpacing: "-0.02em",
              color: "white",
              marginBottom: "1rem",
            }}
          >
            O único que se conecta direto no seu inversor
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.65)",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Detectamos queda de geração antes de você abrir a conta de luz — automaticamente.
          </p>
        </div>

        {/* Inverter brands */}
        <div className="animate-on-scroll mb-12">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-3">
            {inverters.map((brand) => (
              <span
                key={brand}
                className="font-heading font-bold"
                style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.65)",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  padding: "8px 18px",
                  letterSpacing: "0.02em",
                }}
              >
                {brand}
              </span>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.28)" }}>
            Marcas registradas de seus respectivos proprietários.
          </p>
        </div>

        {/* 3 benefit cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-on-scroll">
          {cards.map(({ icon, title, text }, idx) => (
            <div
              key={title}
              className="flex flex-col gap-3"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: "24px",
                transitionDelay: `${idx * 100}ms`,
              }}
            >
              <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
              <h3 className="font-heading font-bold" style={{ fontSize: "15px", color: "white" }}>
                {title}
              </h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>
                {text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
