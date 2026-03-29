"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import TecnicosRegiao from "@/components/cliente/TecnicosRegiao";

// Tabela de preços por faixa de módulos
function calcPreco(n: number): string {
  if (!n || n <= 0) return "—";
  if (n <= 10) return "R$ 180";
  if (n <= 30) return "R$ 300";
  if (n <= 60) return "R$ 520";
  return "Sob consulta";
}

// Mock de técnicos disponíveis por cidade (substituir por query Supabase)
function tecnicosPorCidade(cidade: string): number {
  const lower = cidade.toLowerCase();
  if (lower.includes("jaraguá") || lower.includes("jaragua")) return 4;
  if (lower.includes("pomerode")) return 2;
  if (lower.includes("florianópolis") || lower.includes("florianopolis")) return 5;
  if (cidade.trim().length > 3) return 3;
  return 0;
}

function tempoAceite(cidade: string): string {
  const lower = cidade.toLowerCase();
  if (lower.includes("florianópolis") || lower.includes("florianopolis")) return "~10 min";
  if (lower.includes("jaraguá") || lower.includes("jaragua")) return "~15 min";
  return "~20 min";
}

const ESTADOS = ["SC", "SP", "RJ", "MG", "RS", "PR", "BA", "GO", "DF", "PE", "CE"];

export default function SolicitarPage() {
  const router = useRouter();
  const [modulos, setModulos] = useState("");
  const [cidade, setCidade] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const numModulos = parseInt(modulos) || 0;
  const preco = calcPreco(numModulos);
  const tecnicos = tecnicosPorCidade(cidade);
  const showPreview = numModulos > 0 || cidade.trim().length > 3;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: Supabase insert em service_requests
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/cliente");
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold text-brand-dark mb-2">
        🧹 Solicitar limpeza
      </h1>
      <p className="text-brand-muted text-sm mb-8">
        Preencha as informações abaixo e receba propostas de técnicos certificados na sua região.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card space-y-5">

          <div>
            <label className="label-base">☀️ Quantidade de módulos *</label>
            <input
              type="number"
              min={1}
              placeholder="Ex: 12"
              className="input-base"
              value={modulos}
              onChange={(e) => setModulos(e.target.value)}
              required
            />
          </div>

          {/* ── Card de prévia em tempo real ── */}
          {showPreview && (
            <div className="bg-brand-dark rounded-2xl p-5 space-y-3">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                Prévia do seu pedido
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Técnicos disponíveis */}
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-lg mb-1">🧑‍🔧</p>
                  {cidade.trim().length > 3 ? (
                    tecnicos > 0 ? (
                      <>
                        <p className="font-heading font-bold text-brand-green text-base">
                          {tecnicos} técnicos
                        </p>
                        <p className="text-white/50 text-xs mt-0.5">em {cidade.split(",")[0]}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-heading font-bold text-yellow-400 text-base">Expansão</p>
                        <p className="text-white/50 text-xs mt-0.5">Cidade em expansão</p>
                      </>
                    )
                  ) : (
                    <>
                      <p className="font-heading font-bold text-white/40 text-base">—</p>
                      <p className="text-white/40 text-xs mt-0.5">Informe a cidade</p>
                    </>
                  )}
                </div>

                {/* Tempo médio de aceite */}
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-lg mb-1">⏱️</p>
                  <p className="font-heading font-bold text-white text-base">
                    {cidade.trim().length > 3 ? tempoAceite(cidade) : "—"}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">tempo médio de aceite</p>
                </div>

                {/* Estimativa de valor */}
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-lg mb-1">💰</p>
                  <p className="font-heading font-bold text-brand-green text-base">
                    {numModulos > 0 ? preco : "—"}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">
                    {numModulos > 0
                      ? numModulos <= 10
                        ? "até 10 módulos"
                        : numModulos <= 30
                        ? "11–30 módulos"
                        : numModulos <= 60
                        ? "31–60 módulos"
                        : "usina grande"
                      : "informe a quantidade"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="label-base">📍 Endereço completo *</label>
            <input
              type="text"
              placeholder="Rua, número, bairro"
              className="input-base"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-base">🏙️ Cidade *</label>
              <input
                type="text"
                placeholder="Jaraguá do Sul"
                className="input-base"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label-base">Estado *</label>
              <select className="input-base" required>
                <option value="">Selecione</option>
                {ESTADOS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* ── Técnicos na região ── */}
        <TecnicosRegiao cidade={cidade} modulos={numModulos} />

        <div className="card space-y-5">

          <div>
            <label className="label-base">📅 Data preferida</label>
            <input type="date" className="input-base" />
          </div>

          <div>
            <label className="label-base">🗒️ Período preferido</label>
            <select className="input-base">
              <option value="manha">🌅 Manhã</option>
              <option value="tarde">🌇 Tarde</option>
            </select>
          </div>

          <div>
            <label className="label-base">💬 Observações</label>
            <textarea
              rows={3}
              placeholder="Informações adicionais para o técnico…"
              className="input-base resize-none"
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          {submitting ? "Enviando…" : "🚀 Enviar solicitação"}
        </Button>
      </form>
    </div>
  );
}
