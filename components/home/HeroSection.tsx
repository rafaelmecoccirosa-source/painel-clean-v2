"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HeroParticles } from "@/components/HeroParticles";

export default function HeroSection() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const TARGET = 30;
    const DURATION = 2000;
    const INTERVAL = 16;
    const steps = DURATION / INTERVAL;
    const step = TARGET / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= TARGET) {
        setCount(TARGET);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const trustItems = [
    { icon: "✅", label: "Técnicos certificados"  },
    { icon: "⚡", label: "Agendamento em minutos" },
    { icon: "📸", label: "Relatório fotográfico"  },
    { icon: "🛡️", label: "Seguro contra danos"    },
    { icon: "💰", label: "Preço transparente"     },
  ];

  return (
    <section
      id="hero"
      className="relative flex items-center"
      style={{
        minHeight: "580px",
        backgroundImage:
          "linear-gradient(rgba(27, 58, 45, 0.85), rgba(27, 58, 45, 0.70)), url('/hero-solar.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* background-position changes between mobile and desktop via JS-injected style */}
      <style>{`
        #hero { background-position: center 30%; }
        @media (min-width: 640px) { #hero { background-position: center center; } }
      `}</style>

      <HeroParticles />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:py-28">

        {/* Badge — hidden on mobile, shown on sm+ */}
        <span className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 text-brand-green border border-brand-green/40 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-6">
          ☀️ Plataforma de limpeza solar profissional
        </span>

        {/* Headline */}
        <h1
          className="font-heading text-[28px] sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 max-w-3xl text-white"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
        >
          Suas placas solares estão produzindo menos do que poderiam
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/85 text-[15px] sm:text-xl mb-8 max-w-xl leading-relaxed"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.25)" }}
        >
          A sujeira pode reduzir até{" "}
          <span
            className="font-extrabold text-brand-green"
            style={{ fontSize: "2rem", lineHeight: "1" }}
          >
            {count}%
          </span>{" "}
          da eficiência dos seus painéis. Agende uma limpeza profissional em minutos.
        </p>

        {/* CTAs — stacked on mobile, row on sm+ */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href="/cadastro"
            className="inline-flex items-center justify-center gap-2 bg-brand-green text-white font-heading font-bold text-base px-8 py-4 rounded-xl hover:bg-brand-green/90 transition-colors shadow-lg w-full sm:w-auto"
          >
            Agendar limpeza →
          </Link>
          <a
            href="#calculadora"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-heading font-bold text-base px-8 py-4 rounded-xl hover:bg-white/10 transition-colors w-full sm:w-auto"
          >
            Calcular economia
          </a>
        </div>

        {/* Trust signals */}
        <div className="mt-8 sm:mt-10">
          {/* Desktop: flex-wrap so all 5 items are always visible */}
          <div className="hidden sm:flex items-center gap-x-6 gap-y-2 flex-wrap justify-start">
            {trustItems.map(({ icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 whitespace-nowrap">
                <span style={{ fontSize: "13px", lineHeight: 1 }}>{icon}</span>
                <span className="text-white font-medium text-[12px]">{label}</span>
              </span>
            ))}
          </div>

          {/* Mobile: 2-col grid, last item spans full width to center it */}
          <div className="sm:hidden grid grid-cols-2 gap-x-4 gap-y-2.5">
            {trustItems.map(({ icon, label }, idx) => (
              <span
                key={label}
                className={`flex items-center gap-1.5 ${idx === trustItems.length - 1 && trustItems.length % 2 !== 0 ? "col-span-2 justify-center" : ""}`}
              >
                <span style={{ fontSize: "13px", lineHeight: 1 }}>{icon}</span>
                <span className="text-white font-medium text-[12px]">{label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
