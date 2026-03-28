"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Calendar, Clock, Sun, AlertTriangle, ArrowRight,
} from "lucide-react";
import Button from "@/components/ui/Button";

export interface ChamadoData {
  id: string;
  cliente: string;
  endereco: string;
  cidade: string;
  modulos: number;
  valorServico: number;
  dataAgendada: string;
  periodo: "manhã" | "tarde";
  distanciaKm: number;
  tempoEstimadoHoras: number;
  observacoes?: string;
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function tempoByModulos(n: number): number {
  if (n <= 10) return 1.5;
  if (n <= 30) return 2.5;
  if (n <= 60) return 3.5;
  return 5;
}

export default function ChamadoDetalheCliente({ chamado }: { chamado: ChamadoData }) {
  const router = useRouter();

  // Calculadora state
  const [distancia, setDistancia] = useState(chamado.distanciaKm);
  const [consumo, setConsumo] = useState(10);
  const [precoCombustivel, setPrecoCombustivel] = useState(6.0);
  const [pracas, setPracas] = useState(0);
  const [valorPraca, setValorPraca] = useState(8.0);

  const [accepting, setAccepting] = useState(false);

  const tempo = tempoByModulos(chamado.modulos);
  const repasse = chamado.valorServico * 0.85;
  const comissao = chamado.valorServico * 0.15;
  const custoCombustivel = ((distancia * 2) / consumo) * precoCombustivel;
  const custoPedagio = pracas * valorPraca * 2;
  const totalCustos = custoCombustivel + custoPedagio;
  const lucroLiquido = repasse - totalCustos;
  const margem = (lucroLiquido / chamado.valorServico) * 100;

  const margemColor =
    margem >= 30 ? "text-brand-green" : margem >= 10 ? "text-yellow-400" : "text-red-400";
  const margemRingColor =
    margem >= 30 ? "ring-brand-green/40" : margem >= 10 ? "ring-yellow-400/40" : "ring-red-400/40";

  function handleAccept() {
    setAccepting(true);
    // TODO: supabase mutation — update service status to 'confirmed', set tecnico_id
    setTimeout(() => router.push("/tecnico/agenda"), 1200);
  }

  const numInput =
    "w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-brand-green placeholder:text-white/40";

  return (
    <div className="space-y-6">

      {/* ── Info do chamado ── */}
      <div className="card space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-brand-muted mb-1">Cliente</p>
            <p className="font-heading font-bold text-brand-dark text-lg">{chamado.cliente}</p>
          </div>
          <span className="flex-shrink-0 bg-brand-green/10 text-brand-green text-xs font-semibold px-3 py-1.5 rounded-full">
            {fmt(chamado.valorServico)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="text-brand-muted mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-brand-dark">{chamado.endereco}</p>
              <p className="text-xs text-brand-muted">{chamado.cidade}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Calendar size={16} className="text-brand-muted mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-brand-dark">{chamado.dataAgendada}</p>
              <p className="text-xs text-brand-muted capitalize">{chamado.periodo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Sun size={16} className="text-brand-muted flex-shrink-0" />
            <p className="text-sm text-brand-dark">
              <span className="font-semibold">{chamado.modulos}</span> módulos
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-brand-muted flex-shrink-0" />
            <p className="text-sm text-brand-dark">
              ~<span className="font-semibold">{tempo}h</span> estimadas
            </p>
          </div>
        </div>

        {chamado.observacoes && (
          <div className="bg-brand-bg rounded-xl px-4 py-3 text-sm text-brand-muted">
            <span className="font-semibold text-brand-dark">Obs: </span>
            {chamado.observacoes}
          </div>
        )}
      </div>

      {/* ── Calculadora de custos ── */}
      <div className="bg-brand-dark rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="font-heading font-bold text-white text-lg">
            ⚡ Simule seu lucro real
          </h2>
          <p className="text-white/50 text-xs mt-1">
            Edite os campos para ver se o chamado compensa antes de aceitar.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Distância estimada (km)
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={distancia}
              onChange={(e) => setDistancia(parseFloat(e.target.value) || 0)}
              className={numInput}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Consumo do veículo (km/l)
            </label>
            <input
              type="number"
              min={1}
              step={0.5}
              value={consumo}
              onChange={(e) => setConsumo(parseFloat(e.target.value) || 1)}
              className={numInput}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Preço do combustível (R$/l)
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={precoCombustivel}
              onChange={(e) => setPrecoCombustivel(parseFloat(e.target.value) || 0)}
              className={numInput}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Praças de pedágio (qtd)
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={pracas}
              onChange={(e) => setPracas(parseInt(e.target.value) || 0)}
              className={numInput}
            />
          </div>
          {pracas > 0 && (
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Valor por praça (R$)
              </label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={valorPraca}
                onChange={(e) => setValorPraca(parseFloat(e.target.value) || 0)}
                className={numInput}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Tempo estimado do serviço
            </label>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
              <Clock size={14} className="text-white/40" />
              <span className="text-white text-sm font-medium">
                {tempo}h
              </span>
              <span className="text-white/40 text-xs">({chamado.modulos} módulos)</span>
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div className="border-t border-white/10 pt-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Combustível (ida + volta)</span>
            <span className="text-white font-medium">{fmt(custoCombustivel)}</span>
          </div>
          {custoPedagio > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Pedágio (ida + volta)</span>
              <span className="text-white font-medium">{fmt(custoPedagio)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm border-t border-white/10 pt-3">
            <span className="text-white/70">Total de custos</span>
            <span className="text-red-400 font-semibold">− {fmt(totalCustos)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Repasse bruto (85%)</span>
            <span className="text-white font-medium">{fmt(repasse)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Comissão plataforma (15%)</span>
            <span className="text-red-400 font-medium">− {fmt(comissao)}</span>
          </div>

          {/* Lucro + margem — destaque */}
          <div className={`flex items-center justify-between bg-white/5 ring-1 ${margemRingColor} rounded-xl px-4 py-4 mt-2`}>
            <div>
              <p className="text-xs text-white/50 mb-0.5">Lucro líquido estimado</p>
              <p className={`font-heading font-extrabold text-2xl ${margemColor}`}>
                {fmt(lucroLiquido)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50 mb-0.5">Margem</p>
              <p className={`font-heading font-extrabold text-2xl ${margemColor}`}>
                {margem.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Alerta margem baixa */}
          {margem < 10 && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm font-medium">
                ⚠️ Margem baixa — avalie antes de aceitar.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Botões ── */}
      <div className="card space-y-3">
        {/* Lucro em destaque acima do botão */}
        <div className="flex items-center justify-between bg-brand-bg rounded-xl px-4 py-3">
          <span className="text-sm text-brand-muted">💵 Lucro estimado se aceitar</span>
          <span className={`font-heading font-extrabold text-xl ${
            margem >= 30 ? "text-brand-green" : margem >= 10 ? "text-yellow-600" : "text-red-600"
          }`}>
            {fmt(lucroLiquido)}
            <span className="text-xs font-normal ml-1 opacity-70">({margem.toFixed(1)}%)</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => router.back()}
          >
            Recusar
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            loading={accepting}
            onClick={handleAccept}
          >
            {accepting ? "Aceitando…" : "✓ Aceitar chamado"}
            {!accepting && <ArrowRight size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
