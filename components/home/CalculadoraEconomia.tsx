"use client";

import { useState } from "react";
import Link from "next/link";
import { calcularPreco, type TipoInstalacao, type NivelSujeira } from "@/lib/pricing";

// === CONSTANTES DA CALCULADORA ===
const KWH_POR_PLACA_MES  = 55;   // Média de geração por placa/mês em SC
const VALOR_KWH          = 0.85; // R$ por kWh (tarifa média SC 2025)
const PERDA_SUJEIRA_NORMAL = 0.15; // 15% de perda com sujeira normal
const PERDA_SUJEIRA_PESADA = 0.30; // 30% de perda com sujeira pesada

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtKwh(v: number) {
  return v.toLocaleString("pt-BR") + " kWh";
}

export default function CalculadoraEconomia() {
  const [placas, setPlacas]   = useState(20);
  const [tipo, setTipo]       = useState<TipoInstalacao>("telhado_padrao");
  const [sujeira, setSujeira] = useState<NivelSujeira>("normal");

  // Cálculos de perda de energia
  const geracaoMensal     = placas * KWH_POR_PLACA_MES;
  const perdaPercentual   = sujeira === "pesada" ? PERDA_SUJEIRA_PESADA : PERDA_SUJEIRA_NORMAL;
  const energiaPerdidaMes = Math.round(geracaoMensal * perdaPercentual);
  const dinheiroPerdidoMes = Math.round(energiaPerdidaMes * VALOR_KWH * 100) / 100;
  const dinheiroPerdidoAno = Math.round(dinheiroPerdidoMes * 12 * 100) / 100;

  // Cálculo do investimento via algoritmo de preço
  const servico = calcularPreco({
    placas,
    tipoInstalacao: tipo,
    sujeira,
    acesso: "normal",
    distanciaKm: 0,
  });

  const semanasRetorno = servico.precoEstimado > 0 && dinheiroPerdidoMes > 0
    ? Math.ceil((servico.precoEstimado / dinheiroPerdidoMes) * 4.3)
    : null;

  const retorno = servico.precoEstimado > 0 && dinheiroPerdidoAno > 0
    ? (dinheiroPerdidoAno / servico.precoEstimado).toFixed(1)
    : null;

  const tipoOptions: { value: TipoInstalacao; emoji: string; label: string }[] = [
    { value: "solo",            emoji: "☀️", label: "Solo"           },
    { value: "telhado_padrao",  emoji: "🏠", label: "Telhado"        },
    { value: "telhado_dificil", emoji: "🏗️", label: "Telhado difícil" },
  ];

  const sujeiraOptions: { value: NivelSujeira; emoji: string; label: string }[] = [
    { value: "normal", emoji: "🟢", label: "Normal" },
    { value: "pesada", emoji: "🟠", label: "Pesada" },
  ];

  const sliderPct = ((placas - 1) / (200 - 1)) * 100;

  return (
    <section id="calculadora" className="bg-brand-bg py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
            🧮 Calculadora interativa
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-dark mb-4">
            Quanto você perde com placas sujas?
          </h2>
          <p className="text-brand-muted text-lg max-w-xl mx-auto">
            Descubra quanto de energia — e dinheiro — está escapando por falta de limpeza
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* ── Inputs ── */}
          <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 space-y-8 h-full">
            {/* Quantidade de placas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-heading font-bold text-brand-dark text-sm">
                  Quantidade de placas
                </label>
                <span className="font-heading font-extrabold text-brand-green text-2xl">
                  {placas}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={200}
                value={placas}
                onChange={(e) => setPlacas(Number(e.target.value))}
                className="w-full h-2 appearance-none rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3DC45A 0%, #3DC45A ${sliderPct}%, #C8DFC0 ${sliderPct}%, #C8DFC0 100%)`,
                }}
              />
              <div className="flex justify-between text-[11px] text-brand-muted mt-1.5">
                <span>1</span>
                <span>200</span>
              </div>
            </div>

            {/* Tipo de instalação */}
            <div>
              <label className="font-heading font-bold text-brand-dark text-sm block mb-3">
                Tipo de instalação
              </label>
              <div className="grid grid-cols-3 gap-2">
                {tipoOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTipo(opt.value)}
                    className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-2 text-center transition-colors ${
                      tipo === opt.value
                        ? "border-brand-green bg-brand-light text-brand-dark"
                        : "border-brand-border bg-white text-brand-muted hover:border-brand-dark/30"
                    }`}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <span className="text-[11px] font-semibold leading-tight">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Nível de sujeira */}
            <div>
              <label className="font-heading font-bold text-brand-dark text-sm block mb-3">
                Nível de sujeira
              </label>
              <div className="grid grid-cols-2 gap-2">
                {sujeiraOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSujeira(opt.value)}
                    className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border-2 transition-colors ${
                      sujeira === opt.value
                        ? "border-brand-green bg-brand-light text-brand-dark"
                        : "border-brand-border bg-white text-brand-muted hover:border-brand-dark/30"
                    }`}
                  >
                    <span className="text-lg">{opt.emoji}</span>
                    <span className="text-sm font-semibold">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2 pt-2 border-t border-brand-border text-sm">
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">Geração mensal estimada</span>
                <span className="font-semibold text-brand-dark">{fmtKwh(geracaoMensal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">Perda por sujeira ({Math.round(perdaPercentual * 100)}%)</span>
                <span className="font-semibold text-red-500">−{fmtKwh(energiaPerdidaMes)}/mês</span>
              </div>
            </div>
          </div>

          {/* ── Result card ── */}
          <div className="rounded-2xl overflow-hidden shadow-lg h-full flex flex-col">

            {/* Top half — perda (fundo branco, valores vermelhos) */}
            <div className="bg-white border border-brand-border border-b-0 px-6 pt-6 pb-5 space-y-4 flex-1">
              <h3 className="font-heading font-bold text-brand-dark text-base">
                ⚡ O que você pode estar perdendo
              </h3>

              <p className="text-sm text-brand-muted">
                Suas <span className="font-bold text-brand-dark">{placas} placas</span> geram{" "}
                <span className="font-bold text-brand-dark">~{fmtKwh(geracaoMensal)}/mês</span>
              </p>
              <p className="text-sm text-brand-muted">Com sujeira acumulada, você pode perder até:</p>

              <div className="space-y-2">
                <p
                  className="font-heading font-extrabold leading-none"
                  style={{ fontSize: "2.75rem", color: "#E24B4A" }}
                >
                  {fmtKwh(energiaPerdidaMes)}<span className="text-base font-semibold">/mês</span>
                </p>
                <p className="text-sm font-semibold" style={{ color: "#E24B4A" }}>
                  = {fmt(dinheiroPerdidoMes)}/mês{" "}
                  <em className="font-normal" style={{ color: "#E24B4A" }}>que podem estar sendo desperdiçados</em>
                </p>
                <p className="text-sm font-semibold" style={{ color: "#E24B4A" }}>
                  = {fmt(dinheiroPerdidoAno)}/ano em energia desperdiçada
                </p>
              </div>
            </div>

            {/* Bottom half — investimento (fundo brand-dark, valores verdes) */}
            <div className="bg-brand-dark px-6 pt-5 pb-6 space-y-4">
              <h3 className="font-heading font-bold text-white text-base">
                💰 Investimento na limpeza
              </h3>

              {servico.sobConsulta ? (
                <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                  <p className="text-white font-bold text-lg">Sob consulta</p>
                  <p className="text-white/60 text-xs mt-1">Entre em contato para instalações com 200+ placas</p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-heading font-extrabold text-brand-green text-3xl leading-none">
                      {fmt(servico.precoMin)} a {fmt(servico.precoMax)}
                    </p>
                    <p className="text-white/50 text-xs mt-1.5">
                      ({placas} placas × {servico.detalhe.tipoLabel.toLowerCase()})
                    </p>
                  </div>

                  {retorno && (
                    <div className="space-y-1.5">
                      <p className="text-white/80 text-sm">
                        Retorno: <span className="text-brand-green font-bold">{retorno}× o valor investido</span>
                      </p>
                      {semanasRetorno !== null && (
                        <div className="inline-flex items-center gap-2 bg-brand-green/20 rounded-full px-3 py-1.5">
                          <span className="text-brand-green font-bold text-sm">
                            ✅ Se paga em ~{semanasRetorno} semana{semanasRetorno !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              <Link
                href="/cadastro"
                className="block w-full text-center bg-brand-green text-white font-heading font-bold text-base px-6 py-4 rounded-xl hover:bg-brand-green/90 transition-colors"
              >
                Agendar minha limpeza →
              </Link>

              <p className="text-[11px] text-white/30 text-center leading-relaxed">
                *Valor final confirmado pelo técnico certificado
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
