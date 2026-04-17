import Link from "next/link";
import Logo from "@/components/layout/Logo";
import HeroSection from "@/components/home/HeroSection";
import CalculadoraEconomia from "@/components/home/CalculadoraEconomia";
import ScrollAnimations from "@/components/home/ScrollAnimations";
import { TecnicoParticles } from "@/components/TecnicoParticles";
import { BannerParticles } from "@/components/BannerParticles";

// ── Seção 2 — Como se paga em 4 dias ──────────────────────────────────────

const paybackCards = [
  {
    emoji: "☀️",
    plano: "Plano Básico",
    modulos: "até 15 módulos",
    prejuizoMes: "R$ 218",
    mensalidade: "R$ 30/mês",
  },
  {
    emoji: "☀️☀️",
    plano: "Plano Padrão",
    modulos: "16 a 30 módulos",
    prejuizoMes: "R$ 365",
    mensalidade: "R$ 50/mês",
  },
  {
    emoji: "☀️☀️☀️",
    plano: "Plano Plus",
    modulos: "31 a 60 módulos",
    prejuizoMes: "R$ 729",
    mensalidade: "R$ 100/mês",
  },
];

// ── Seção 4 — Como funciona (v2 — assinatura) ─────────────────────────────

const passos = [
  {
    num: "1",
    emoji: "📋",
    titulo: "Escolha seu plano",
    texto: "Selecione o plano conforme o tamanho da sua usina: Básico, Padrão ou Plus.",
  },
  {
    num: "2",
    emoji: "🧹",
    titulo: "1ª limpeza com 50% off",
    texto: "Técnico certificado agenda a primeira limpeza em até 48h com metade do preço.",
  },
  {
    num: "3",
    emoji: "📊",
    titulo: "Acompanhe todo mês",
    texto: "Relatório de performance direto no app. Saiba exatamente o quanto sua usina está gerando.",
  },
  {
    num: "4",
    emoji: "😌",
    titulo: "Relaxe",
    texto: "As próximas limpezas são agendadas automaticamente. Sem preocupação.",
  },
];

// ── Seção 5 — Diferenciais ────────────────────────────────────────────────

const beneficios = [
  { emoji: "✅",  titulo: "Técnicos certificados",   texto: "Todos os profissionais passam por treinamento e aprovação antes de atender." },
  { emoji: "⚡",  titulo: "Agendamento automático",   texto: "Após assinar, suas próximas limpezas são agendadas sem que você precise fazer nada." },
  { emoji: "📸",  titulo: "Relatório fotográfico",    texto: "Fotos antes e depois + diagnóstico técnico de cada limpeza." },
  { emoji: "🛡️", titulo: "Seguro na limpeza",         texto: "Todos os serviços incluem cobertura contra danos acidentais às suas placas e telhado." },
  { emoji: "📊",  titulo: "Monitoramento mensal",      texto: "Relatório de performance todo mês. Alertas automáticos se a produção cair abaixo do esperado." },
  { emoji: "⭐",  titulo: "Avaliação real",            texto: "Veja a nota de cada técnico antes de contratar. Transparência total." },
];

// ── Seção 6 — Planos de assinatura ────────────────────────────────────────

const itensBase = [
  "2 limpezas/ano",
  "Relatório mensal",
  "Checkup técnico",
  "Seguro na limpeza",
  "1ª limpeza com 50% off",
];

// ─────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Mounts single IntersectionObserver for all .animate-on-scroll elements */}
      <ScrollAnimations />

      {/* ── Header fixo ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-brand-light border-b border-brand-border shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          <Logo size="sm" />
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <Link
              href="/login"
              className="text-brand-dark/70 hover:text-brand-dark text-[12px] sm:text-sm font-medium transition-colors px-2 py-1.5 sm:px-3 whitespace-nowrap"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="bg-brand-green text-white font-heading font-bold text-[12px] sm:text-sm px-3 py-1.5 sm:px-5 sm:py-2 rounded-xl hover:bg-brand-green/90 transition-colors whitespace-nowrap"
            >
              Cadastrar-se
            </Link>
          </div>
        </div>
      </header>

      {/* ── Seção 1: Hero ────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Seção 2: Como se paga em 4 dias ──────────────────────────────── */}
      <section className="bg-brand-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
              💡 Investimento que se paga rápido
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-dark">
              Por que R$ 30/mês é o melhor investimento da sua usina?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paybackCards.map(({ emoji, plano, modulos, prejuizoMes, mensalidade }, idx) => (
              <div
                key={plano}
                className="bg-white rounded-2xl border border-brand-border p-8 flex flex-col gap-4 hover:shadow-card-hover transition-shadow animate-on-scroll"
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <span className="text-3xl">{emoji}</span>
                <h3 className="font-heading text-lg font-bold text-brand-dark">{plano}</h3>
                <p className="text-xs text-brand-muted">{modulos}</p>
                <div className="border-t border-brand-border pt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-muted">Prejuízo/mês por sujeira</span>
                    <span className="font-bold text-red-500">{prejuizoMes}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-muted">Mensalidade</span>
                    <span className="font-bold text-brand-dark">{mensalidade}</span>
                  </div>
                </div>
                <div className="mt-auto bg-brand-green/10 rounded-xl px-4 py-2.5 text-center">
                  <span className="text-brand-green font-heading font-bold text-sm">
                    ✅ Se paga em ~4 dias
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seção 3: Calculadora — slide from left ───────────────────────── */}
      <div className="animate-on-scroll animate-slide-left">
        <CalculadoraEconomia />
      </div>

      {/* ── Seção 4: Como funciona ──────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 animate-on-scroll">
            <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
              🚀 Processo simples
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-dark">
              Comece em 4 passos
            </h2>
          </div>

          {/* Desktop: horizontal timeline — each step staggered 200 ms */}
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
                <div className="relative z-10 h-16 w-16 rounded-full bg-brand-green flex items-center justify-center text-white font-heading font-extrabold text-2xl shadow-lg mb-4">
                  {passo.num}
                </div>
                <span className="text-3xl mb-3">{passo.emoji}</span>
                <h3 className="font-heading font-bold text-brand-dark text-center text-sm mb-2 px-4">
                  {passo.titulo}
                </h3>
                <p className="text-brand-muted text-xs text-center leading-relaxed px-4">
                  {passo.texto}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile: vertical list — each step staggered 200 ms */}
          <div className="md:hidden space-y-6">
            {passos.map((passo, idx) => (
              <div
                key={passo.num}
                className="flex items-start gap-5 animate-on-scroll"
                style={{ transitionDelay: `${idx * 200}ms` }}
              >
                <div className="h-12 w-12 rounded-full bg-brand-green flex items-center justify-center text-white font-heading font-extrabold text-xl flex-shrink-0">
                  {passo.num}
                </div>
                <div>
                  <p className="text-xl mb-1">{passo.emoji}</p>
                  <h3 className="font-heading font-bold text-brand-dark text-sm mb-1">
                    {passo.titulo}
                  </h3>
                  <p className="text-brand-muted text-xs leading-relaxed">{passo.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seção 5: Diferenciais ───────────────────────────────────────── */}
      <section className="bg-brand-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
              🏆 Nossos diferenciais
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-dark">
              Por que escolher a Painel Clean?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {beneficios.map(({ emoji, titulo, texto }, idx) => (
              <div
                key={titulo}
                className="bg-white rounded-2xl border border-brand-light p-6 flex gap-4 hover:shadow-card-hover transition-shadow animate-on-scroll"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <span className="text-3xl flex-shrink-0">{emoji}</span>
                <div>
                  <h3 className="font-heading font-bold text-brand-dark text-sm mb-1">{titulo}</h3>
                  <p className="text-brand-muted text-xs leading-relaxed">{texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seção 6: Planos de assinatura ────────────────────────────────── */}
      <section
        id="planos"
        className="py-20 animate-on-scroll"
        style={{ background: "#1B3A2D" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3">
              Escolha o plano ideal para sua usina
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "#3DC45A" }}>
              Todos os planos incluem 2 limpezas/ano, relatório mensal, checkup técnico e seguro na limpeza.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

            {/* Card Básico */}
            <div
              className="flex flex-col gap-5 animate-on-scroll"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "20px",
                padding: "2.5rem",
                position: "relative",
                overflow: "hidden",
                transitionDelay: "0ms",
              }}
            >
              <BannerParticles />
              <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1 }}>
                <span className="self-start h-6" />
                <p style={{ fontSize: "20px", fontWeight: 600, color: "#EBF3E8", fontFamily: "var(--font-heading)" }}>
                  Básico
                </p>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span style={{ fontSize: "52px", fontWeight: 700, color: "#ffffff", lineHeight: 1, fontFamily: "var(--font-heading)" }}>
                      R$ 30
                    </span>
                    <span style={{ fontSize: "18px", color: "#7A9A84" }}>/mês</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "#7A9A84", marginTop: "4px" }}>até 15 módulos</p>
                </div>
                <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)" }} />
                <ul className="flex flex-col gap-2.5 flex-1">
                  {itensBase.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <span style={{ color: "#3DC45A", fontWeight: 700, marginTop: "2px" }}>✓</span>
                      <span style={{ color: "rgba(235,243,232,0.8)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/cadastro"
                  className="block w-full text-center font-heading font-bold text-sm px-6 py-3.5 rounded-xl transition-colors border-[1.5px] border-brand-green text-brand-green hover:bg-brand-green hover:text-brand-dark"
                >
                  Começar com Básico
                </Link>
              </div>
            </div>

            {/* Card Padrão — destaque, ligeiramente maior */}
            <div
              className="flex flex-col gap-5 animate-on-scroll"
              style={{
                background: "#3DC45A",
                borderRadius: "20px",
                padding: "2.5rem",
                marginTop: "-16px",
                transitionDelay: "150ms",
              }}
            >
              <span
                className="self-start font-bold uppercase tracking-wider"
                style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff", fontSize: "11px", padding: "4px 12px", borderRadius: "999px" }}
              >
                MAIS POPULAR
              </span>
              <p style={{ fontSize: "20px", fontWeight: 600, color: "#1B3A2D", fontFamily: "var(--font-heading)" }}>
                Padrão
              </p>
              <div>
                <div className="flex items-baseline gap-1">
                  <span style={{ fontSize: "52px", fontWeight: 700, color: "#1B3A2D", lineHeight: 1, fontFamily: "var(--font-heading)" }}>
                    R$ 50
                  </span>
                  <span style={{ fontSize: "18px", color: "rgba(27,58,45,0.6)" }}>/mês</span>
                </div>
                <p style={{ fontSize: "14px", color: "rgba(27,58,45,0.7)", marginTop: "4px" }}>16 a 30 módulos</p>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid rgba(27,58,45,0.15)" }} />
              <ul className="flex flex-col gap-2.5 flex-1">
                {itensBase.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span style={{ color: "#1B3A2D", fontWeight: 700, marginTop: "2px" }}>✓</span>
                    <span style={{ color: "rgba(27,58,45,0.85)" }}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/cadastro"
                className="block w-full text-center font-heading font-bold text-sm px-6 py-3.5 rounded-xl transition-colors bg-brand-dark text-white hover:bg-brand-dark/85"
              >
                Começar com Padrão
              </Link>
            </div>

            {/* Card Plus */}
            <div
              className="flex flex-col gap-5 animate-on-scroll"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "20px",
                padding: "2.5rem",
                position: "relative",
                overflow: "hidden",
                transitionDelay: "300ms",
              }}
            >
              <BannerParticles />
              <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1 }}>
                <span className="self-start h-6" />
                <p style={{ fontSize: "20px", fontWeight: 600, color: "#EBF3E8", fontFamily: "var(--font-heading)" }}>
                  Plus
                </p>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span style={{ fontSize: "52px", fontWeight: 700, color: "#ffffff", lineHeight: 1, fontFamily: "var(--font-heading)" }}>
                      R$ 100
                    </span>
                    <span style={{ fontSize: "18px", color: "#7A9A84" }}>/mês</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "#7A9A84", marginTop: "4px" }}>31 a 60 módulos</p>
                </div>
                <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)" }} />
                <ul className="flex flex-col gap-2.5 flex-1">
                  {[...itensBase, "Alertas de queda de performance"].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <span style={{ color: "#3DC45A", fontWeight: 700, marginTop: "2px" }}>✓</span>
                      <span style={{ color: "rgba(235,243,232,0.8)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/cadastro"
                  className="block w-full text-center font-heading font-bold text-sm px-6 py-3.5 rounded-xl transition-colors border-[1.5px] border-brand-green text-brand-green hover:bg-brand-green hover:text-brand-dark"
                >
                  Começar com Plus
                </Link>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <p className="text-center mt-10">
            <Link
              href="/cadastro"
              className="text-sm transition-colors text-white/50 hover:text-white"
            >
              Usina com 60+ módulos? Fale conosco sobre o Plano Pro →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Seção 7: Seja um técnico ───────────────────────────────────── */}
      <section className="bg-brand-dark py-20 animate-on-scroll relative overflow-hidden">
        <TecnicoParticles />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
                🔧 Para profissionais
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                Seja um técnico Painel Clean
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Atenda assinantes fixos na sua região. Agenda garantida, sem depender de chamados avulsos.
              </p>
              <Link
                href="/cadastro?role=tecnico"
                className="inline-flex items-center gap-2 bg-brand-green text-white font-heading font-bold text-base px-8 py-4 rounded-xl hover:bg-brand-green/90 transition-colors shadow-lg"
              >
                Cadastrar como técnico →
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
              {[
                { icon: "📅", titulo: "Agenda previsível",    texto: "Atenda assinantes fixos com limpezas programadas. Saiba com antecedência quando vai trabalhar." },
                { icon: "💰", titulo: "Repasse simplificado", texto: "Receba via PIX automaticamente após a conclusão de cada serviço. Sem burocracia." },
                { icon: "📱", titulo: "Gerencie pelo app",    texto: "Aceite chamados, registre relatórios e acompanhe seus ganhos em tempo real." },
                { icon: "🛡️", titulo: "Seguro incluso",       texto: "Todos os serviços incluem cobertura contra danos acidentais durante a limpeza." },
              ].map(({ icon, titulo, texto }) => (
                <div key={titulo} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <span className="text-2xl">{icon}</span>
                  <p className="font-heading font-bold text-white text-sm mt-2 mb-1">{titulo}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{texto}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 8: CTA Final ────────────────────────────────────────── */}
      <section className="bg-brand-light py-20 border-t border-brand-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-dark mb-4 leading-tight">
            Comece sua assinatura hoje
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            Primeira limpeza com 50% de desconto. Técnico certificado em até 48h.
          </p>
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 bg-brand-green text-white font-heading font-bold text-lg px-10 py-5 rounded-2xl hover:bg-brand-green/90 transition-colors shadow-lg"
          >
            Escolher meu plano →
          </Link>
          <p className="text-gray-400 text-sm mt-5">
            Sem fidelidade no 1º mês. Cancele a qualquer momento.
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-brand-dark border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <Logo inverted size="sm" />
              <p className="text-white/50 text-xs mt-3 leading-relaxed max-w-xs">
                Plataforma de assinatura para limpeza profissional de painéis solares. Conectando donos de usinas a técnicos certificados.
              </p>
            </div>

            {/* Links */}
            <div>
              <p className="text-white/80 font-semibold text-sm mb-4">Links</p>
              <div className="space-y-2 text-white/50 text-sm">
                <p><a href="#hero" className="hover:text-white/80 transition-colors">Início</a></p>
                <p><a href="#calculadora" className="hover:text-white/80 transition-colors">Calculadora</a></p>
                <p><a href="#planos" className="hover:text-white/80 transition-colors">Planos</a></p>
                <p><Link href="/login" className="hover:text-white/80 transition-colors">Entrar</Link></p>
                <p><Link href="/cadastro" className="hover:text-white/80 transition-colors">Cadastrar-se</Link></p>
                <p><Link href="/termos" className="hover:text-white/80 transition-colors">Termos de Uso</Link></p>
              </div>
            </div>

            {/* Cidades */}
            <div>
              <p className="text-white/80 font-semibold text-sm mb-4">Cidades atendidas</p>
              <div className="space-y-1.5 text-white/50 text-sm">
                <p>📍 Jaraguá do Sul, SC</p>
                <p>📍 Pomerode, SC</p>
                <p>📍 Florianópolis, SC</p>
              </div>
              <p className="text-white/30 text-xs mt-4">
                Expansão para novas cidades em breve
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} Painel Clean. Todos os direitos reservados.
            </p>
            <a
              href="https://painelclean.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 text-xs hover:text-white/60 transition-colors"
            >
              painelclean.com.br ↗
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
