"use client";

import Link from "next/link";

const BroomSVG = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 4L9 14" />
    <path d="M9 14C5 14 2 17 2 20C2 22 4 22 6 22C9 22 12 19 12 16L9 14Z" />
  </svg>
);

const trustItems = [
  { icon: <BroomSVG />, label: "2 limpezas/ano inclusas" },
  { icon: "📊",          label: "Relatório mensal" },
  { icon: "🔌",          label: "Monitoramento via inversor" },
  { icon: "🛡️",          label: "Seguro contra danos" },
  { icon: "⚡",          label: "Agendamento em 48h" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: 580 }}
    >
      {/* Ken Burns background */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <div
          id="v2-hero-bg"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/hero-solar-v2.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            animation: "kenburns 20s ease-out forwards",
            transformOrigin: "center center",
          }}
        />
        {/* Overlay */}
        <div id="v2-hero-overlay" style={{ position: "absolute", inset: 0 }} />
        {/* Shimmer sweep */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.08) 40%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 60%,transparent 100%)",
              animation: "shimmer 8s ease-in-out infinite",
              animationDelay: "2s",
            }}
          />
        </div>
      </div>

      {/* Responsive bg-position + overlay gradient */}
      <style>{`
        #v2-hero-bg { background-position: 30% center; }
        @media (min-width: 768px) { #v2-hero-bg { background-position: center center; } }
        #v2-hero-overlay { background: linear-gradient(to right, rgba(27,58,45,0.88) 0%, rgba(27,58,45,0.55) 100%); }
        @media (min-width: 768px) { #v2-hero-overlay { background: linear-gradient(rgba(27,58,45,0.85), rgba(27,58,45,0.72)); } }
      `}</style>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:py-28">

        {/* Badge */}
        <span
          className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-6"
          style={{ color: "#3DC45A", animation: "fadeSlideUp 0.6s ease both", animationDelay: "0.2s" }}
        >
          ☀️ Plataforma de assinatura solar — SC
        </span>

        {/* Headline */}
        <h1
          className="font-heading text-[2rem] sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] sm:leading-tight mb-5 max-w-3xl text-white"
          style={{
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            animation: "fadeSlideUp 0.6s ease both",
            animationDelay: "0.5s",
          }}
        >
          Sua usina solar{" "}
          <span style={{ color: "#3DC45A" }}>rendendo no máximo</span>,
          todo mês.
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/85 text-[15px] sm:text-xl mb-8 max-w-xl leading-relaxed"
          style={{
            textShadow: "0 1px 3px rgba(0,0,0,0.25)",
            animation: "fadeSlideUp 0.6s ease both",
            animationDelay: "0.8s",
          }}
        >
          Assinatura de limpeza e monitoramento de painéis solares. Técnico certificado,
          relatório fotográfico e{" "}
          <strong className="text-white">1ª limpeza com 50% off</strong>.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4"
          style={{ animation: "fadeSlideUp 0.6s ease both", animationDelay: "1.1s" }}
        >
          <Link
            href="/cadastro"
            className="inline-flex items-center justify-center font-heading font-bold rounded-xl hover:-translate-y-px hover:scale-[1.01] hover:shadow-[0_4px_24px_rgba(61,196,90,0.45)] active:scale-[0.98] w-full sm:w-auto"
            style={{
              background: "#3DC45A",
              color: "#1B3A2D",
              fontSize: 16,
              padding: "14px 28px",
              maxWidth: 320,
              margin: "0 auto",
              transition: "transform 150ms ease-out, box-shadow 150ms ease-out",
            }}
          >
            Assinar com 50% off →
          </Link>
          <a
            href="#calculadora"
            className="inline-flex items-center justify-center font-heading font-bold rounded-xl hover:bg-white/10 active:scale-[0.98] w-full sm:w-auto"
            style={{
              border: "2px solid rgba(255,255,255,0.4)",
              color: "white",
              fontSize: 16,
              padding: "14px 28px",
              maxWidth: 320,
              margin: "0 auto",
              transition: "background 150ms ease-out, transform 150ms ease-out",
            }}
          >
            Calcular minha perda
          </a>
        </div>

        {/* Trust badges */}
        <div
          className="mt-8 sm:mt-10"
          style={{ animation: "fadeSlideUp 0.6s ease both", animationDelay: "1.4s" }}
        >
          {/* Desktop — row */}
          <div className="hidden sm:flex items-center gap-x-6 gap-y-2 flex-wrap justify-start">
            {trustItems.map(({ icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 whitespace-nowrap text-white font-medium" style={{ fontSize: 12 }}>
                <span style={{ fontSize: 13, lineHeight: 1, display: "flex", alignItems: "center" }}>{icon}</span>
                {label}
              </span>
            ))}
          </div>

          {/* Mobile — 2+2+1 grid */}
          <div className="sm:hidden grid grid-cols-2 gap-2">
            {trustItems.map(({ icon, label }, idx) => (
              <span
                key={label}
                className="flex items-center gap-1.5 text-white font-medium"
                style={{
                  fontSize: 12,
                  ...(idx === trustItems.length - 1 && trustItems.length % 2 !== 0
                    ? { gridColumn: "1 / -1", justifyContent: "center" }
                    : {}),
                }}
              >
                <span style={{ fontSize: 12, lineHeight: 1, display: "flex", alignItems: "center" }}>{icon}</span>
                {label}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
