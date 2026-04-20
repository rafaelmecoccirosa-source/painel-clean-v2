"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const W_PER_MODULE = 550;
const KWH_PER_KWP_DAY = 1.35;
const TARIFF = 0.92;
const LOSS_PCT = 0.22;

const PLANS = [
  { name: "Básico",  price: 30,  max: 15 },
  { name: "Padrão", price: 50,  max: 30 },
  { name: "Plus",   price: 100, max: 60 },
];

export default function Calculadora() {
  const [modules, setModules] = useState(20);

  const { kWp, generationPerYear, lossBRL, lossMonthly, plan, payback } = useMemo(() => {
    const kWp = (modules * W_PER_MODULE) / 1000;
    const generationPerYear = kWp * KWH_PER_KWP_DAY * 365;
    const lossKwh = generationPerYear * LOSS_PCT;
    const lossBRL = lossKwh * TARIFF;
    const lossMonthly = lossBRL / 12;
    const plan = PLANS.find((p) => modules <= p.max) ?? PLANS[2];
    const payback = Math.ceil(plan.price / lossMonthly);
    return { kWp, generationPerYear, lossBRL, lossMonthly, plan, payback };
  }, [modules]);

  const fmtBRL = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const fmtNum = (n: number) => Math.round(n).toLocaleString("pt-BR");

  return (
    <section id="calculadora" style={{ background: "white", padding: "clamp(72px, 9vw, 110px) 0" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10 animate-on-scroll">
          <p
            className="text-brand-green uppercase tracking-widest mb-3"
            style={{ fontSize: "11px", letterSpacing: "0.1em", fontWeight: 600 }}
          >
            🧮 Calculadora de perda
          </p>
          <h2
            className="font-heading font-extrabold text-brand-dark"
            style={{ fontSize: "2.5rem", letterSpacing: "-0.02em" }}
          >
            Quanto sua usina está perdendo por estar suja?
          </h2>
        </div>

        <div
          className="flex flex-col md:flex-row animate-on-scroll"
          style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #C8DFC0" }}
        >
          {/* Left — inputs */}
          <div
            className="flex-1 flex flex-col gap-6"
            style={{ background: "#F4F8F2", padding: "clamp(24px, 4vw, 48px)" }}
          >
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <label className="font-heading font-bold text-brand-dark text-sm">
                  Quantos módulos?
                </label>
                <span
                  className="font-heading"
                  style={{ fontWeight: 900, fontSize: 36, color: "#3DC45A", lineHeight: 1 }}
                >
                  {modules}
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={80}
                step={1}
                value={modules}
                onChange={(e) => setModules(Number(e.target.value))}
                className="w-full accent-brand-green"
                style={{ cursor: "pointer" }}
              />
              <div className="flex justify-between mt-2">
                <span style={{ fontSize: 11, color: "#7A9A84" }}>4</span>
                <span style={{ fontSize: 11, color: "#7A9A84" }}>residencial</span>
                <span style={{ fontSize: 11, color: "#7A9A84" }}>comercial</span>
                <span style={{ fontSize: 11, color: "#7A9A84" }}>80+</span>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <span
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: "#DCFCE7", color: "#1B3A2D" }}
              >
                Potência: {kWp.toFixed(1)} kWp
              </span>
              <span
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: "#DCFCE7", color: "#1B3A2D" }}
              >
                Geração anual: {fmtNum(generationPerYear)} kWh
              </span>
            </div>

            <p style={{ fontSize: 12, color: "#7A9A84", lineHeight: 1.6 }}>
              Módulos de 550 Wp · 1,35 kWh/kWp/dia (média SC) · tarifa R$ 0,92/kWh · perda média
              de 22% sem limpeza regular.
            </p>
          </div>

          {/* Right — result */}
          <div
            className="flex-1 flex flex-col gap-5"
            style={{ background: "#1B3A2D", padding: "clamp(24px, 4vw, 48px)" }}
          >
            <div>
              <p
                className="uppercase tracking-widest mb-2"
                style={{ fontSize: 11, letterSpacing: "0.1em", fontWeight: 600, color: "#3DC45A" }}
              >
                Perda anual estimada
              </p>
              <div
                className="font-heading"
                style={{
                  fontWeight: 900,
                  fontSize: "clamp(44px, 7vw, 64px)",
                  lineHeight: 1,
                  background: "linear-gradient(90deg, #FDE68A, #F59E0B)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {fmtBRL(lossBRL)}
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
                ≈ {fmtBRL(lossMonthly)}/mês que deixa de chegar na conta de luz
              </p>
            </div>

            <div
              style={{
                border: "1px solid rgba(61,196,90,0.35)",
                borderRadius: 14,
                padding: "16px 20px",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}
              >
                Plano sugerido
              </p>
              <div className="flex items-baseline justify-between mb-3">
                <span className="font-heading font-extrabold text-white" style={{ fontSize: 22 }}>
                  {plan.name}
                </span>
                <span className="font-heading font-bold" style={{ fontSize: 18, color: "#3DC45A" }}>
                  R$ {plan.price}/mês
                </span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
                A assinatura se paga em ~{payback} {payback === 1 ? "mês" : "meses"} com o que
                você deixa de perder.
              </p>
            </div>

            <Link
              href="/cadastro"
              className="block w-full text-center font-heading font-bold text-sm px-6 py-3.5 rounded-xl hover:-translate-y-px hover:scale-[1.01] hover:shadow-[0_4px_16px_rgba(61,196,90,0.35)] active:scale-[0.98]"
              style={{
                background: "#3DC45A",
                color: "#1B3A2D",
                transition: "transform 150ms ease-out, box-shadow 150ms ease-out",
              }}
            >
              Quero o plano {plan.name} →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
