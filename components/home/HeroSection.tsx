"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function HeroSection() {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Start counter when section enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  // Animate 0 → 30 over 2 seconds
  useEffect(() => {
    if (!started) return;
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
  }, [started]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[640px] flex items-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(27, 58, 45, 0.85), rgba(27, 58, 45, 0.70)), url('/hero-solar.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 bg-white/10 text-brand-green border border-brand-green/40 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-6">
          ☀️ Plataforma de limpeza solar profissional
        </span>

        {/* Headline */}
        <h1
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-3xl text-white"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
        >
          Suas placas solares estão produzindo menos do que poderiam
        </h1>

        {/* Subtitle with animated counter */}
        <p
          className="text-white/85 text-lg sm:text-xl mb-10 max-w-xl leading-relaxed"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.25)" }}
        >
          A sujeira pode reduzir até{" "}
          <span
            className="font-extrabold text-brand-green"
            style={{ fontSize: "2.5rem", lineHeight: "1" }}
          >
            {count}%
          </span>{" "}
          da eficiência dos seus painéis. Agende uma limpeza profissional em minutos.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/cadastro"
            className="inline-flex items-center justify-center gap-2 bg-brand-green text-white font-heading font-bold text-base px-8 py-4 rounded-xl hover:bg-brand-green/90 transition-colors shadow-lg"
          >
            Agendar limpeza →
          </Link>
          <a
            href="#calculadora"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-heading font-bold text-base px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
          >
            Calcular economia
          </a>
        </div>

        {/* Social proof chips */}
        <div
          className="flex flex-wrap gap-4 mt-10 text-sm text-white/70"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
        >
          <span className="flex items-center gap-1.5">✅ Técnicos certificados</span>
          <span className="flex items-center gap-1.5">⚡ Agendamento em minutos</span>
          <span className="flex items-center gap-1.5">📸 Relatório fotográfico incluso</span>
        </div>
      </div>
    </section>
  );
}
