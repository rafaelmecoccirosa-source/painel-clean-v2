import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/layout/Logo";
import Button from "@/components/ui/Button";
import { ArrowRight, Zap, UserCheck, CalendarCheck, BadgeCheck, Users, TrendingUp } from "lucide-react";

const HERO_IMG = "https://painelclean.com.br/wp-content/uploads/2025/03/painel-clean-carrossel-trabalhador-2.png";
const USINA_IMG = "https://painelclean.com.br/wp-content/uploads/2025/03/Mask-group-2-1024x898.png";
const TECNICO_IMG = "https://painelclean.com.br/wp-content/uploads/2025/03/Mask-group-4.png";

const diferenciais = [
  {
    icon: Zap,
    title: "Eficiência e segurança",
    desc: "Utilizamos escovas projetadas para máxima eficiência sem danificar as placas.",
  },
  {
    icon: UserCheck,
    title: "Profissionais qualificados",
    desc: "Todos os serviços são realizados por especialistas cadastrados e treinados pela Painel Clean.",
  },
  {
    icon: CalendarCheck,
    title: "Agilidade e facilidade",
    desc: "Agende sua limpeza sem complicação e mantenha sua geração de energia no máximo.",
  },
];

const beneficiosTecnico = [
  { icon: Users, text: "Agenda sempre cheia com clientes da plataforma" },
  { icon: BadgeCheck, text: "Treinamento e suporte completo da Painel Clean" },
  { icon: TrendingUp, text: "Previsibilidade de receita e pagamento garantido" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-bg">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-brand-light border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-brand-dark/70 hover:text-brand-dark text-sm font-medium transition-colors"
            >
              Entrar
            </Link>
            <Link href="/cadastro">
              <Button size="sm" variant="primary">Cadastrar-se</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-[580px] flex items-center">
        {/* background image */}
        <Image
          src={HERO_IMG}
          alt="Técnico realizando limpeza de placas solares"
          fill
          className="object-cover object-center"
          priority
        />
        {/* dark overlay */}
        <div className="absolute inset-0 bg-brand-dark/75" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-4">
            Plataforma de limpeza solar
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold leading-tight mb-6 max-w-2xl">
            Serviço profissional de limpeza de placas solares
          </h1>
          <p className="text-white/75 text-lg mb-10 max-w-xl leading-relaxed">
            A energia solar é um investimento valioso, e a sujeira acumulada nas
            placas pode reduzir sua eficiência em até{" "}
            <span className="text-brand-green font-semibold">30%</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/cadastro">
              <Button size="lg" variant="primary" className="w-full sm:w-auto">
                Solicitar limpeza
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/cadastro?role=tecnico">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Quero ser técnico
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Diferenciais ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
              Por que escolher a Painel Clean?
            </p>
            <h2 className="font-heading text-3xl font-bold text-brand-dark">
              Nossos diferenciais
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {diferenciais.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col items-start gap-4 bg-brand-bg rounded-2xl border border-brand-border p-8 hover:shadow-card-hover transition-shadow"
              >
                <div className="h-12 w-12 rounded-xl bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={24} className="text-brand-green" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-brand-dark mb-2">
                    {title}
                  </h3>
                  <p className="text-brand-muted text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Não importa o tamanho da sua usina ── */}
      <section className="bg-brand-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-4">
                Para qualquer instalação
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-dark leading-tight mb-6">
                Não importa o tamanho da sua usina!
              </h2>
              <p className="text-brand-muted text-base leading-relaxed mb-8">
                Atendemos desde residências com poucos módulos até grandes usinas
                industriais. Nossos técnicos são treinados para trabalhar com
                segurança e eficiência em qualquer escala.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { range: "Até 10 módulos", price: "R$ 180" },
                  { range: "11 a 30 módulos", price: "R$ 300" },
                  { range: "31 a 60 módulos", price: "R$ 520" },
                  { range: "61+ módulos", price: "Sob consulta" },
                ].map(({ range, price }) => (
                  <div
                    key={range}
                    className="bg-white rounded-xl border border-brand-border p-4"
                  >
                    <p className="text-xs text-brand-muted mb-1">{range}</p>
                    <p className="font-heading font-bold text-brand-dark text-lg">{price}</p>
                  </div>
                ))}
              </div>
              <Link href="/cadastro">
                <Button size="lg" variant="primary">
                  Solicitar limpeza
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>

            <div className="relative h-80 lg:h-[460px] rounded-2xl overflow-hidden shadow-card-hover">
              <Image
                src={USINA_IMG}
                alt="Usinas de diferentes tamanhos atendidas pela Painel Clean"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Para técnicos ── */}
      <section className="bg-brand-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 lg:h-[460px] rounded-2xl overflow-hidden shadow-card-hover order-2 lg:order-1">
              <Image
                src={TECNICO_IMG}
                alt="Técnico parceiro Painel Clean"
                fill
                className="object-cover object-center"
              />
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-4">
                Para profissionais
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                Deseja ter sua agenda lotada?
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Seja um parceiro oficial Painel Clean!
              </p>
              <ul className="space-y-4 mb-10">
                {beneficiosTecnico.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-brand-green/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={20} className="text-brand-green" />
                    </div>
                    <p className="text-white/85 text-base leading-snug pt-2">{text}</p>
                  </li>
                ))}
              </ul>
              <Link href="/cadastro?role=tecnico">
                <Button size="lg" variant="primary">
                  Quero ser técnico
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-brand-dark border-t border-white/10 text-white/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo inverted size="sm" />
          <p className="text-xs">
            © {new Date().getFullYear()} Painel Clean. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
