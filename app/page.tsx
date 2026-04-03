import Link from "next/link";
import Logo from "@/components/layout/Logo";
import HeroSection from "@/components/home/HeroSection";
import CalculadoraEconomia from "@/components/home/CalculadoraEconomia";
import ScrollAnimations from "@/components/home/ScrollAnimations";

// ── Seção 2 — Por que limpar? ──────────────────────────────────────────────

const motivoCards = [
  {
    emoji: "⚡",
    titulo: "Mais energia, mais economia",
    texto:
      "Painéis limpos produzem até 30% mais energia. Isso significa menos conta de luz e retorno mais rápido do seu investimento.",
  },
  {
    emoji: "🛡️",
    titulo: "Proteção do equipamento",
    texto:
      "Sujeira acumulada causa pontos quentes (hotspots) que podem danificar permanentemente seus placas.",
  },
  {
    emoji: "📊",
    titulo: "Relatório técnico incluso",
    texto:
      "Cada limpeza inclui inspeção visual, verificação de conexões e relatório fotográfico com o estado das suas placas.",
  },
];

// ── Seção 4 — Como funciona ───────────────────────────────────────────────

const passos = [
  {
    num: "1",
    emoji: "📱",
    titulo: "Solicite pelo app",
    texto: "Informe sua cidade, quantidade de placas e escolha a melhor data.",
  },
  {
    num: "2",
    emoji: "🔍",
    titulo: "Técnico certificado aceita",
    texto: "Profissionais aprovados pela Painel Clean recebem seu pedido e aceitam em minutos.",
  },
  {
    num: "3",
    emoji: "🧹",
    titulo: "Limpeza profissional",
    texto: "O técnico realiza a limpeza com equipamentos especializados e faz a inspeção completa.",
  },
  {
    num: "4",
    emoji: "📋",
    titulo: "Receba o relatório",
    texto: "Relatório fotográfico com antes/depois e diagnóstico técnico das suas placas.",
  },
];

// ── Seção 5 — Por que a Painel Clean? ────────────────────────────────────

const beneficios = [
  { emoji: "✅", titulo: "Técnicos certificados",      texto: "Todos os profissionais passam por treinamento e aprovação antes de atender." },
  { emoji: "⚡", titulo: "Agendamento dinâmico",       texto: "Sem espera. Você escolhe a data e o técnico mais próximo aceita rapidamente." },
  { emoji: "📸", titulo: "Relatório fotográfico",      texto: "Fotos antes e depois + diagnóstico técnico de cada placa." },
  { emoji: "💰", titulo: "Preço justo e transparente", texto: "Valores claros por faixa de placas. Sem surpresas na hora de pagar." },
  { emoji: "🔒", titulo: "Pagamento seguro",           texto: "PIX, cartão ou boleto. Pagamento só após o serviço concluído." },
  { emoji: "⭐", titulo: "Avaliação real",              texto: "Veja a nota de cada técnico antes de contratar. Transparência total." },
];

// ── Seção 6 — Faixas de preço ─────────────────────────────────────────────

const faixas = [
  {
    faixa: "Até 30 placas",
    valorPlaca: "R$ 20 a R$ 35/placa",
    exemplo: "20 placas ≈ R$ 550*",
    destaque: false,
    tag: undefined as string | undefined,
  },
  {
    faixa: "31–50 placas",
    valorPlaca: "R$ 15 a R$ 25/placa",
    exemplo: "40 placas ≈ R$ 800*",
    destaque: false,
    tag: undefined as string | undefined,
  },
  {
    faixa: "51–100 placas",
    valorPlaca: "R$ 10 a R$ 18/placa",
    exemplo: "80 placas ≈ R$ 1.120*",
    destaque: true,
    tag: "Mais popular",
  },
  {
    faixa: "101–200 placas",
    valorPlaca: "R$ 7 a R$ 12/placa",
    exemplo: "150 placas ≈ R$ 1.425*",
    destaque: false,
    tag: undefined as string | undefined,
  },
  {
    faixa: "200+ placas",
    valorPlaca: "Sob consulta",
    exemplo: "—",
    destaque: false,
    tag: undefined as string | undefined,
  },
];

// ─────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Mounts single IntersectionObserver for all .animate-on-scroll elements */}
      <ScrollAnimations />

      {/* ── Header fixo ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-brand-light border-b border-brand-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-brand-dark/70 hover:text-brand-dark text-sm font-medium transition-colors px-3 py-1.5"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="bg-brand-green text-white font-heading font-bold text-sm px-5 py-2 rounded-xl hover:bg-brand-green/90 transition-colors"
            >
              Cadastrar-se
            </Link>
          </div>
        </div>
      </header>

      {/* ── Seção 1: Hero — sem animação de scroll, já visível ao carregar ── */}
      <HeroSection />

      {/* ── Seção 2: Por que limpar? ─────────────────────────────────────── */}
      <section className="bg-brand-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading fades in from below */}
          <div className="text-center mb-12 animate-on-scroll">
            <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
              ☀️ Importância da manutenção
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-dark">
              Por que a limpeza é essencial?
            </h2>
          </div>

          {/* Cards: stagger 150 ms each */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {motivoCards.map(({ emoji, titulo, texto }, idx) => (
              <div
                key={titulo}
                className="bg-white rounded-2xl border border-brand-border p-8 flex flex-col gap-4 hover:shadow-card-hover transition-shadow animate-on-scroll"
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <span className="text-4xl">{emoji}</span>
                <h3 className="font-heading text-lg font-bold text-brand-dark">{titulo}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{texto}</p>
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
          {/* Heading */}
          <div className="text-center mb-14 animate-on-scroll">
            <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
              🚀 Processo simples
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-dark">
              Simples, rápido e sem dor de cabeça
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
                {/* Connector line */}
                {idx < passos.length - 1 && (
                  <div className="absolute top-8 left-1/2 w-full h-0.5 bg-brand-border" />
                )}

                {/* Circle */}
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

      {/* ── Seção 5: Por que a Painel Clean? ───────────────────────────── */}
      <section className="bg-brand-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-12 animate-on-scroll">
            <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
              🏆 Nossos diferenciais
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-dark">
              Por que escolher a Painel Clean?
            </h2>
          </div>

          {/* Grid: stagger 100 ms each */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {beneficios.map(({ emoji, titulo, texto }, idx) => (
              <div
                key={titulo}
                className="bg-white rounded-2xl border border-brand-light p-6 flex gap-4 hover:shadow-card-hover transition-shadow animate-on-scroll"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <span className="text-3xl flex-shrink-0">{emoji}</span>
                <div>
                  <h3 className="font-heading font-bold text-brand-dark text-sm mb-1">
                    {titulo}
                  </h3>
                  <p className="text-brand-muted text-xs leading-relaxed">{texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seção 6: Faixas de preço ─────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-12 animate-on-scroll">
            <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
              💰 Investimento acessível
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-dark mb-3">
              Preço por placa — economia de escala
            </h2>
            <p className="text-brand-muted text-base">Quanto mais placas, menor o custo unitário</p>
          </div>

          {/* Table: stagger 100 ms */}
          <div className="overflow-x-auto animate-on-scroll">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-brand-bg">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide rounded-tl-xl">Faixa</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Valor por placa</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide rounded-tr-xl">Exemplo</th>
                </tr>
              </thead>
              <tbody>
                {faixas.map(({ faixa, valorPlaca, exemplo, destaque, tag }, idx) => (
                  <tr
                    key={faixa}
                    className={`border-b border-brand-border ${destaque ? "bg-brand-light" : "bg-white"}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-brand-dark text-sm">{faixa}</span>
                        {tag && (
                          <span className="bg-brand-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                            {tag}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-heading font-bold text-brand-dark">{valorPlaca}</td>
                    <td className="px-5 py-4 text-sm text-brand-muted">{exemplo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-[11px] text-brand-muted mt-5">
            *Valores médios estimados para instalação em solo com sujeira normal. Valor final varia conforme
            tipo de telhado, nível de sujeira e acesso.
          </p>

          <div className="flex justify-center mt-6">
            <Link
              href="/cadastro"
              className="bg-brand-green text-white font-heading font-bold text-sm px-8 py-3 rounded-xl hover:bg-brand-green/90 transition-colors"
            >
              Calcular meu preço →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Seção 7: Seja um técnico ───────────────────────────────────── */}
      <section className="bg-brand-dark py-20 animate-on-scroll">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
                🔧 Para profissionais
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                Seja um técnico Painel Clean
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Cadastre-se na plataforma e comece a atender clientes na sua região. Cadastro gratuito, sem mensalidade.
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
                { icon: "✅", titulo: "Sem mensalidade",      texto: "Cadastro gratuito. Você paga apenas 25% de comissão por serviço realizado." },
                { icon: "💰", titulo: "Receba 75% do valor",  texto: "Num serviço de R$ 600, você recebe R$ 450 via PIX automático após conclusão." },
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

      {/* ── Seção 8: CTA Final — simple fade-in ─────────────────────────── */}
      <section className="bg-brand-dark py-20 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            Suas placas merecem render 100%
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Agende agora e receba seu relatório técnico após a limpeza
          </p>
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 bg-brand-green text-white font-heading font-bold text-lg px-10 py-5 rounded-2xl hover:bg-brand-green/90 transition-colors shadow-lg"
          >
            Quero agendar minha limpeza →
          </Link>
          <p className="text-white/40 text-sm mt-5">
            Sem compromisso. Cancele a qualquer momento.
          </p>
        </div>
      </section>

      {/* ── Seção 8: Footer ─────────────────────────────────────────────── */}
      <footer className="bg-brand-dark border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <Logo inverted size="sm" />
              <p className="text-white/50 text-xs mt-3 leading-relaxed max-w-xs">
                Plataforma de limpeza profissional de placas solares. Conectando donos de usinas a
                técnicos certificados.
              </p>
            </div>

            {/* Links */}
            <div>
              <p className="text-white/80 font-semibold text-sm mb-4">Links</p>
              <div className="space-y-2 text-white/50 text-sm">
                <p>
                  <a href="#hero" className="hover:text-white/80 transition-colors">
                    Início
                  </a>
                </p>
                <p>
                  <a href="#calculadora" className="hover:text-white/80 transition-colors">
                    Calculadora
                  </a>
                </p>
                <p>
                  <Link href="/login" className="hover:text-white/80 transition-colors">
                    Entrar
                  </Link>
                </p>
                <p>
                  <Link href="/cadastro" className="hover:text-white/80 transition-colors">
                    Cadastrar-se
                  </Link>
                </p>
                <p>
                  <Link href="/termos" className="hover:text-white/80 transition-colors">
                    Termos de Uso
                  </Link>
                </p>
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

      {/* ── Botão flutuante mobile ───────────────────────────────────────── */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
        <Link
          href="/cadastro"
          className="flex items-center justify-center gap-2 w-full bg-brand-green text-white font-heading font-bold text-base py-4 rounded-2xl shadow-lg hover:bg-brand-green/90 transition-colors"
        >
          ☀️ Agendar limpeza
        </Link>
      </div>
    </div>
  );
}
