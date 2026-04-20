"use client";

const passos = [
  {
    num: "1",
    emoji: "📋",
    titulo: "Escolha seu plano",
    texto: "Selecione o plano conforme o tamanho da sua usina. Básico, Padrão ou Plus — todos incluem 2 limpezas/ano e relatório mensal.",
  },
  {
    num: "2",
    emoji: "🧹",
    titulo: "1ª limpeza com 50% off",
    texto: "Um técnico certificado agenda em até 48h. Você paga metade do valor de uma limpeza avulsa para entrar no plano.",
  },
  {
    num: "3",
    emoji: "📊",
    titulo: "Acompanhe todo mês",
    texto: "Receba seu relatório mensal de performance diretamente no app. Saiba exatamente quanto sua usina está gerando vs. o esperado.",
  },
  {
    num: "4",
    emoji: "😌",
    titulo: "Relaxe",
    texto: "As próximas limpezas são agendadas automaticamente. Se precisar de uma limpeza extra, assinantes têm 40% de desconto.",
  },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 animate-on-scroll">
          <p
            className="text-brand-green uppercase tracking-widest mb-3"
            style={{ fontSize: "11px", letterSpacing: "0.1em", fontWeight: 600 }}
          >
            🚀 Processo simples
          </p>
          <h2
            className="font-heading font-extrabold text-brand-dark"
            style={{ fontSize: "2.5rem", letterSpacing: "-0.02em" }}
          >
            Comece em 4 passos
          </h2>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:flex items-start gap-0">
          {passos.map((passo, idx) => (
            <div
              key={passo.num}
              className="flex-1 flex flex-col items-center relative animate-on-scroll"
              style={{ transitionDelay: `${idx * 200}ms` }}
            >
              {idx < passos.length - 1 && (
                <div className="absolute top-8 left-1/2 w-full h-0.5 bg-brand-border" />
              )}
              <div className="relative z-10 h-16 w-16 rounded-full bg-brand-green flex items-center justify-center text-white font-heading font-extrabold text-2xl mb-4" style={{ boxShadow: "0 2px 8px rgba(61,196,90,0.3)" }}>
                {passo.num}
              </div>
              <span className="text-3xl mb-3">{passo.emoji}</span>
              <h3 className="font-heading font-bold text-brand-dark text-center text-sm mb-2 px-4">
                {passo.titulo}
              </h3>
              <p className="text-brand-muted text-xs text-center leading-relaxed px-4" style={{ minHeight: "80px" }}>
                {passo.texto}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile: vertical list */}
        <div className="md:hidden space-y-6">
          {passos.map((passo, idx) => (
            <div
              key={passo.num}
              className="flex items-start gap-4 animate-on-scroll"
              style={{ transitionDelay: `${idx * 200}ms` }}
            >
              <div
                className="rounded-full bg-brand-green flex items-center justify-center text-white font-heading font-extrabold flex-shrink-0"
                style={{ width: 32, height: 32, fontSize: 14 }}
              >
                {passo.num}
              </div>
              <div>
                <p className="text-xl mb-1">{passo.emoji}</p>
                <h3 className="font-heading font-bold text-brand-dark text-sm mb-1">{passo.titulo}</h3>
                <p className="text-brand-muted text-xs leading-relaxed">{passo.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
