"use client";

import Link from "next/link";

const cards = [
  {
    icon: "📅",
    title: "Agenda flexível",
    text: "Você escolhe quando trabalhar. Aceite ou recuse chamados conforme sua disponibilidade.",
  },
  {
    icon: "💸",
    title: "Pagamento garantido",
    text: "Receba via PIX automaticamente após a conclusão de cada serviço. Sem atraso, sem burocracia.",
  },
  {
    icon: "🆓",
    title: "Cadastro gratuito",
    text: "Você não paga nada para entrar na plataforma. O modelo é por serviços realizados.",
  },
  {
    icon: "📍",
    title: "Chamados na sua região",
    text: "Receba somente chamados perto de você. Sem deslocamento caro, sem perda de tempo.",
  },
  {
    icon: "🌱",
    title: "Ecossistema Painel Clean",
    text: "Faça parte da maior rede de limpeza de painéis solares de SC. Suporte, treinamento e equipamento parceiro.",
  },
];

export default function ParaTecnicos() {
  return (
    <section
      id="para-tecnicos"
      style={{ background: "#0F2419", padding: "clamp(72px, 9vw, 110px) 0" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12 animate-on-scroll">
          <p
            className="uppercase tracking-widest mb-3"
            style={{ fontSize: "11px", letterSpacing: "0.1em", fontWeight: 600, color: "#3DC45A" }}
          >
            🔧 Para técnicos
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
            Ganhe renda extra limpando painéis solares na sua cidade
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.65)",
              maxWidth: 540,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Cadastro gratuito. Você recebe chamados automaticamente, executa no seu
            horário e recebe via PIX.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 animate-on-scroll">
          {cards.map(({ icon, title, text }, idx) => (
            <div
              key={title}
              className="flex gap-4"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 16,
                padding: "20px 22px",
                transitionDelay: `${idx * 80}ms`,
              }}
            >
              <span style={{ fontSize: 26, flexShrink: 0, lineHeight: 1.4 }}>{icon}</span>
              <div>
                <h3
                  className="font-heading font-bold mb-1"
                  style={{ fontSize: "14px", color: "white" }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center animate-on-scroll">
          <Link
            href="/cadastro?role=tecnico"
            className="inline-block font-heading font-bold text-sm px-10 py-4 rounded-xl hover:-translate-y-px active:scale-[0.98]"
            style={{
              border: "2px solid rgba(255,255,255,0.4)",
              color: "white",
              transition: "background 150ms ease-out, border-color 150ms ease-out, transform 150ms ease-out",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.65)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.4)";
            }}
          >
            Quero me cadastrar como técnico →
          </Link>
        </div>

      </div>
    </section>
  );
}
