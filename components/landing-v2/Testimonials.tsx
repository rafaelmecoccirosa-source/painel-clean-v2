"use client";

const testimonials = [
  {
    name: "Carlos Menegotti",
    role: "Dono de usina · Jaraguá do Sul",
    kwp: "8,8 kWp · 16 placas",
    stars: 5,
    text: "Assinei em setembro. Na primeira limpeza já recuperei 14% de geração. O relatório com foto antes e depois é excelente — me deu segurança de verdade.",
    avatar: "CM",
    plan: "Padrão",
  },
  {
    name: "Fernanda Vieira",
    role: "Administradora · Blumenau",
    kwp: "22 placas · comercial",
    stars: 5,
    text: "Tenho 3 pontos da minha clínica no plano Plus. Chegou alerta de queda de geração num sábado, mandaram técnico na segunda. Isso não existia antes.",
    avatar: "FV",
    plan: "Plus",
  },
  {
    name: "Ricardo Sartori",
    role: "Engenheiro aposentado · Joinville",
    kwp: "6,6 kWp · 12 placas",
    stars: 5,
    text: "Eu mesmo limpava. Perdi uma tarde inteira subindo no telhado no calor. Pelo preço da assinatura, nunca mais. Dashboard é melhor que o do meu inversor.",
    avatar: "RS",
    plan: "Básico",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

const planColors: Record<string, string> = {
  Básico: "#EBF3E8",
  Padrão: "#DCFCE7",
  Plus: "#1B3A2D",
};
const planTextColors: Record<string, string> = {
  Básico: "#1B3A2D",
  Padrão: "#1B3A2D",
  Plus: "#3DC45A",
};

export default function Testimonials() {
  return (
    <section id="depoimentos" style={{ padding: "clamp(72px, 9vw, 110px) 0", background: "white" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12 animate-on-scroll">
          <p
            className="text-brand-green uppercase tracking-widest mb-3"
            style={{ fontSize: "11px", letterSpacing: "0.1em", fontWeight: 600 }}
          >
            💬 O que dizem nossos clientes
          </p>
          <h2
            className="font-heading font-extrabold text-brand-dark"
            style={{ fontSize: "2.5rem", letterSpacing: "-0.02em" }}
          >
            Resultados que falam por si
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map(({ name, role, kwp, stars, text, avatar, plan }, idx) => (
            <div
              key={name}
              className="flex flex-col animate-on-scroll"
              style={{
                background: "white",
                border: "1px solid #C8DFC0",
                borderRadius: "18px",
                padding: "26px",
                transitionDelay: `${idx * 150}ms`,
                transition: "transform 200ms ease-out, box-shadow 200ms ease-out",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(27,58,45,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <Stars count={stars} />

              <p
                className="flex-1 text-brand-dark leading-relaxed mt-4"
                style={{ fontSize: "15px", lineHeight: 1.6 }}
              >
                &ldquo;{text}&rdquo;
              </p>

              <div className="mt-5 pt-4 border-t border-brand-border flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-heading font-extrabold text-sm flex-shrink-0"
                  style={{ background: "#1B3A2D", color: "white" }}
                >
                  {avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-brand-dark text-sm">{name}</p>
                  <p className="text-brand-muted text-xs truncate">{role}</p>
                  <p className="text-brand-muted text-xs">{kwp}</p>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ background: planColors[plan] ?? "#EBF3E8", color: planTextColors[plan] ?? "#1B3A2D" }}
                >
                  {plan}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Rating strip */}
        <div
          className="mt-10 animate-on-scroll"
          style={{
            padding: "20px 24px",
            background: "#EBF3E8",
            borderRadius: "16px",
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#F59E0B">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="font-heading font-extrabold text-brand-dark" style={{ fontSize: "1.25rem" }}>4,9</span>
            <span className="text-brand-muted text-sm">/5 · 830 avaliações</span>
          </div>

          <div className="hidden sm:block w-px h-8 bg-brand-border" />

          <p className="text-brand-dark text-sm font-medium">
            <span className="font-bold text-brand-green">92%</span> dos clientes renovam após 12 meses
          </p>
        </div>

      </div>
    </section>
  );
}
