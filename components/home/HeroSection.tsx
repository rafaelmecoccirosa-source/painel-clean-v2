"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HeroSection() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

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
        setDone(true);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const trustItems = [
    { icon: "✔",  label: "2 limpezas/ano"          },
    { icon: "⚡", label: "Relatório mensal"          },
    { icon: "📋", label: "Checkup técnico"           },
    { icon: "🛡️", label: "Seguro na limpeza"         },
    { icon: "💳", label: "Sem fidelidade no 1º mês"  },
  ];

  return (
    <section
      id="hero"
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: "580px" }}
    >
      {/* Ken Burns background layer */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <div
          id="hero-bg"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/hero-solar-v2.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            animation: "kenburns 14s ease-out forwards",
            transformOrigin: "center center",
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(rgba(27, 58, 45, 0.85), rgba(27, 58, 45, 0.70))",
          }}
        />
        {/* Shimmer sweep */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.07) 40%,rgba(255,255,255,0.13) 50%,rgba(255,255,255,0.07) 60%,transparent 100%)",
              animation: "shimmer 10s ease-in-out infinite",
              animationDelay: "2s",
            }}
          />
        </div>
      </div>

      {/* Responsive background-position for the photo */}
      <style>{`
        #hero-bg { background-position: center 30%; }
        @media (min-width: 640px) { #hero-bg { background-position: center center; } }
      `}</style>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:py-28">

        {/* Badge */}
        <span
          className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 text-brand-green border border-brand-green/40 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-6"
          style={{ animation: "fadeSlideUp 0.6s ease both", animationDelay: "0.2s" }}
        >
          ☀️ Plataforma de assinatura solar profissional
        </span>

        {/* Headline */}
        <h1
          className="font-heading text-[28px] sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 max-w-3xl text-white"
          style={{
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            animation: "fadeSlideUp 0.6s ease both",
            animationDelay: "0.5s",
          }}
        >
          Sua usina solar merece cuidado todo mês
        </h1>

        {/* Subtitle — counter animation mantida em "30%" */}
        <p
          className="text-white/85 text-[15px] sm:text-xl mb-8 max-w-xl leading-relaxed"
          style={{
            textShadow: "0 1px 3px rgba(0,0,0,0.25)",
            animation: "fadeSlideUp 0.6s ease both",
            animationDelay: "0.8s",
          }}
        >
          Placas sujas perdem até{" "}
          <span
            className="font-extrabold text-brand-green"
            style={{
              fontSize: "2rem",
              lineHeight: "1",
              ...(done ? { animation: "pulse-glow 2s ease-in-out infinite" } : {}),
            }}
          >
            {count}%
          </span>{" "}
          de eficiência. Por R$ 30/mês garantimos limpeza, monitoramento e relatório mensal — a assinatura se paga em menos de 1 semana.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          style={{ animation: "fadeSlideUp 0.6s ease both", animationDelay: "1.1s" }}
        >
          <Link
            href="#planos"
            className="inline-flex items-center justify-center gap-2 bg-brand-green text-white font-heading font-bold text-base px-8 py-4 rounded-xl hover:bg-brand-green/90 transition-colors shadow-lg w-full sm:w-auto"
          >
            Ver planos →
          </Link>
          <a
            href="#calculadora"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-heading font-bold text-base px-8 py-4 rounded-xl hover:bg-white/10 transition-colors w-full sm:w-auto"
          >
            Calcular minha economia
          </a>
        </div>

        {/* Trust signals */}
        <div
          className="mt-8 sm:mt-10"
          style={{ animation: "fadeSlideUp 0.6s ease both", animationDelay: "1.4s" }}
        >
          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-x-6 gap-y-2 flex-wrap justify-start">
            {trustItems.map(({ icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 whitespace-nowrap">
                <span style={{ fontSize: "13px", lineHeight: 1 }}>{icon}</span>
                <span className="text-white font-medium text-[12px]">{label}</span>
              </span>
            ))}
          </div>

          {/* Mobile: 2-col grid, último item centralizado se ímpar */}
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
