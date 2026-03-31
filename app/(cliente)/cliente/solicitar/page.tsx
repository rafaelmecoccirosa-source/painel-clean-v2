"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Copy, Check, CheckCircle2, MapPin, Navigation, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Toast, { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { calcPrice } from "@/lib/types";

// Leaflet must be loaded client-side only (no SSR)
const MapPickerLeaflet = dynamic(
  () => import("@/components/shared/MapPickerLeaflet"),
  { ssr: false, loading: () => <div className="w-full h-full bg-brand-bg animate-pulse rounded-xl" /> }
);

const CIDADES = ["Jaraguá do Sul", "Pomerode", "Florianópolis"];
const HORARIOS = [
  { value: "Manhã (8h-12h)",   label: "🌅 Manhã (8h–12h)" },
  { value: "Tarde (13h-17h)",  label: "🌇 Tarde (13h–17h)" },
  { value: "Qualquer horário", label: "🕐 Qualquer horário" },
];

const CITY_CENTERS: Record<string, [number, number]> = {
  "Jaraguá do Sul": [-26.4854, -49.0713],
  "Pomerode":       [-26.7407, -49.1764],
  "Florianópolis":  [-27.5954, -48.5480],
};
const DEFAULT_CENTER: [number, number] = [-27.0, -49.0];

const PIX_KEY  = "pix@painelclean.com.br";
const PIX_NAME = "Painel Clean Ltda";

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

// ── PIX Payment Screen ────────────────────────────────────────────────────────

function PixPaymentScreen({ serviceId, amount }: { serviceId: string; amount: number }) {
  const router = useRouter();
  const [copied, setCopied]         = useState(false);
  const [transactionNote, setNote]  = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast, show: showToast, hide: hideToast } = useToast();

  async function handlePaid() {
    setSubmitting(true);
    try {
      const supabase = createClient();
      await supabase
        .from("service_requests")
        .update({
          payment_status: "awaiting_confirmation",
          paid_at: new Date().toISOString(),
          ...(transactionNote.trim()
            ? { notes: `[Transação PIX: ${transactionNote.trim()}]` }
            : {}),
        })
        .eq("id", serviceId);

      showToast(
        "Pagamento informado! Seu agendamento será confirmado em até 24h.",
        "success"
      );
      setTimeout(() => router.push("/cliente"), 2000);
    } catch {
      showToast("Erro ao registrar pagamento. Tente novamente.", "error");
      setSubmitting(false);
    }
  }

  function copyKey() {
    navigator.clipboard.writeText(PIX_KEY).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="page-container max-w-lg mx-auto space-y-6">
      {toast && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="text-center space-y-2">
        <div className="h-16 w-16 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} className="text-brand-green" />
        </div>
        <h1 className="font-heading font-bold text-brand-dark text-xl">
          Solicitação criada com sucesso!
        </h1>
        <p className="text-brand-muted text-sm">
          Para confirmar seu agendamento, realize o pagamento via PIX
        </p>
      </div>

      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-sm">
        <span>⏰</span>
        <span className="font-medium">Este pedido expira em 24h se o pagamento não for confirmado</span>
      </div>

      <div className="bg-brand-dark rounded-2xl p-6 space-y-5">
        <div className="text-center">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Valor do serviço</p>
          <p className="font-heading font-bold text-brand-green text-4xl">{fmt(amount)}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-white/50 text-xs mb-0.5">Chave PIX</p>
              <p className="text-white font-mono text-sm font-semibold truncate">{PIX_KEY}</p>
            </div>
            <button
              type="button"
              onClick={copyKey}
              className="flex items-center gap-1.5 bg-brand-green hover:bg-brand-green/90 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex-shrink-0"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copiado!" : "Copiar chave"}
            </button>
          </div>
          <div>
            <p className="text-white/50 text-xs mb-0.5">Beneficiário</p>
            <p className="text-white text-sm font-semibold">{PIX_NAME}</p>
          </div>
        </div>

        <div className="space-y-2">
          {[
            "Abra o app do seu banco",
            `Faça um PIX no valor exato de ${fmt(amount)}`,
            "Volte aqui e confirme o pagamento",
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-brand-green flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-white/80 text-sm">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">
          ID da transação ou observação <span className="font-normal">(opcional)</span>
        </label>
        <textarea
          value={transactionNote}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Cole o ID da transação ou qualquer observação sobre o pagamento…"
          rows={2}
          className="w-full rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
        />
      </div>

      <Button type="button" size="lg" className="w-full" onClick={handlePaid} loading={submitting}>
        <CheckCircle2 size={18} />
        {submitting ? "Registrando…" : "Já paguei ✅"}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => router.push("/cliente")}
          className="text-sm text-brand-muted hover:text-brand-dark underline underline-offset-2 transition-colors"
        >
          Pagar depois
        </button>
        <p className="text-xs text-brand-muted mt-1">
          O serviço não será agendado até o pagamento ser confirmado.
        </p>
      </div>
    </div>
  );
}

// ── Map Section ───────────────────────────────────────────────────────────────

function MapSection({
  city,
  lat,
  lng,
  locationDescription,
  onLatLng,
  onDescription,
}: {
  city: string;
  lat: number | null;
  lng: number | null;
  locationDescription: string;
  onLatLng: (lat: number, lng: number) => void;
  onDescription: (v: string) => void;
}) {
  const center = CITY_CENTERS[city] ?? DEFAULT_CENTER;
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);

  function handleGeolocate() {
    if (!navigator.geolocation) {
      setGeoError("Geolocalização não disponível neste dispositivo.");
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onLatLng(latitude, longitude);
        setMapCenter([latitude, longitude]);
        setGeoLoading(false);
      },
      () => {
        setGeoError("Não foi possível obter sua localização. Verifique as permissões.");
        setGeoLoading(false);
      },
      { timeout: 10000 }
    );
  }

  return (
    <div className="space-y-3">
      {/* Geolocation button */}
      <button
        type="button"
        onClick={handleGeolocate}
        disabled={geoLoading}
        className="flex items-center gap-2 text-sm font-semibold text-brand-dark border border-brand-border bg-white hover:bg-brand-light rounded-xl px-4 py-2.5 transition-colors disabled:opacity-60"
      >
        <Navigation size={15} className={geoLoading ? "animate-pulse" : ""} />
        {geoLoading ? "Obtendo localização…" : "Usar minha localização atual"}
      </button>

      {geoError && (
        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{geoError}</p>
      )}

      {/* Instruction */}
      <p className="text-xs text-brand-muted">
        {lat !== null
          ? `📍 Pin posicionado: ${lat.toFixed(5)}, ${lng?.toFixed(5)} — arraste para ajustar`
          : "Clique no mapa para posicionar o pin de localização"}
      </p>

      {/* Map */}
      <div
        className="w-full rounded-xl overflow-hidden border border-brand-border shadow-sm"
        style={{ height: "280px" }}
      >
        <MapPickerLeaflet
          lat={lat}
          lng={lng}
          centerLat={mapCenter[0]}
          centerLng={mapCenter[1]}
          onChange={(newLat, newLng) => onLatLng(newLat, newLng)}
        />
      </div>

      {/* Location description */}
      {lat !== null && (
        <div>
          <label className="label-base">
            📝 Descrição do local{" "}
            <span className="text-brand-muted font-normal">(opcional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Ex: Casa amarela no final da estrada de terra, portão azul à direita"
            className="input-base resize-none"
            value={locationDescription}
            onChange={(e) => onDescription(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SolicitarPage() {
  const { toast, show: showToast, hide: hideToast } = useToast();

  const [city, setCity]               = useState("");
  const [address, setAddress]         = useState("");
  const [useMap, setUseMap]           = useState(false);
  const [lat, setLat]                 = useState<number | null>(null);
  const [lng, setLng]                 = useState<number | null>(null);
  const [locationDescription, setLocationDescription] = useState("");
  const [moduleCount, setModuleCount] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("Qualquer horário");
  const [notes, setNotes]             = useState("");
  const [submitting, setSubmitting]   = useState(false);

  // After submit
  const [createdId,    setCreatedId]    = useState<string | null>(null);
  const [createdPrice, setCreatedPrice] = useState<number | null>(null);

  const numModules    = parseInt(moduleCount) || 0;
  const price         = numModules > 0 ? calcPrice(numModules) : null;
  const isSobConsulta = numModules > 60;
  const showPreview   = numModules > 0 || city.length > 0;

  const handleLatLng = useCallback((newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!city) { showToast("Selecione uma cidade.", "error"); return; }

    // Require address OR map pin
    if (!useMap && !address.trim()) {
      showToast("Informe o endereço ou marque a localização no mapa.", "error");
      return;
    }
    if (useMap && lat === null) {
      showToast("Clique no mapa para marcar a localização exata.", "error");
      return;
    }

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

      const payload: Record<string, unknown> = {
        client_id:      user.id,
        city,
        address:        address.trim() || (useMap ? `Pin no mapa: ${lat?.toFixed(5)}, ${lng?.toFixed(5)}` : ""),
        module_count:   numModules,
        price_estimate: price,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        notes:          notes.trim() || null,
        status:         "pending",
        payment_status: "pending",
      };

      if (useMap && lat !== null && lng !== null) {
        payload.latitude  = lat;
        payload.longitude = lng;
        if (locationDescription.trim()) {
          payload.location_description = locationDescription.trim();
        }
      }

      const { data, error } = await supabase
        .from("service_requests")
        .insert(payload)
        .select("id")
        .single();

      if (error || !data) {
        console.error("Supabase insert error:", error);
        showToast("Erro ao enviar solicitação. Tente novamente.", "error");
        setSubmitting(false);
        return;
      }

      setCreatedId(data.id);
      setCreatedPrice(price);
    } catch (err) {
      console.error(err);
      showToast("Erro inesperado. Tente novamente.", "error");
      setSubmitting(false);
    }
  }

  if (createdId && createdPrice) {
    return <PixPaymentScreen serviceId={createdId} amount={createdPrice} />;
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      {toast && (
        <Toast key={toast.key} message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <h1 className="font-heading text-2xl font-bold text-brand-dark mb-2">
        🧹 Solicitar limpeza
      </h1>
      <p className="text-brand-muted text-sm mb-8">
        Preencha as informações abaixo e realize o pagamento via PIX para confirmar seu agendamento.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card space-y-5">

          {/* Cidade */}
          <div>
            <label className="label-base">🏙️ Cidade *</label>
            <select
              className="input-base"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                // Reset map pin when city changes
                setLat(null);
                setLng(null);
              }}
              required
            >
              <option value="">Selecione a cidade</option>
              {CIDADES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Address / Map toggle */}
          <div className="space-y-3">
            <label className="label-base">📍 Localização *</label>

            {/* Toggle buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUseMap(false)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-semibold transition-colors ${
                  !useMap
                    ? "bg-brand-dark text-white border-brand-dark"
                    : "bg-white text-brand-muted border-brand-border hover:border-brand-dark/50"
                }`}
              >
                ✏️ Digitar endereço
              </button>
              <button
                type="button"
                onClick={() => setUseMap(true)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-semibold transition-colors ${
                  useMap
                    ? "bg-brand-dark text-white border-brand-dark"
                    : "bg-white text-brand-muted border-brand-border hover:border-brand-dark/50"
                }`}
              >
                <MapPin size={14} /> Marcar no mapa
              </button>
            </div>

            {/* Address text input */}
            {!useMap && (
              <input
                type="text"
                placeholder="Rua, número, bairro, complemento"
                className="input-base"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            )}

            {/* Map picker */}
            {useMap && (
              <MapSection
                city={city}
                lat={lat}
                lng={lng}
                locationDescription={locationDescription}
                onLatLng={handleLatLng}
                onDescription={setLocationDescription}
              />
            )}
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
                  <p className="font-heading font-bold text-white text-sm">{city || "—"}</p>
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
                  <p className="text-white/50 text-xs mt-0.5">valor a pagar via PIX</p>
                </div>
              </div>
              {useMap && lat !== null && (
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-white/50 text-xs mb-1">📍 Localização marcada no mapa</p>
                  <p className="text-white text-xs font-mono">{lat.toFixed(5)}, {lng?.toFixed(5)}</p>
                  {locationDescription && (
                    <p className="text-white/70 text-xs mt-1">{locationDescription}</p>
                  )}
                </div>
              )}
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

        {/* Price table */}
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
            * Pagamento antecipado via PIX. O técnico só é acionado após confirmação do pagamento.
          </p>
        </div>

        {/* PIX info banner */}
        <div className="flex items-start gap-3 bg-brand-light border border-brand-border rounded-xl px-4 py-3">
          <span className="text-xl">💰</span>
          <div>
            <p className="text-sm font-semibold text-brand-dark">Pagamento antecipado via PIX</p>
            <p className="text-xs text-brand-muted mt-0.5">
              Após enviar a solicitação, você receberá a chave PIX para pagamento. Seu agendamento é confirmado em até 24h.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={submitting}
          disabled={isSobConsulta || submitting}
        >
          {submitting ? "Criando solicitação…" : "🚀 Enviar solicitação e pagar via PIX"}
        </Button>
      </form>
    </div>
  );
}
