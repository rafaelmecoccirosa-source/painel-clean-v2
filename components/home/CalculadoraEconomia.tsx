"use client";

import { useState } from "react";
import Link from "next/link";

function calcPreco(modulos: number): { label: string; valor: number | null } {
  if (modulos <= 0)  return { label: "—",           valor: null };
  if (modulos <= 10) return { label: "R$ 180",       valor: 180  };
  if (modulos <= 30) return { label: "R$ 300",       valor: 300  };
  if (modulos <= 60) return { label: "R$ 520",       valor: 520  };
  return               { label: "Sob consulta",  valor: null };
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CalculadoraEconomia() {
  const [modulos, setModulos]   = useState(20);
  const [conta, setConta]       = useState(400);

  const perdaMensal     = Math.round(conta * 0.25);
  const economiaAnual   = perdaMensal * 12;
  const servico         = calcPreco(modulos);
  const retorno         = servico.valor
    ? (economiaAnual / servico.valor).toFixed(1)
    : null;

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
            {/* Módulos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-heading font-bold text-brand-dark text-sm">
                  Quantidade de módulos
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
                  background: `linear-gradient(to right, #3DC45A 0%, #3DC45A ${modulos}%, #C8DFC0 ${modulos}%, #C8DFC0 100%)`,
                }}
              />
              <div className="flex justify-between text-[11px] text-brand-muted mt-1.5">
                <span>1</span>
                <span>100</span>
              </div>
              <p className="text-xs text-brand-muted mt-2">
                Faixa:{" "}
                <span className="font-semibold text-brand-dark">
                  {modulos <= 10
                    ? "Até 10 módulos (pequena)"
                    : modulos <= 30
                    ? "11–30 módulos (média)"
                    : modulos <= 60
                    ? "31–60 módulos (grande)"
                    : "61+ módulos (usina)"}
                </span>
              </p>
            </div>

            {/* Conta */}
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
                <span className="font-semibold text-brand-dark">{servico.label}</span>
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
                <span className="text-white font-medium">{servico.label}</span>
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
