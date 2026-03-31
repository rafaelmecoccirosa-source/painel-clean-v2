"use client";

import { useState } from "react";
import Link from "next/link";
import { calcularPreco, type TipoInstalacao, type NivelSujeira } from "@/lib/pricing";

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CalculadoraEconomia() {
  const [placas, setPlacas]     = useState(20);
  const [conta, setConta]       = useState(400);
  const [tipo, setTipo]         = useState<TipoInstalacao>("telhado_padrao");
  const [sujeira, setSujeira]   = useState<NivelSujeira>("normal");

  const perdaMensal   = Math.round(conta * 0.25);
  const economiaAnual = perdaMensal * 12;

  const servico = calcularPreco({
    placas,
    tipoInstalacao: tipo,
    sujeira,
    acesso: "normal",
    distanciaKm: 0,
  });

  const retorno = servico.precoEstimado > 0
    ? (economiaAnual / servico.precoEstimado).toFixed(1)
    : null;

  const tipoOptions: { value: TipoInstalacao; emoji: string; label: string }[] = [
    { value: "solo",            emoji: "☀️", label: "Solo" },
    { value: "telhado_padrao",  emoji: "🏠", label: "Telhado" },
    { value: "telhado_dificil", emoji: "🏗️", label: "Telhado difícil" },
  ];

  const sujeiraOptions: { value: NivelSujeira; emoji: string; label: string }[] = [
    { value: "normal", emoji: "🟢", label: "Normal" },
    { value: "pesada", emoji: "🟠", label: "Pesada" },
  ];

  return (
    <section id="calculadora" className="bg-brand-bg py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
            🧮 Calculadora interativa
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-dark mb-4">
            Quanto você pode economizar?
          </h2>
          <p className="text-brand-muted text-lg max-w-xl mx-auto">
            Descubra quanto a limpeza pode impactar na sua conta de luz
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Inputs */}
          <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 space-y-8">
            {/* Placas */}
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
                max={100}
                value={placas}
                onChange={(e) => setPlacas(Number(e.target.value))}
                className="w-full h-2 appearance-none rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3DC45A 0%, #3DC45A ${placas}%, #C8DFC0 ${placas}%, #C8DFC0 100%)`,
                }}
              />
              <div className="flex justify-between text-[11px] text-brand-muted mt-1.5">
                <span>1</span>
                <span>100</span>
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

            {/* Conta de luz */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-heading font-bold text-brand-dark text-sm">
                  Valor médio da conta de luz
                </label>
                <span className="font-heading font-extrabold text-brand-green text-2xl">
                  {fmt(conta)}
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={2000}
                step={50}
                value={conta}
                onChange={(e) => setConta(Number(e.target.value))}
                className="w-full h-2 appearance-none rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3DC45A 0%, #3DC45A ${((conta - 100) / 1900) * 100}%, #C8DFC0 ${((conta - 100) / 1900) * 100}%, #C8DFC0 100%)`,
                }}
              />
              <div className="flex justify-between text-[11px] text-brand-muted mt-1.5">
                <span>R$ 100</span>
                <span>R$ 2.000</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2 pt-2 border-t border-brand-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-muted">Perda estimada/mês (25%)</span>
                <span className="font-semibold text-red-500">{fmt(perdaMensal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-muted">Economia potencial/ano</span>
                <span className="font-semibold text-brand-green">{fmt(economiaAnual)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-muted">Investimento estimado*</span>
                <span className="font-semibold text-brand-dark">
                  {fmt(servico.precoMin)} a {fmt(servico.precoMax)}
                </span>
              </div>
            </div>
          </div>

          {/* Result card */}
          <div className="bg-brand-dark rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="font-heading font-bold text-white text-lg">
              📊 Seu resultado estimado
            </h3>

            {/* Main metric */}
            <div className="bg-white/5 rounded-xl px-5 py-5 text-center">
              <p className="text-white/60 text-sm mb-2">Economia anual com limpeza</p>
              <p className="font-heading font-extrabold text-brand-green text-5xl leading-none mb-1">
                {fmt(economiaAnual)}
              </p>
              <p className="text-white/50 text-xs">por ano</p>
            </div>

            {/* Investimento faixa */}
            <div className="bg-white/5 rounded-xl px-5 py-4">
              <p className="text-white/60 text-xs mb-1">Investimento estimado</p>
              <p className="font-heading font-extrabold text-brand-green text-2xl leading-none">
                {fmt(servico.precoMin)} a {fmt(servico.precoMax)}
              </p>
              <p className="text-white/40 text-xs mt-1">
                *Valor final confirmado pelo técnico certificado
              </p>
            </div>

            {/* Retorno */}
            {retorno && (
              <div className="flex items-center justify-between bg-brand-green/15 rounded-xl px-4 py-3">
                <span className="text-white/80 text-sm">Retorno do investimento</span>
                <span className="bg-brand-green text-white font-heading font-bold text-sm px-3 py-1 rounded-full">
                  {retorno}× o valor
                </span>
              </div>
            )}

            {/* Detalhes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Limpeza a cada ano</span>
                <span className="text-white font-medium">{fmt(servico.precoEstimado)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Retorno mensal</span>
                <span className="text-white font-medium">{fmt(perdaMensal)}</span>
              </div>
            </div>

            <Link
              href="/cadastro"
              className="block w-full text-center bg-brand-green text-white font-heading font-bold text-base px-6 py-4 rounded-xl hover:bg-brand-green/90 transition-colors"
            >
              Agendar minha limpeza →
            </Link>

            <p className="text-[11px] text-white/30 text-center leading-relaxed">
              *Valores aproximados. O valor final pode variar conforme a complexidade e
              localização do serviço.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
