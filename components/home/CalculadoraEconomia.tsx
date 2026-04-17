"use client";

import { useState } from "react";
import Link from "next/link";
import { BannerParticles } from "@/components/BannerParticles";

// === v2 — Modelo assinatura ===
const KWP_POR_MODULO  = 0.55;
const KWH_POR_KWP_MES = 130;
const PERDA_SUJEIRA   = 0.30;
const TARIFA_KWH      = 0.85;
const CHART_H         = 76; // px — altura máxima das barras

function getPrecoPorModulo(modulos: number): number {
  if (modulos <= 30) return 30;
  if (modulos <= 50) return 25;
  return 20;
}

function getPlano(modulos: number): { nome: string; preco: number } {
  if (modulos <= 15) return { nome: "Básico", preco: 30  };
  if (modulos <= 30) return { nome: "Padrão", preco: 50  };
  return               { nome: "Plus",   preco: 100 };
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const planosMini = [
  { id: "basic",    nome: "Básico", faixa: "até 15 módulos",  preco: "R$ 30/mês",  centro: 10 },
  { id: "standard", nome: "Padrão", faixa: "16–30 módulos",   preco: "R$ 50/mês",  centro: 20 },
  { id: "plus",     nome: "Plus",   faixa: "31–60 módulos",   preco: "R$ 100/mês", centro: 45 },
] as const;

export default function CalculadoraEconomia() {
  const [modulos, setModulos] = useState(20);

  // Prejuízo mensal por sujeira
  const prejuizoMes = Math.round(modulos * KWP_POR_MODULO * KWH_POR_KWP_MES * PERDA_SUJEIRA * TARIFA_KWH);

  // Preços base
  const precoPorModulo   = getPrecoPorModulo(modulos);
  const precoAvulso      = Math.round(modulos * precoPorModulo);
  const precoAvulsoAno   = precoAvulso * 2;
  const entrada          = Math.round(precoAvulso * 0.50);
  const plano            = getPlano(modulos);
  const mensalidadeAnual = plano.preco * 12;
  const assinatura3Anos  = entrada + mensalidadeAnual * 3;
  const avulso3Anos      = precoAvulsoAno * 3;
  const economia3Anos    = Math.max(0, avulso3Anos - assinatura3Anos);

  const planoAtivo = modulos <= 15 ? "basic" : modulos <= 30 ? "standard" : "plus";
  const sliderPct  = ((modulos - 1) / (100 - 1)) * 100;

  // Dados do gráfico anual
  const anoData = [
    { label: "Ano 1", avulso: precoAvulsoAno, assinatura: entrada + mensalidadeAnual },
    { label: "Ano 2", avulso: precoAvulsoAno, assinatura: mensalidadeAnual },
    { label: "Ano 3", avulso: precoAvulsoAno, assinatura: mensalidadeAnual },
  ];
  const chartMax = Math.max(...anoData.flatMap((d) => [d.avulso, d.assinatura]));

  return (
    <section id="calculadora" className="bg-brand-bg py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
            🧮 Calculadora interativa
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-dark mb-4">
            Quanto você perde com painéis sujos?
          </h2>
          <p className="text-brand-muted text-lg max-w-xl mx-auto">
            Descubra o prejuízo mensal e veja quanto a assinatura economiza em 3 anos vs serviço avulso
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* ── Coluna esquerda ── */}
          <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 flex flex-col gap-6">

            {/* Slider de módulos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-heading font-bold text-brand-dark text-sm">
                  Quantos módulos sua usina tem?
                </label>
                <span className="font-heading font-extrabold text-brand-green text-2xl">
                  {modulos}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={modulos}
                onChange={(e) => setModulos(Number(e.target.value))}
                className="w-full h-2 appearance-none rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3DC45A 0%, #3DC45A ${sliderPct}%, #C8DFC0 ${sliderPct}%, #C8DFC0 100%)`,
                }}
              />
              <div className="flex justify-between text-[11px] text-brand-muted mt-1.5">
                <span>1</span>
                <span>100</span>
              </div>
            </div>

            {/* Mini cards clicáveis */}
            <div className="flex flex-col gap-2">
              {planosMini.map((p) => {
                const ativo = planoAtivo === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setModulos(p.centro)}
                    className="w-full text-left"
                    style={{
                      background: ativo ? "#1B3A2D" : "#ffffff",
                      border: `1.5px solid ${ativo ? "#3DC45A" : "#C8DFC0"}`,
                      borderRadius: "12px",
                      padding: "10px 14px",
                      transition: "all 0.3s",
                      cursor: "pointer",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span style={{ fontWeight: 600, fontSize: "13px", color: ativo ? "#EBF3E8" : "#1B3A2D" }}>
                        {p.nome}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: "13px", color: ativo ? "#3DC45A" : "#7A9A84" }}>
                        {p.preco}
                      </span>
                    </div>
                    <p style={{ fontSize: "11px", color: "#7A9A84", marginTop: "2px" }}>{p.faixa}</p>
                  </button>
                );
              })}
            </div>

            {/* Gráfico de barras — 3 anos */}
            <div>
              {/* Legenda */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5">
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: "#374151" }} />
                  <span style={{ fontSize: 11, color: "#7A9A84" }}>Avulso</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: "#3DC45A" }} />
                  <span style={{ fontSize: 11, color: "#7A9A84" }}>Assinatura</span>
                </div>
              </div>
              {/* Barras */}
              <div className="flex items-end gap-3">
                {anoData.map(({ label, avulso, assinatura }) => (
                  <div key={label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="flex items-end gap-1 w-full justify-center" style={{ height: CHART_H }}>
                      <div
                        title={fmt(avulso)}
                        style={{
                          width: "42%",
                          height: Math.max(4, Math.round((avulso / chartMax) * CHART_H)),
                          background: "#374151",
                          borderRadius: "3px 3px 0 0",
                          alignSelf: "flex-end",
                        }}
                      />
                      <div
                        title={fmt(assinatura)}
                        style={{
                          width: "42%",
                          height: Math.max(4, Math.round((assinatura / chartMax) * CHART_H)),
                          background: "#3DC45A",
                          borderRadius: "3px 3px 0 0",
                          alignSelf: "flex-end",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 10, color: "#7A9A84" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown comparativo */}
            <div className="space-y-2 pt-4 border-t border-brand-border text-sm mt-auto">
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">Plano recomendado</span>
                <span className="font-bold text-brand-dark">{plano.nome} — {fmt(plano.preco)}/mês</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">1ª limpeza (50% off)</span>
                <span className="font-semibold text-brand-dark">{fmt(entrada)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">3 anos — assinatura</span>
                <span className="font-semibold text-brand-green">{fmt(assinatura3Anos)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">3 anos — avulso</span>
                <span className="font-semibold text-red-500">{fmt(avulso3Anos)}</span>
              </div>
            </div>
          </div>

          {/* ── Coluna direita ── */}
          <div className="rounded-2xl overflow-hidden shadow-lg flex flex-col">

            {/* Top — perda mensal */}
            <div className="bg-white border border-brand-border border-b-0 px-6 pt-6 pb-5 space-y-4">
              <h3 className="font-heading font-bold text-brand-dark text-base">
                ⚡ Você pode estar perdendo
              </h3>
              <div>
                <p
                  className="font-heading font-extrabold leading-none"
                  style={{ fontSize: "2.75rem", color: "#E24B4A" }}
                >
                  {fmt(prejuizoMes)}<span className="text-base font-semibold">/mês</span>
                </p>
                <p className="text-sm text-brand-muted mt-2">
                  com {Math.round(PERDA_SUJEIRA * 100)}% de queda de eficiência por sujeira
                </p>
              </div>
              <div className="bg-brand-bg rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-brand-dark">
                  Plano recomendado:{" "}
                  <span className="text-brand-green">{plano.nome} — {fmt(plano.preco)}/mês</span>
                </p>
              </div>
            </div>

            {/* Bottom — economia 3 anos */}
            <div className="bg-brand-dark px-6 pt-5 pb-6 relative overflow-hidden flex-1 flex flex-col justify-between">
              <BannerParticles />
              <div className="relative flex flex-col gap-4 flex-1 justify-between" style={{ zIndex: 2 }}>
                <div>
                  <h3 className="font-heading font-bold text-white text-base mb-3">
                    💰 Economia em 3 anos vs avulso
                  </h3>
                  <p className="font-heading font-extrabold text-brand-green text-3xl leading-none">
                    {fmt(economia3Anos)}
                  </p>
                  <p className="text-white/50 text-xs mt-1.5">
                    Assinatura: {fmt(assinatura3Anos)} · Avulso: {fmt(avulso3Anos)}
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/cadastro"
                    className="block w-full text-center bg-brand-green text-white font-heading font-bold text-base px-6 py-4 rounded-xl hover:bg-brand-green/90 transition-colors"
                  >
                    Garantir minha assinatura →
                  </Link>
                  <p className="text-[11px] text-white/30 text-center leading-relaxed">
                    *1ª limpeza com 50% off. Valor final confirmado pelo técnico certificado.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
