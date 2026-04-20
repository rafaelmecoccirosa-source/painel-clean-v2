import type { Metadata } from "next";
import ScrollAnimations from "@/components/home/ScrollAnimations";
import Header       from "@/components/landing-v2/Header";
import Hero         from "@/components/landing-v2/Hero";
import StatsBar     from "@/components/landing-v2/StatsBar";
import Calculadora  from "@/components/landing-v2/Calculadora";
import ComoFunciona from "@/components/landing-v2/ComoFunciona";
import Diferenciais from "@/components/landing-v2/Diferenciais";
import Planos       from "@/components/landing-v2/Planos";
import Testimonials from "@/components/landing-v2/Testimonials";
import Coverage     from "@/components/landing-v2/Coverage";
import CTAFinal     from "@/components/landing-v2/CTAFinal";
import Footer       from "@/components/landing-v2/Footer";

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
        <Diferenciais />
        <Planos />
        <Testimonials />
        <Coverage />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
