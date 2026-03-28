import Link from "next/link";
import Logo from "@/components/layout/Logo";
import Button from "@/components/ui/Button";
import { Sun, Shield, Star, ArrowRight, CheckCircle2 } from "lucide-react";

const benefits = [
  "Técnicos verificados e certificados",
  "Orçamento gratuito em minutos",
  "Agendamento online flexível",
  "Garantia de satisfação",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header público */}
      <header className="bg-brand-light border-b border-brand-border">
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
              <Button size="sm" variant="primary">
                Cadastrar-se
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-brand text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Sun size={14} className="text-brand-green" />
            Maximize a eficiência do seu sistema solar
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            Limpeza profissional de{" "}
            <span className="text-brand-green">placas solares</span>
            <br />
            na palma da sua mão
          </h1>
          <p className="text-white/75 text-lg mb-10 max-w-2xl mx-auto">
            Painéis sujos perdem até 30% de eficiência. Conecte-se com técnicos
            certificados na sua região e mantenha seu investimento rendendo ao
            máximo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro">
              <Button size="lg" variant="primary" className="w-full sm:w-auto">
                Solicitar limpeza grátis
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/login?role=tecnico">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                Sou técnico
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-3 bg-white rounded-2xl border border-brand-border shadow-card p-5"
            >
              <CheckCircle2 size={20} className="text-brand-green flex-shrink-0" />
              <span className="text-sm font-medium text-brand-dark">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="font-heading text-2xl font-bold text-brand-dark text-center mb-10">
          Como funciona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Sun,
              step: "01",
              title: "Solicite online",
              desc: "Informe a quantidade de placas, endereço e disponibilidade. Levamos menos de 2 minutos.",
            },
            {
              icon: Shield,
              step: "02",
              title: "Receba orçamentos",
              desc: "Técnicos certificados na sua região enviam propostas competitivas. Você escolhe o melhor.",
            },
            {
              icon: Star,
              step: "03",
              title: "Serviço garantido",
              desc: "Acompanhe tudo pelo app. Após a limpeza, avalie o técnico e veja sua produção aumentar.",
            },
          ].map(({ icon: Icon, step, title, desc }) => (
            <div
              key={step}
              className="bg-white rounded-2xl border border-brand-border shadow-card p-6 hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
                  <Icon size={20} className="text-brand-green" />
                </div>
                <span className="text-3xl font-black text-brand-border">
                  {step}
                </span>
              </div>
              <h3 className="font-heading text-base font-semibold text-brand-dark mb-2">
                {title}
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark text-white/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo inverted size="sm" />
          <p className="text-xs">
            © {new Date().getFullYear()} PainelClean. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
