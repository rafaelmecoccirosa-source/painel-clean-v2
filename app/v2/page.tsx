import type { Metadata } from "next";
import ScrollAnimations    from "@/components/home/ScrollAnimations";
import FAQ                 from "@/components/home/FAQ";
import Header              from "@/components/landing-v2/Header";
import Hero                from "@/components/landing-v2/Hero";
import StatsBar            from "@/components/landing-v2/StatsBar";
import Calculadora         from "@/components/landing-v2/Calculadora";
import ComoFunciona        from "@/components/landing-v2/ComoFunciona";
import DiferencialTecnico  from "@/components/landing-v2/DiferencialTecnico";
import Diferenciais        from "@/components/landing-v2/Diferenciais";
import Testimonials        from "@/components/landing-v2/Testimonials";
import Planos              from "@/components/landing-v2/Planos";
import Coverage            from "@/components/landing-v2/Coverage";
import CTAFinal            from "@/components/landing-v2/CTAFinal";
import ParaTecnicos        from "@/components/landing-v2/ParaTecnicos";
import Footer              from "@/components/landing-v2/Footer";

export const metadata: Metadata = {
  title: "Painel Clean — Assinatura de limpeza de painéis solares em SC",
  description:
    "Planos a partir de R$ 30/mês. Técnicos certificados, relatório fotográfico, 1ª limpeza com 50% off. Jaraguá do Sul, Pomerode e Florianópolis.",
};

export default function LandingV2() {
  return (
    <>
      <ScrollAnimations />
      <Header />
      <main>
        <Hero />
        <StatsBar />
        <Calculadora />
        <ComoFunciona />
        <DiferencialTecnico />
        <Diferenciais />
        <Testimonials />
        <Planos />
        <Coverage />
        <FAQ />
        <CTAFinal />
        <ParaTecnicos />
      </main>
      <Footer />
    </>
  );
}
