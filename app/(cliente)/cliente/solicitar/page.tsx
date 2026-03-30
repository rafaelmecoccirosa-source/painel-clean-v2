"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Toast, { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { calcPrice } from "@/lib/types";

const CIDADES = ["Jaraguá do Sul", "Pomerode", "Florianópolis"];
const HORARIOS = [
  { value: "Manhã (8h-12h)",   label: "🌅 Manhã (8h–12h)" },
  { value: "Tarde (13h-17h)",  label: "🌇 Tarde (13h–17h)" },
  { value: "Qualquer horário", label: "🕐 Qualquer horário" },
];

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function faixaLabel(n: number) {
  if (n <= 10) return "Pequena instalação (até 10 módulos)";
  if (n <= 30) return "Instalação média (11–30 módulos)";
  if (n <= 60) return "Grande instalação (31–60 módulos)";
  return "Usina solar (61+ módulos)";
}

function minDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function SolicitarPage() {
  const router = useRouter();
  const { toast, show: showToast, hide: hideToast } = useToast();

  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [moduleCount, setModuleCount] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("Qualquer horário");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const numModules = parseInt(moduleCount) || 0;
  const price = numModules > 0 ? calcPrice(numModules) : null;
  const isSobConsulta = numModules > 60;
  const showPreview = numModules > 0 || city.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!city) { showToast("Selecione uma cidade.", "error"); return; }
    if (!address.trim()) { showToast("Informe o endereço completo.", "error"); return; }
    if (!moduleCount || numModules < 1) { showToast("Informe a quantidade de módulos.", "error"); return; }
    if (isSobConsulta) { showToast("Para 61+ módulos, entre em contato via WhatsApp.", "error"); return; }
    if (!preferredDate) { showToast("Selecione a data preferida.", "error"); return; }
    if (!price) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        showToast("Você precisa estar logado para solicitar um serviço.", "error");
        setSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from("service_requests")
        .insert({
          client_id: user.id,
          city,
          address: address.trim(),
          module_count: numModules,
          price_estimate: price,
          preferred_date: preferredDate,
          preferred_time: preferredTime,
          notes: notes.trim() || null,
          status: "pending",
        });

      if (error) {
        console.error("Supabase insert error:", error);
        showToast("Erro ao enviar solicitação. Tente novamente.", "error");
        setSubmitting(false);
        return;
      }

      showToast("Solicitação enviada! Você será notificado quando um técnico aceitar.", "success");
      setTimeout(() => router.push("/cliente"), 1800);
    } catch (err) {
      console.error(err);
      showToast("Erro inesperado. Tente novamente.", "error");
      setSubmitting(false);
    }
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      <h1 className="font-heading text-2xl font-bold text-brand-dark mb-2">
        🧹 Solicitar limpeza
      </h1>
      <p className="text-brand-muted text-sm mb-8">
        Preencha as informações abaixo e receba propostas de técnicos certificados na sua região.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card space-y-5">

          {/* Cidade */}
          <div>
            <label className="label-base">🏙️ Cidade *</label>
            <select
              className="input-base"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            >
              <option value="">Selecione a cidade</option>
              {CIDADES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Endereço */}
          <div>
            <label className="label-base">📍 Endereço completo *</label>
            <input
              type="text"
              placeholder="Rua, número, bairro, complemento"
              className="input-base"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Módulos */}
          <div>
            <label className="label-base">☀️ Quantidade de módulos *</label>
            <input
              type="number"
              min={1}
              placeholder="Ex: 12"
              className="input-base"
              value={moduleCount}
              onChange={(e) => setModuleCount(e.target.value)}
              required
            />
            {isSobConsulta && (
              <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                ⚠️ Para instalações com 61+ módulos, entre em contato pelo WhatsApp para orçamento personalizado.
              </p>
            )}
          </div>

          {/* Preview card */}
          {showPreview && !isSobConsulta && (
            <div className="bg-brand-dark rounded-2xl p-5 space-y-3">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                Resumo da solicitação
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-lg mb-1">📍</p>
                  <p className="font-heading font-bold text-white text-sm">
                    {city || "—"}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">cidade selecionada</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-lg mb-1">☀️</p>
                  <p className="font-heading font-bold text-white text-sm">
                    {numModules > 0 ? `${numModules} módulos` : "—"}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">
                    {numModules > 0 ? faixaLabel(numModules) : "informe a quantidade"}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-lg mb-1">💰</p>
                  <p className="font-heading font-bold text-brand-green text-base">
                    {price ? fmt(price) : "—"}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">valor estimado</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card space-y-5">
          {/* Data preferida */}
          <div>
            <label className="label-base">📅 Data preferida *</label>
            <input
              type="date"
              className="input-base"
              min={minDate()}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
            />
          </div>

          {/* Horário */}
          <div>
            <label className="label-base">🕐 Horário preferido</label>
            <select
              className="input-base"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
            >
              {HORARIOS.map((h) => (
                <option key={h.value} value={h.value}>{h.label}</option>
              ))}
            </select>
          </div>

          {/* Observações */}
          <div>
            <label className="label-base">
              💬 Observações{" "}
              <span className="text-brand-muted font-normal">(opcional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Ex: portão azul, tocar campainha, acesso pela lateral…"
              className="input-base resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Tabela de preços */}
        <div className="card">
          <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-3">
            Tabela de preços
          </p>
          <div className="space-y-2">
            {[
              { faixa: "Pequena", modulos: "até 10",  preco: 180,  destaque: false },
              { faixa: "Média",   modulos: "11 a 30", preco: 300,  destaque: true  },
              { faixa: "Grande",  modulos: "31 a 60", preco: 520,  destaque: false },
              { faixa: "Usina",   modulos: "61+",     preco: null, destaque: false },
            ].map((row) => (
              <div
                key={row.faixa}
                className={`flex justify-between items-center px-4 py-2.5 rounded-xl text-sm ${
                  row.destaque
                    ? "bg-brand-light border border-brand-border font-semibold"
                    : "bg-brand-bg"
                }`}
              >
                <span className="text-brand-dark">
                  {row.faixa}{" "}
                  <span className="text-brand-muted font-normal">({row.modulos} módulos)</span>
                </span>
                <span className={row.destaque ? "text-brand-dark font-bold" : "text-brand-muted"}>
                  {row.preco ? fmt(row.preco) : "Sob consulta"}
                  {row.destaque && (
                    <span className="text-brand-green text-xs ml-1.5">← mais comum</span>
                  )}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-brand-muted mt-3">
            * Repasse ao técnico: 85% do valor. Pagamento somente após conclusão.
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={submitting}
          disabled={isSobConsulta || submitting}
        >
          {submitting ? "Enviando…" : "🚀 Enviar solicitação"}
        </Button>
      </form>
    </div>
  );
}
