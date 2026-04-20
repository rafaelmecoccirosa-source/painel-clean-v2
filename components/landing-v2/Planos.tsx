import Link from "next/link";

const itensBase = [
  "2 limpezas/ano",
  "Relatório mensal de performance",
  "Checkup técnico a cada visita",
  "Seguro na limpeza",
  "1ª limpeza com 50% off",
];

const planos = [
  {
    icon: "🌱",
    nome: "Básico",
    modulos: "até 15 módulos",
    preco: 30,
    accentBg: "#EBF3E8",
    accentText: "#1B3A2D",
    dark: false,
    itens: itensBase,
    cta: "Começar com Básico",
  },
  {
    icon: "⚡",
    nome: "Padrão",
    modulos: "16 a 30 módulos",
    preco: 50,
    accentBg: "#DCFCE7",
    accentText: "#1B3A2D",
    dark: false,
    itens: itensBase,
    cta: "Começar com Padrão",
  },
  {
    icon: "🔋",
    nome: "Plus",
    modulos: "31 a 60 módulos",
    preco: 100,
    accentBg: "#3DC45A",
    accentText: "#ffffff",
    dark: true,
    itens: [...itensBase, "Alertas de queda de performance"],
    cta: "Começar com Plus",
  },
];

export default function Planos() {
  return (
    <section id="planos" className="py-20" style={{ background: "#F4F8F2" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12 animate-on-scroll">
          <p
            className="text-brand-green uppercase tracking-widest mb-3"
            style={{ fontSize: "11px", letterSpacing: "0.1em", fontWeight: 600 }}
          >
            💳 Planos de assinatura
          </p>
          <h2
            className="font-heading font-extrabold text-brand-dark mb-3"
            style={{ fontSize: "2.5rem", letterSpacing: "-0.02em" }}
          >
            Escolha o plano ideal para sua usina
          </h2>
          <p className="max-w-xl mx-auto text-brand-muted" style={{ fontSize: "1.1rem" }}>
            O plano certo é determinado pelo tamanho da sua usina — não por popularidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {planos.map(({ icon, nome, modulos, preco, accentBg, accentText, dark, itens, cta }, idx) => (
            <div
              key={nome}
              className="flex flex-col gap-5 animate-on-scroll hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(27,58,45,0.12)]"
              style={{
                background: dark ? "#1B3A2D" : "white",
                border: dark ? "1px solid #3DC45A" : "1px solid #C8DFC0",
                borderRadius: "20px",
                padding: "2.5rem",
                transitionDelay: `${idx * 150}ms`,
                transition: "transform 200ms ease-out, box-shadow 200ms ease-out",
              }}
            >
              {/* Plan badge */}
              <div
                className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full"
                style={{ background: accentBg }}
              >
                <span style={{ fontSize: "16px" }}>{icon}</span>
                <span className="font-heading font-bold text-sm" style={{ color: accentText }}>
                  {nome}
                </span>
              </div>

              <div>
                <p
                  className="font-medium"
                  style={{ fontSize: "13px", color: dark ? "rgba(255,255,255,0.55)" : "#7A9A84" }}
                >
                  {modulos}
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span
                  className="font-heading font-extrabold"
                  style={{ fontSize: "52px", lineHeight: 1, color: dark ? "#3DC45A" : "#1B3A2D" }}
                >
                  R$ {preco}
                </span>
                <span style={{ fontSize: "18px", color: dark ? "rgba(255,255,255,0.5)" : "#7A9A84" }}>
                  /mês
                </span>
              </div>

              <hr style={{ border: "none", borderTop: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#C8DFC0"}` }} />

              <ul className="flex flex-col gap-2.5 flex-1">
                {itens.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span style={{ color: "#3DC45A", fontWeight: 700, marginTop: "2px" }}>✓</span>
                    <span style={{ color: dark ? "rgba(255,255,255,0.8)" : "#7A9A84" }}>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/cadastro"
                className="block w-full text-center font-heading font-bold text-sm px-6 py-3.5 rounded-xl hover:-translate-y-px hover:scale-[1.01] hover:shadow-[0_4px_16px_rgba(61,196,90,0.35)] active:scale-[0.98]"
                style={{
                  background: dark ? "#3DC45A" : "#3DC45A",
                  color: "#1B3A2D",
                  transition: "transform 150ms ease-out, box-shadow 150ms ease-out",
                }}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 animate-on-scroll">
          <Link href="/cadastro" className="text-sm text-brand-muted hover:text-brand-dark transition-colors">
            Usina com 60+ módulos? Fale conosco sobre o Plano Pro →
          </Link>
        </p>

        <div className="mt-8 pt-8 border-t border-brand-border text-center animate-on-scroll">
          <p className="text-brand-muted text-sm mb-3">Prefere uma limpeza sem compromisso?</p>
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-brand-muted hover:bg-brand-green hover:text-brand-dark"
            style={{ border: "1px solid #C8DFC0", transition: "background 150ms ease-out, color 150ms ease-out" }}
          >
            Solicitar limpeza avulsa →
          </Link>
        </div>

      </div>
    </section>
  );
}
