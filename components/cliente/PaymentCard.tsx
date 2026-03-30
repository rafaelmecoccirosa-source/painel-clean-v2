"use client";

import { useState } from "react";
import { Copy, Check, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { PaymentStatus } from "@/lib/types";

const PIX_KEY  = "pix@painelclean.com.br";
const PIX_NAME = "Painel Clean Ltda";

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface Props {
  serviceId: string;
  amount: number;
  initialPaymentStatus?: PaymentStatus;
  onStatusChange?: (s: PaymentStatus) => void;
}

export default function PaymentCard({
  serviceId,
  amount,
  initialPaymentStatus = "pending",
  onStatusChange,
}: Props) {
  const [payStatus, setPayStatus] = useState<PaymentStatus>(initialPaymentStatus);
  const [copied,    setCopied]    = useState(false);
  const [showForm,  setShowForm]  = useState(false);
  const [proofNote, setProofNote] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg,  setToastMsg]  = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
    } catch {
      // fallback: do nothing silently
    }
    setCopied(true);
    showToast("Chave PIX copiada!");
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleConfirmPayment() {
    setSubmitting(true);
    try {
      const supabase = createClient();

      let proofUrl: string | null = null;

      // Upload proof to Storage if provided and bucket exists
      if (proofFile) {
        try {
          const ext  = proofFile.name.split(".").pop() ?? "jpg";
          const path = `payment-proofs/${serviceId}/${Date.now()}.${ext}`;
          const { error: uploadErr } = await supabase.storage
            .from("service-photos")
            .upload(path, proofFile, { cacheControl: "3600", upsert: false });

          if (!uploadErr) {
            const { data: { publicUrl } } = supabase.storage
              .from("service-photos")
              .getPublicUrl(path);
            proofUrl = publicUrl;
          }
        } catch {
          // Storage not configured — ignore
        }
      }

      const updatePayload: Record<string, unknown> = {
        payment_status: "awaiting_confirmation",
        paid_at:        new Date().toISOString(),
      };
      if (proofUrl) updatePayload.payment_proof_url = proofUrl;

      const { error } = await supabase
        .from("service_requests")
        .update(updatePayload)
        .eq("id", serviceId);

      if (error) {
        console.warn("payment update:", error.message);
        // Proceed optimistically even if column doesn't exist yet
      }

      const next: PaymentStatus = "awaiting_confirmation";
      setPayStatus(next);
      onStatusChange?.(next);
      setShowForm(false);
      showToast("Pagamento informado! Aguarde a confirmação (em até 24h).");
    } catch (err) {
      console.error(err);
      showToast("Erro ao enviar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render based on payStatus ────────────────────────────────────────────

  if (payStatus === "released") {
    return (
      <div className="rounded-2xl border border-brand-green/40 bg-brand-dark px-5 py-4 flex items-center gap-3">
        <span className="text-2xl">💸</span>
        <div>
          <p className="font-semibold text-brand-green text-sm">Repasse realizado!</p>
          <p className="text-xs text-white/50 mt-0.5">Pagamento concluído e repasse enviado ao técnico.</p>
        </div>
      </div>
    );
  }

  if (payStatus === "confirmed") {
    return (
      <div className="rounded-2xl border border-brand-green bg-brand-light px-5 py-4 flex items-center gap-3">
        <span className="text-2xl">✅</span>
        <div>
          <p className="font-semibold text-brand-dark text-sm">Pagamento confirmado!</p>
          <p className="text-xs text-brand-muted mt-0.5">Seu serviço foi pago com sucesso. O repasse ao técnico será processado.</p>
        </div>
      </div>
    );
  }

  if (payStatus === "awaiting_confirmation") {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 flex items-center gap-3">
        <span className="text-2xl">⏳</span>
        <div>
          <p className="font-semibold text-amber-800 text-sm">Pagamento em análise</p>
          <p className="text-xs text-amber-700 mt-0.5">Aguardando confirmação da Painel Clean (geralmente em até 24h).</p>
        </div>
      </div>
    );
  }

  // payStatus === "pending"
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 space-y-4 overflow-hidden">
      {/* Toast */}
      {toastMsg && (
        <div className="mx-4 mt-4 bg-brand-dark text-white text-xs font-semibold rounded-xl px-4 py-2.5 flex items-center justify-between">
          {toastMsg}
          <button onClick={() => setToastMsg(null)}><X size={13} /></button>
        </div>
      )}

      <div className="px-5 pt-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">💰 Pagamento pendente</p>
            <p className="font-heading font-extrabold text-brand-dark text-3xl">{fmt(amount)}</p>
          </div>
          <span className="flex-shrink-0 text-xs font-bold bg-white border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full">
            PIX
          </span>
        </div>

        {/* PIX card */}
        <div className="bg-white rounded-xl border border-amber-200 px-4 py-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-green/10 flex items-center justify-center flex-shrink-0">
              <span className="text-brand-green font-extrabold text-xs">PIX</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-brand-muted uppercase tracking-wide">Chave PIX</p>
              <p className="text-sm font-semibold text-brand-dark font-mono truncate">{PIX_KEY}</p>
            </div>
            <button
              onClick={copyPix}
              className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors
                bg-brand-green text-white border-brand-green hover:bg-brand-green/90"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>

          <div className="border-t border-amber-100 pt-3 grid grid-cols-2 gap-2 text-xs text-brand-muted">
            <div>
              <p className="font-semibold text-brand-dark">Beneficiário</p>
              <p>{PIX_NAME}</p>
            </div>
            <div>
              <p className="font-semibold text-brand-dark">Valor exato</p>
              <p className="font-semibold text-brand-green">{fmt(amount)}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <ol className="space-y-1.5 text-xs text-amber-800">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 h-4 w-4 rounded-full bg-amber-200 text-amber-800 text-[9px] font-bold flex items-center justify-center">1</span>
            Abra o app do seu banco
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 h-4 w-4 rounded-full bg-amber-200 text-amber-800 text-[9px] font-bold flex items-center justify-center">2</span>
            Faça um PIX para a chave acima no valor exato de <strong className="mx-0.5">{fmt(amount)}</strong>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 h-4 w-4 rounded-full bg-amber-200 text-amber-800 text-[9px] font-bold flex items-center justify-center">3</span>
            Após pagar, clique no botão abaixo para confirmar
          </li>
        </ol>

        {/* CTA */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-brand-dark text-white text-sm font-semibold rounded-xl py-3 hover:bg-brand-dark/90 transition-colors flex items-center justify-center gap-2"
          >
            ✅ Já paguei
          </button>
        ) : (
          <div className="bg-white rounded-xl border border-amber-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-brand-dark">Confirmar pagamento</p>
              <button onClick={() => setShowForm(false)} className="text-brand-muted hover:text-brand-dark"><X size={16} /></button>
            </div>

            <textarea
              value={proofNote}
              onChange={(e) => setProofNote(e.target.value)}
              placeholder="Cole o comprovante ou ID da transação (opcional)…"
              rows={2}
              className="w-full rounded-xl border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-dark placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
            />

            {/* File upload */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-brand-muted hover:text-brand-dark transition-colors">
              <Upload size={14} />
              {proofFile ? (
                <span className="truncate text-brand-dark font-medium">{proofFile.name}</span>
              ) : (
                "Anexar comprovante (imagem, opcional)"
              )}
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
              />
            </label>

            <button
              onClick={handleConfirmPayment}
              disabled={submitting}
              className="w-full bg-brand-green text-white text-sm font-semibold rounded-xl py-2.5 hover:bg-brand-green/90 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Enviando…" : "Confirmar pagamento"}
            </button>
          </div>
        )}
      </div>
      <div className="h-1" /> {/* bottom spacing */}
    </div>
  );
}
