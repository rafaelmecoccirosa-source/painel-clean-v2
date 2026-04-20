import Link from "next/link";

const badges = [
  { icon: "🛡️", text: "Técnicos certificados" },
  { icon: "📸", text: "Relatório fotográfico" },
  { icon: "📅", text: "Agendamento em 48h" },
  { icon: "💳", text: "A partir de R$ 30/mês" },
];

export default function Hero() {
  return (
    <section
      style={{
        background: "#1B3A2D",
        padding: "clamp(80px, 12vw, 140px) 0 clamp(64px, 10vw, 110px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "60%",
          paddingBottom: "60%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(61,196,90,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-2xl">

          <p
            className="uppercase tracking-widest mb-4"
            style={{ fontSize: "11px", letterSpacing: "0.1em", fontWeight: 600, color: "#3DC45A" }}
          >
            ☀️ Plataforma de assinatura — SC
          </p>

          <h1
            className="font-heading font-extrabold"
            style={{
              fontSize: "clamp(2.25rem, 6vw, 3.75rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "white",
              marginBottom: "1.25rem",
            }}
          >
            Sua usina solar{" "}
            <span style={{ color: "#3DC45A" }}>rendendo no máximo</span>,<br />
            todo mês.
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.65,
              marginBottom: "2.25rem",
              maxWidth: 520,
            }}
          >
            Assinatura mensal de limpeza e monitoramento de painéis solares.
            Técnico certificado, relatório fotográfico e 1ª limpeza com{" "}
            <strong style={{ color: "white" }}>50% off</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3" style={{ maxWidth: 420 }}>
            <Link
              href="/cadastro"
              className="font-heading font-bold text-sm px-7 py-4 rounded-xl text-center hover:-translate-y-px hover:scale-[1.01] hover:shadow-[0_4px_24px_rgba(61,196,90,0.45)] active:scale-[0.98]"
              style={{
                background: "#3DC45A",
                color: "#1B3A2D",
                transition: "transform 150ms ease-out, box-shadow 150ms ease-out",
              }}
            >
              Assinar com 50% off →
            </Link>
            <a
              href="#como-funciona"
              className="font-heading font-bold text-sm px-7 py-4 rounded-xl text-center hover:-translate-y-px hover:bg-white/10 active:scale-[0.98]"
              style={{
                border: "1px solid rgba(255,255,255,0.25)",
                color: "rgba(255,255,255,0.85)",
                transition: "background 150ms ease-out, transform 150ms ease-out",
              }}
            >
              Ver planos
            </a>
          </div>

          {/* Trust badges */}
          <div
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {badges.map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "8px 12px",
                }}
              >
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.3 }}>{text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
