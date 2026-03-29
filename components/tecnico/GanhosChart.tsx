"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MOCK_TECNICO } from "@/lib/mock-data";

type Modo = "semanal" | "mensal";

interface Barra {
  label: string;
  sub: string;
  valor: number;
}

const META_MENSAL = 5000;
const META_SEMANAL = META_MENSAL / 4; // ~1250

const DADOS: Record<Modo, Barra[]> = {
  semanal: MOCK_TECNICO.ganhosDiario,
  mensal:  MOCK_TECNICO.ganhosSemanal,
};

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function GanhosChart() {
  const [modo, setModo] = useState<Modo>("mensal");
  const [hover, setHover] = useState<number | null>(null);

  const dados = DADOS[modo];
  const meta = modo === "mensal" ? META_MENSAL : META_SEMANAL;
  const maxVal = Math.max(...dados.map((d) => d.valor), meta * 0.9);
  const metaPct = Math.min(Math.round((meta / maxVal) * 100), 100);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <h2 className="font-heading font-bold text-brand-dark text-base">
          📊 Ganhos — março 2026
        </h2>
        <div className="flex items-center gap-2">
          {/* Toggle semanal/mensal */}
          <div className="flex bg-brand-light rounded-xl p-1 gap-1">
            {(["semanal", "mensal"] as Modo[]).map((m) => (
              <button
                key={m}
                onClick={() => setModo(m)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  modo === m
                    ? "bg-brand-dark text-white shadow-sm"
                    : "text-brand-muted hover:text-brand-dark"
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
          <Link
            href="/tecnico/ganhos"
            className="text-xs text-brand-green font-semibold hover:underline flex items-center gap-1"
          >
            Ver mais <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Meta label */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-px border-t-2 border-dashed border-brand-dark opacity-40" />
        <span className="text-[10px] text-brand-muted">
          Meta: {fmt(meta)}{modo === "mensal" ? "/mês" : "/sem"}
        </span>
      </div>

      {/* Chart area */}
      <div className="relative">
        {/* Meta line */}
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-brand-dark opacity-25 pointer-events-none"
          style={{ bottom: `${metaPct}%`, top: "auto" }}
        />

        <div className="flex items-end gap-2 sm:gap-3 h-40">
          {dados.map((d, i) => {
            const pct = maxVal > 0 ? Math.max(Math.round((d.valor / maxVal) * 100), d.valor > 0 ? 4 : 0) : 0;
            const isHovered = hover === i;

            return (
              <div
                key={d.label}
                className="flex-1 flex flex-col items-center gap-1 relative"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                {/* Tooltip */}
                {isHovered && d.valor > 0 && (
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap z-10 shadow-lg">
                    {fmt(d.valor)}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand-dark" />
                  </div>
                )}

                <div className="w-full flex items-end" style={{ height: "100px" }}>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-200 ${
                      d.valor === 0 ? "bg-brand-border" : isHovered ? "bg-brand-green/80" : "bg-brand-green"
                    }`}
                    style={{ height: `${pct}%`, minHeight: d.valor > 0 ? "4px" : "0" }}
                  />
                </div>
                <p className="text-[10px] font-bold text-brand-dark">{d.label}</p>
                <p className="text-[9px] text-brand-muted hidden sm:block">{d.sub}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total / progresso */}
      {(() => {
        const total = MOCK_TECNICO.ganhosMes;
        const pctMeta = Math.round((total / META_MENSAL) * 100);
        return (
          <div className="mt-4 pt-4 border-t border-brand-border flex items-center justify-between text-xs">
            <span className="text-brand-muted">
              Total: <span className="font-bold text-brand-dark">
                {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </span>
            <span className="text-brand-muted">
              Meta: <span className="font-semibold text-brand-dark">{pctMeta}%</span> concluída
            </span>
            <div className="hidden sm:flex items-center gap-2 flex-1 max-w-[120px] ml-4">
              <div className="flex-1 h-1.5 bg-brand-light rounded-full overflow-hidden">
                <div className="h-full bg-brand-green rounded-full" style={{ width: `${Math.min(pctMeta, 100)}%` }} />
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
