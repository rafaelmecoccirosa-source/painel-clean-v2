"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const HERO_IMG =
  "https://painelclean.com.br/wp-content/uploads/2025/03/painel-clean-carrossel-trabalhador-2.png";

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
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  // Animate 0 → 30 over 2 seconds
  useEffect(() => {
    if (!started) return;
    const TARGET = 30;
    const DURATION = 2000;
    const FPS = 60;
    const step = TARGET / (DURATION / (1000 / FPS));
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= TARGET) {
        setCount(TARGET);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / FPS);
    return () => clearInterval(timer);
  }, [started]);

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-[620px] flex items-center">
      {/* Background image */}
      <Image
        src={HERO_IMG}
        alt="Técnico realizando limpeza de placas solares"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-brand-dark/78" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-white">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 bg-brand-green/20 text-brand-green border border-brand-green/30 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-6">
          ☀️ Plataforma de limpeza solar profissional
        </span>

        {/* Headline */}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-3xl">
          Suas placas solares estão produzindo menos do que poderiam
        </h1>

        {/* Subtitle with animated counter */}
        <p className="text-white/80 text-lg sm:text-xl mb-10 max-w-xl leading-relaxed">
          A sujeira pode reduzir até{" "}
          <span className="inline-flex items-baseline gap-0.5">
            <span
              className="font-extrabold text-brand-green leading-none"
              style={{ fontSize: "3rem", lineHeight: "1" }}
            >
              {count}%
            </span>
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
            className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-heading font-bold text-base px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
          >
            Calcular economia
          </a>
        </div>

        {/* Social proof chips */}
        <div className="flex flex-wrap gap-3 mt-10 text-sm text-white/60">
          <span className="flex items-center gap-1.5">✅ Técnicos certificados</span>
          <span className="flex items-center gap-1.5">⚡ Agendamento em minutos</span>
          <span className="flex items-center gap-1.5">📸 Relatório fotográfico incluso</span>
        </div>
      </div>
    </section>
  );
}
