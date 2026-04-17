import Link from "next/link";
import Logo from "@/components/layout/Logo";
import HeroSection from "@/components/home/HeroSection";
import CalculadoraEconomia from "@/components/home/CalculadoraEconomia";
import ScrollAnimations from "@/components/home/ScrollAnimations";
import { TecnicoParticles } from "@/components/TecnicoParticles";
import { BannerParticles } from "@/components/BannerParticles";
import FAQ from "@/components/home/FAQ";

// ── Seção 2 — Como se paga em 4 dias ──────────────────────────────────────

const IconPanelBasico = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="10" width="32" height="20" rx="2" stroke="#3DC45A" strokeWidth="2"/>
    <line x1="4" y1="17" x2="36" y2="17" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="4" y1="24" x2="36" y2="24" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="15" y1="10" x2="15" y2="30" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="25" y1="10" x2="25" y2="30" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="20" y1="30" x2="20" y2="36" stroke="#3DC45A" strokeWidth="2"/>
    <line x1="14" y1="36" x2="26" y2="36" stroke="#3DC45A" strokeWidth="2"/>
  </svg>
);

const IconPanelPadrao = () => (
  <svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="10" width="20" height="14" rx="2" stroke="#3DC45A" strokeWidth="2"/>
    <line x1="2" y1="15" x2="22" y2="15" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="2" y1="20" x2="22" y2="20" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="9" y1="10" x2="9" y2="24" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="15" y1="10" x2="15" y2="24" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="12" y1="24" x2="12" y2="30" stroke="#3DC45A" strokeWidth="2"/>
    <line x1="7" y1="30" x2="17" y2="30" stroke="#3DC45A" strokeWidth="2"/>
    <rect x="26" y="10" width="20" height="14" rx="2" stroke="#3DC45A" strokeWidth="2"/>
    <line x1="26" y1="15" x2="46" y2="15" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="26" y1="20" x2="46" y2="20" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="33" y1="10" x2="33" y2="24" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="39" y1="10" x2="39" y2="24" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="36" y1="24" x2="36" y2="30" stroke="#3DC45A" strokeWidth="2"/>
    <line x1="31" y1="30" x2="41" y2="30" stroke="#3DC45A" strokeWidth="2"/>
  </svg>
);

const IconPanelPlus = () => (
  <svg width="48" height="44" viewBox="0 0 48 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4L44 16V38H4V16L24 4Z" stroke="#3DC45A" strokeWidth="2" fill="none"/>
    <rect x="8" y="18" width="10" height="8" rx="1" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="8" y1="22" x2="18" y2="22" stroke="#3DC45A" strokeWidth="1"/>
    <line x1="13" y1="18" x2="13" y2="26" stroke="#3DC45A" strokeWidth="1"/>
    <rect x="19" y="18" width="10" height="8" rx="1" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="19" y1="22" x2="29" y2="22" stroke="#3DC45A" strokeWidth="1"/>
    <line x1="24" y1="18" x2="24" y2="26" stroke="#3DC45A" strokeWidth="1"/>
    <rect x="30" y="18" width="10" height="8" rx="1" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="30" y1="22" x2="40" y2="22" stroke="#3DC45A" strokeWidth="1"/>
    <line x1="35" y1="18" x2="35" y2="26" stroke="#3DC45A" strokeWidth="1"/>
    <rect x="13" y="28" width="10" height="8" rx="1" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="13" y1="32" x2="23" y2="32" stroke="#3DC45A" strokeWidth="1"/>
    <line x1="18" y1="28" x2="18" y2="36" stroke="#3DC45A" strokeWidth="1"/>
    <rect x="25" y="28" width="10" height="8" rx="1" stroke="#3DC45A" strokeWidth="1.5"/>
    <line x1="25" y1="32" x2="35" y2="32" stroke="#3DC45A" strokeWidth="1"/>
    <line x1="30" y1="28" x2="30" y2="36" stroke="#3DC45A" strokeWidth="1"/>
  </svg>
);

const paybackCards = [
  { Icon: IconPanelBasico, plano: "Plano Básico", modulos: "até 15 módulos",   prejuizoMes: "R$ 218", mensalidade: "R$ 30/mês"  },
  { Icon: IconPanelPadrao, plano: "Plano Padrão", modulos: "16 a 30 módulos",  prejuizoMes: "R$ 365", mensalidade: "R$ 50/mês"  },
  { Icon: IconPanelPlus,   plano: "Plano Plus",   modulos: "31 a 60 módulos",  prejuizoMes: "R$ 729", mensalidade: "R$ 100/mês" },
];

// ── Seção 4 — Como funciona (v2 — assinatura) ─────────────────────────────

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
    texto: "As próximas limpezas são agendadas automaticamente. Se precisar de uma limpeza extra, assinantes têm desconto especial.",
  },
];

// ── Planos de assinatura ──────────────────────────────────────────────────

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

      {/* ── Prova social ────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-b border-brand-border py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Big numbers */}
          <div className="grid grid-cols-3 gap-6 text-center animate-on-scroll mb-3">
            {[
              { valor: "500+",   label: "Usinas monitoradas em SC" },
              { valor: "100%",   label: "Clientes satisfeitos" },
              { valor: "4 dias", label: "Tempo médio para recuperar o investimento" },
            ].map(({ valor, label }) => (
              <div key={label}>
                <p className="font-heading font-extrabold text-brand-dark" style={{ fontSize: "2.25rem", lineHeight: 1 }}>
                  {valor}
                </p>
                <p className="text-brand-muted text-xs mt-2 leading-snug">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-brand-muted/60 mb-12">
            *Dados do período de validação com parceiros Painel Clean
          </p>

          {/* Depoimentos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                nome: "Carlos Mendonça",
                cidade: "Jaraguá do Sul, SC",
                iniciais: "CM",
                texto: "Depois de 6 meses sem limpar, minha usina estava gerando 28% menos. A primeira limpeza se pagou em menos de 2 semanas. Agora tenho o relatório todo mês e durmo tranquilo.",
              },
              {
                nome: "Ana Paula Ritter",
                cidade: "Pomerode, SC",
                iniciais: "AP",
                texto: "O relatório mensal me mostrou que um painel estava com problema. O técnico veio, identificou e resolveu. Sem a assinatura eu nunca saberia.",
              },
              {
                nome: "Roberto Schaefer",
                cidade: "Florianópolis, SC",
                iniciais: "RS",
                texto: "Tenho 40 módulos e pagava R$ 800 por limpeza avulsa. Com o plano Plus pago R$ 100/mês e tenho 2 limpezas por ano mais monitoramento. Não faz mais sentido fazer avulso.",
              },
            ].map(({ nome, cidade, iniciais, texto }, idx) => (
              <div
                key={nome}
                className="bg-white rounded-2xl p-6 flex flex-col gap-4 animate-on-scroll"
                style={{ border: "1px solid #C8DFC0", transitionDelay: `${idx * 150}ms` }}
              >
                <p className="text-brand-dark/20 font-serif text-5xl leading-none select-none">"</p>
                <p className="text-brand-muted text-sm leading-relaxed flex-1 -mt-4">{texto}</p>
                <div className="flex items-center gap-3 pt-2 border-t border-brand-border">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                    style={{ background: "#1B3A2D" }}
                  >
                    {iniciais}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-brand-dark text-sm leading-none">{nome}</p>
                    <p className="text-brand-muted text-[11px] mt-0.5">{cidade}</p>
                  </div>
                  <span className="ml-auto text-yellow-400 text-sm">★★★★★</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seção 2: Como se paga em 4 dias ──────────────────────────────── */}
      <section style={{ background: "#E8F0E4", paddingTop: "5rem", paddingBottom: "5rem" }}>
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
            {paybackCards.map(({ Icon, plano, modulos, prejuizoMes, mensalidade }, idx) => (
              <div
                key={plano}
                className="flex flex-col animate-on-scroll overflow-hidden"
                style={{
                  border: "1px solid #C8DFC0",
                  borderRadius: "16px",
                  transitionDelay: `${idx * 150}ms`,
                }}
              >
                {/* Topo escuro — ícone + título + faixa */}
                <div
                  className="relative overflow-hidden"
                  style={{ background: "#1B3A2D", padding: "1.5rem" }}
                >
                  <BannerParticles />
                  <div className="relative flex items-center gap-3" style={{ zIndex: 2 }}>
                    <Icon />
                    <div>
                      <h3 className="font-heading font-bold" style={{ fontSize: "20px", color: "#ffffff", lineHeight: 1.2 }}>
                        {plano}
                      </h3>
                      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>{modulos}</p>
                    </div>
                  </div>
                </div>

                {/* Base branca — valores + CTA */}
                <div className="flex flex-col gap-4 flex-1 bg-white" style={{ padding: "1.5rem" }}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: "#7A9A84" }}>Prejuízo/mês por sujeira</span>
                      <span className="font-bold" style={{ color: "#E24B4A" }}>{prejuizoMes}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: "#7A9A84" }}>Mensalidade</span>
                      <span className="font-bold" style={{ color: "#1B3A2D" }}>{mensalidade}</span>
                    </div>
                  </div>
                  <div
                    className="mt-auto rounded-xl px-4 py-2.5 text-center"
                    style={{ background: "#3DC45A1A" }}
                  >
                    <span className="font-heading font-bold text-sm" style={{ color: "#3DC45A" }}>
                      ✅ Se paga em ~4 dias
                    </span>
                  </div>
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

      {/* ── Seção de planos ──────────────────────────────────────────────── */}
      <section id="planos" className="pt-20 pb-20 animate-on-scroll bg-brand-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3 text-brand-dark">
              Escolha o plano ideal para sua usina
            </h2>
            <p className="text-base max-w-xl mx-auto text-brand-green">
              Todos os planos incluem 2 limpezas/ano, relatório mensal, checkup técnico e seguro na limpeza.
            </p>
          </div>

          {/* Cards — todos iguais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

            {/* Básico */}
            <div
              className="bg-white flex flex-col gap-5 animate-on-scroll"
              style={{ border: "1px solid #C8DFC0", borderRadius: "20px", padding: "2.5rem", transitionDelay: "0ms" }}
            >
              <div>
                <p className="font-heading font-semibold text-brand-dark" style={{ fontSize: "20px" }}>Básico</p>
                <p className="text-brand-muted" style={{ fontSize: "14px", marginTop: "2px" }}>até 15 módulos</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-heading font-bold text-brand-dark" style={{ fontSize: "52px", lineHeight: 1 }}>R$ 30</span>
                <span className="text-brand-muted" style={{ fontSize: "18px" }}>/mês</span>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #C8DFC0" }} />
              <ul className="flex flex-col gap-2.5 flex-1">
                {itensBase.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span className="text-brand-green font-bold mt-0.5">✓</span>
                    <span className="text-brand-muted">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/cadastro"
                className="block w-full text-center font-heading font-bold text-sm px-6 py-3.5 rounded-xl transition-colors hover:opacity-90"
                style={{ background: "#3DC45A", color: "#1B3A2D" }}
              >
                Começar com Básico
              </Link>
            </div>

            {/* Padrão */}
            <div
              className="bg-white flex flex-col gap-5 animate-on-scroll"
              style={{ border: "1px solid #C8DFC0", borderRadius: "20px", padding: "2.5rem", transitionDelay: "150ms" }}
            >
              <div>
                <p className="font-heading font-semibold text-brand-dark" style={{ fontSize: "20px" }}>Padrão</p>
                <p className="text-brand-muted" style={{ fontSize: "14px", marginTop: "2px" }}>16 a 30 módulos</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-heading font-bold text-brand-dark" style={{ fontSize: "52px", lineHeight: 1 }}>R$ 50</span>
                <span className="text-brand-muted" style={{ fontSize: "18px" }}>/mês</span>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #C8DFC0" }} />
              <ul className="flex flex-col gap-2.5 flex-1">
                {itensBase.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span className="text-brand-green font-bold mt-0.5">✓</span>
                    <span className="text-brand-muted">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/cadastro"
                className="block w-full text-center font-heading font-bold text-sm px-6 py-3.5 rounded-xl transition-colors hover:opacity-90"
                style={{ background: "#3DC45A", color: "#1B3A2D" }}
              >
                Começar com Padrão
              </Link>
            </div>

            {/* Plus */}
            <div
              className="bg-white flex flex-col gap-5 animate-on-scroll"
              style={{ border: "1px solid #C8DFC0", borderRadius: "20px", padding: "2.5rem", transitionDelay: "300ms" }}
            >
              <div>
                <p className="font-heading font-semibold text-brand-dark" style={{ fontSize: "20px" }}>Plus</p>
                <p className="text-brand-muted" style={{ fontSize: "14px", marginTop: "2px" }}>31 a 60 módulos</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-heading font-bold text-brand-dark" style={{ fontSize: "52px", lineHeight: 1 }}>R$ 100</span>
                <span className="text-brand-muted" style={{ fontSize: "18px" }}>/mês</span>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #C8DFC0" }} />
              <ul className="flex flex-col gap-2.5 flex-1">
                {[...itensBase, "Alertas de queda de performance"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span className="text-brand-green font-bold mt-0.5">✓</span>
                    <span className="text-brand-muted">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/cadastro"
                className="block w-full text-center font-heading font-bold text-sm px-6 py-3.5 rounded-xl transition-colors hover:opacity-90"
                style={{ background: "#3DC45A", color: "#1B3A2D" }}
              >
                Começar com Plus
              </Link>
            </div>
          </div>

          {/* Link Pro */}
          <p className="text-center mt-10 animate-on-scroll">
            <Link href="/cadastro" className="text-sm text-brand-muted hover:text-brand-dark transition-colors">
              Usina com 60+ módulos? Fale conosco sobre o Plano Pro →
            </Link>
          </p>

          {/* Avulso discreto */}
          <div className="mt-8 pt-8 border-t border-brand-border text-center animate-on-scroll">
            <p className="text-brand-muted text-sm mb-3">Prefere uma limpeza sem compromisso?</p>
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors px-4 py-2 rounded-lg text-brand-muted hover:text-brand-dark"
              style={{ border: "1px solid #C8DFC0" }}
            >
              Solicitar limpeza avulsa →
            </Link>
            <p className="text-xs text-brand-muted mt-3" style={{ opacity: 0.7 }}>
              Valores a partir de R$ 30/placa · Sem contrato
            </p>
          </div>

        </div>
      </section>

      {/* ── Como funciona ────────────────────────────────────────────────── */}
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
                <div className="relative z-10 h-16 w-16 rounded-full bg-brand-green flex items-center justify-center text-white font-heading font-extrabold text-2xl shadow-lg mb-4">
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
                className="flex items-start gap-5 animate-on-scroll"
                style={{ transitionDelay: `${idx * 200}ms` }}
              >
                <div className="h-12 w-12 rounded-full bg-brand-green flex items-center justify-center text-white font-heading font-extrabold text-xl flex-shrink-0">
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

      {/* ── Seja um técnico ───────────────────────────────────────────────── */}
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

      {/* ── Onde atuamos ─────────────────────────────────────────────────── */}
      <section className="py-20 animate-on-scroll" style={{ background: "#1B3A2D" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* Coluna esquerda */}
            <div>
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
                style={{ background: "#3DC45A22", color: "#3DC45A" }}
              >
                Cobertura atual
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
                Atendemos 3 cidades em SC
              </h2>
              <p className="text-white/60 text-base mb-7">
                Com expansão para mais 4 cidades no segundo semestre de 2026.
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {["Jaraguá do Sul", "Pomerode", "Florianópolis"].map((cidade) => (
                  <li key={cidade} className="flex items-center gap-3">
                    <span className="font-bold flex-shrink-0" style={{ color: "#3DC45A" }}>✓</span>
                    <span className="text-white text-sm">{cidade}, SC</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/cadastro"
                className="inline-flex items-center gap-2 font-heading font-bold text-sm px-6 py-3.5 transition-colors hover:opacity-90"
                style={{ background: "#3DC45A", color: "#1B3A2D", borderRadius: "8px" }}
              >
                Garantir minha vaga →
              </Link>
            </div>

            {/* Coluna direita */}
            <div
              className="rounded-2xl p-6 flex flex-col gap-5"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <p className="font-heading font-bold text-white text-base">🕐 Em breve</p>
              <ul className="flex flex-col gap-3">
                {["Blumenau", "Itajaí", "Brusque", "Gaspar"].map((cidade) => (
                  <li key={cidade} className="flex items-center gap-3">
                    <span className="text-base flex-shrink-0">🕐</span>
                    <span className="text-white/60 text-sm">{cidade}, SC</span>
                  </li>
                ))}
              </ul>
              <p className="text-white/50 text-sm leading-relaxed border-t border-white/10 pt-4">
                Cadastre-se para ser notificado quando chegarmos na sua cidade.
              </p>
              <Link
                href="/cadastro"
                className="inline-flex items-center justify-center gap-2 font-heading font-bold text-sm px-5 py-3 rounded-xl transition-colors hover:bg-white/10 text-center"
                style={{ border: "1px solid rgba(255,255,255,0.3)", color: "white" }}
              >
                Entrar na lista de espera →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <FAQ />

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
