"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Copy, Check, CheckCircle2, MapPin, Navigation } from "lucide-react";
import Button from "@/components/ui/Button";
import Toast, { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { calcularPreco, type TipoInstalacao, type NivelSujeira, type NivelAcesso } from "@/lib/pricing";
import { getTecnicosDisponiveis, type DisponibilidadeResult } from "@/lib/availability";
import { MVP_PRICING_ACTIVE } from "@/lib/config";

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
      const now = new Date().toISOString();
      await supabase
        .from("service_requests")
        .update({
          payment_status:       "awaiting_confirmation",
          paid_at:              now,
          payment_reported_at:  now,
          ...(transactionNote.trim()
            ? { notes: `[Transação PIX: ${transactionNote.trim()}]` }
            : {}),
        })
        .eq("id", serviceId);

      showToast(
        "Pagamento informado! Confirmação em até 15 minutos.",
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
        <span>⏳</span>
        <span className="font-medium">
          Confirme o pagamento abaixo. Nosso time verifica em até <strong>15 minutos</strong> e seu agendamento é ativado automaticamente.
        </span>
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

      <p className="text-xs text-brand-muted">
        {lat !== null
          ? `📍 Pin posicionado: ${lat.toFixed(5)}, ${lng?.toFixed(5)} — arraste para ajustar`
          : "Clique no mapa para posicionar o pin de localização"}
      </p>

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

// ── Radio Button Group ─────────────────────────────────────────────────────────

function RadioGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; emoji: string; label: string; desc: string; color?: string }[];
}) {
  return (
    <div>
      <label className="label-base">{label}</label>
      <div className="grid grid-cols-1 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-colors ${
              value === opt.value
                ? "border-brand-green bg-brand-light"
                : "border-brand-border bg-white hover:border-brand-dark/30"
            }`}
          >
            <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-brand-dark">{opt.label}</p>
              <p className="text-xs text-brand-muted leading-snug">{opt.desc}</p>
            </div>
            <div className={`ml-auto h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              value === opt.value ? "border-brand-green bg-brand-green" : "border-brand-border"
            }`}>
              {value === opt.value && (
                <div className="h-2 w-2 rounded-full bg-white" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TwoOptionGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; emoji: string; label: string; desc: string }[];
}) {
  return (
    <div>
      <label className="label-base">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-col gap-1.5 px-3 py-3 rounded-xl border-2 text-left transition-colors ${
              value === opt.value
                ? "border-brand-green bg-brand-light"
                : "border-brand-border bg-white hover:border-brand-dark/30"
            }`}
          >
            <span className="text-xl">{opt.emoji}</span>
            <p className="text-sm font-semibold text-brand-dark">{opt.label}</p>
            <p className="text-xs text-brand-muted leading-snug">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Price Preview Card ─────────────────────────────────────────────────────────

function PricePreviewCard({
  placas,
  tipoInstalacao,
  sujeira,
  acesso,
  distanciaKm,
}: {
  placas: number;
  tipoInstalacao: TipoInstalacao;
  sujeira: NivelSujeira;
  acesso: NivelAcesso;
  distanciaKm: number;
}) {
  if (placas <= 0) return null;

  const result = calcularPreco({ placas, tipoInstalacao, sujeira, acesso, distanciaKm });

  if (result.sobConsulta) {
    return (
      <div className="bg-brand-dark rounded-2xl p-5 space-y-3 text-center">
        <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
          💰 Estimativa de preço
        </p>
        <p className="font-heading font-bold text-white text-xl">Sob consulta</p>
        <p className="text-white/60 text-sm">
          Para instalações com mais de 200 placas, entre em contato pelo WhatsApp para um orçamento personalizado.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-brand-dark rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
          💰 Estimativa de preço
        </p>
        {result.descontoMvpAtivo && MVP_PRICING_ACTIVE && (
          <span className="text-[10px] font-bold bg-brand-green/20 text-brand-green border border-brand-green/30 px-2 py-1 rounded-full whitespace-nowrap">
            🏷️ Preço especial de lançamento
          </span>
        )}
      </div>

      <div>
        <p className="font-heading font-extrabold text-brand-green text-3xl leading-none">
          {fmt(result.precoMin)} a {fmt(result.precoMax)}
        </p>
        <p className="text-white/50 text-xs mt-1.5">
          estimativa baseada nas condições informadas
        </p>
      </div>

      <div className="space-y-1.5 border-t border-white/10 pt-3">
        <p className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-2">
          Detalhamento
        </p>
        <p className="text-white/70 text-sm">
          · {result.detalhe.baseCalculo}
        </p>
        <p className="text-white/70 text-sm">
          · {result.detalhe.tipoLabel} (×{result.multTipo.toFixed(2)})
        </p>
        {result.detalhe.extras.map((extra) => (
          <p key={extra} className="text-white/70 text-sm">· {extra}</p>
        ))}
        {distanciaKm > 0 && (
          <p className="text-white/70 text-sm">
            · Deslocamento: {fmt(result.custoDeslocamento)} ({distanciaKm} km)
          </p>
        )}
      </div>

      <p className="text-white/40 text-xs border-t border-white/10 pt-3">
        * Valor final confirmado pelo técnico dentro desta faixa
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SolicitarPage() {
  const { toast, show: showToast, hide: hideToast } = useToast();

  const [city, setCity]                           = useState("");
  const [disponibilidade, setDisponibilidade]     = useState<DisponibilidadeResult | null>(null);
  const [loadingDisp, setLoadingDisp]             = useState(false);
  const [contatoSemTecnico, setContatoSemTecnico] = useState("");
  const [address, setAddress]                     = useState("");
  const [useMap, setUseMap]                       = useState(false);
  const [lat, setLat]                             = useState<number | null>(null);
  const [lng, setLng]                             = useState<number | null>(null);
  const [locationDescription, setLocationDescription] = useState("");
  const [placaCount, setPlacaCount]               = useState("");
  const [tipoInstalacao, setTipoInstalacao]       = useState<TipoInstalacao>("telhado_padrao");
  const [sujeira, setSujeira]                     = useState<NivelSujeira>("normal");
  const [acesso, setAcesso]                       = useState<NivelAcesso>("normal");
  const [distanciaKm, setDistanciaKm]             = useState(0);
  const [preferredDate, setPreferredDate]         = useState("");
  const [preferredTime, setPreferredTime]         = useState("Qualquer horário");
  const [notes, setNotes]                         = useState("");
  const [submitting, setSubmitting]               = useState(false);

  // After submit
  const [createdId,    setCreatedId]    = useState<string | null>(null);
  const [createdPrice, setCreatedPrice] = useState<number | null>(null);

  const numPlacas = parseInt(placaCount) || 0;

  // Verifica disponibilidade de técnicos ao selecionar cidade
  useEffect(() => {
    if (!city) { setDisponibilidade(null); return; }
    setLoadingDisp(true);
    const supabase = createClient();
    getTecnicosDisponiveis(city, supabase)
      .then(setDisponibilidade)
      .finally(() => setLoadingDisp(false));
  }, [city]);

  const handleLatLng = useCallback((newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!city) { showToast("Selecione uma cidade.", "error"); return; }

    if (!useMap && !address.trim()) {
      showToast("Informe o endereço ou marque a localização no mapa.", "error");
      return;
    }
    if (useMap && lat === null) {
      showToast("Clique no mapa para marcar a localização exata.", "error");
      return;
    }

    if (!placaCount || numPlacas < 1) {
      showToast("Informe a quantidade de placas.", "error");
      return;
    }
    if (numPlacas > 200) {
      showToast("Para instalações com mais de 200 placas, entre em contato via WhatsApp.", "error");
      return;
    }
    if (!preferredDate) { showToast("Selecione a data preferida.", "error"); return; }

    const pricing = calcularPreco({
      placas: numPlacas,
      tipoInstalacao,
      sujeira,
      acesso,
      distanciaKm,
    });

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
        client_id:       user.id,
        city,
        address:         address.trim() || (useMap ? `Pin no mapa: ${lat?.toFixed(5)}, ${lng?.toFixed(5)}` : ""),
        module_count:    numPlacas,
        price_estimate:  pricing.precoCliente,   // preço que o cliente paga (com desconto MVP se ativo)
        preco_min:       pricing.precoMin,
        preco_max:       pricing.precoMax,
        tipo_instalacao: tipoInstalacao,
        nivel_sujeira:   sujeira,
        nivel_acesso:    acesso,
        distancia_km:    distanciaKm,
        preferred_date:  preferredDate,
        preferred_time:  preferredTime,
        notes:           notes.trim() || null,
        status:          "pending",
        payment_status:  "pending",
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
      setCreatedPrice(pricing.precoCliente);
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
        {/* ── Card 1: Local ────────────────────────────────────── */}
        <div className="card space-y-5">
          {/* Cidade */}
          <div>
            <label className="label-base">🏙️ Cidade *</label>
            <select
              className="input-base"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
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

            {/* Badge de disponibilidade */}
            {loadingDisp && city && (
              <p className="text-xs text-brand-muted mt-2 animate-pulse">
                🔍 Verificando técnicos disponíveis…
              </p>
            )}
            {!loadingDisp && disponibilidade && disponibilidade.disponivel && (
              <div className="mt-2 flex items-center gap-2 bg-brand-light border border-brand-border rounded-xl px-3 py-2.5">
                <span className="text-brand-green text-base">✅</span>
                <p className="text-xs font-semibold text-brand-dark">{disponibilidade.mensagem}</p>
              </div>
            )}
            {!loadingDisp && disponibilidade && !disponibilidade.disponivel && (
              <div className="mt-2 space-y-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 text-base flex-shrink-0">⚠️</span>
                  <p className="text-sm font-medium text-red-800">{disponibilidade.mensagem}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-red-700 mb-1.5">
                    Deixe seu contato — avisamos quando tivermos cobertura
                  </label>
                  <input
                    type="text"
                    placeholder="E-mail ou WhatsApp"
                    className="w-full rounded-xl border border-red-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                    value={contatoSemTecnico}
                    onChange={(e) => setContatoSemTecnico(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Address / Map toggle */}
          <div className="space-y-3">
            <label className="label-base">📍 Localização *</label>
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

            {!useMap && (
              <input
                type="text"
                placeholder="Rua, número, bairro, complemento"
                className="input-base"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            )}

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
        </div>

        {/* ── Card 2: Informações das placas ───────────────────── */}
        <div className="card space-y-6">
          <h2 className="font-heading font-bold text-brand-dark text-base -mb-1">
            ☀️ Informações das placas
          </h2>

          {/* Quantidade de placas */}
          <div>
            <label className="label-base">Quantidade de placas *</label>
            <input
              type="number"
              min={1}
              max={200}
              placeholder="Ex: 12"
              className="input-base"
              value={placaCount}
              onChange={(e) => setPlacaCount(e.target.value)}
              required
            />
            {numPlacas > 200 && (
              <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                ⚠️ Para instalações com mais de 200 placas, entre em contato pelo WhatsApp para orçamento personalizado.
              </p>
            )}
          </div>

          {/* Tipo de instalação */}
          <RadioGroup<TipoInstalacao>
            label="🏗️ Tipo de instalação *"
            value={tipoInstalacao}
            onChange={setTipoInstalacao}
            options={[
              { value: "solo",            emoji: "☀️", label: "Solo",            desc: "Placas instaladas no chão ou estrutura baixa" },
              { value: "telhado_padrao",  emoji: "🏠", label: "Telhado padrão",  desc: "Telhado residencial com acesso normal" },
              { value: "telhado_dificil", emoji: "🏗️", label: "Telhado difícil", desc: "Telhado alto, inclinado ou de difícil acesso" },
            ]}
          />

          {/* Nível de sujeira */}
          <TwoOptionGroup<NivelSujeira>
            label="🧹 Nível de sujeira"
            value={sujeira}
            onChange={setSujeira}
            options={[
              { value: "normal", emoji: "🟢", label: "Normal", desc: "Poeira leve, sujeira comum" },
              { value: "pesada", emoji: "🟠", label: "Pesada", desc: "Acúmulo intenso, fezes de pássaros, fuligem" },
            ]}
          />

          {/* Acesso ao local */}
          <TwoOptionGroup<NivelAcesso>
            label="🚪 Acesso ao local"
            value={acesso}
            onChange={setAcesso}
            options={[
              { value: "normal",  emoji: "🟢", label: "Normal", desc: "Acesso fácil, sem obstáculos" },
              { value: "dificil", emoji: "🟠", label: "Difícil", desc: "Acesso restrito, escada, terreno irregular" },
            ]}
          />

          {/* Distância estimada */}
          <div>
            <label className="label-base">📏 Distância estimada ao local (km)</label>
            <input
              type="number"
              min={0}
              step={0.5}
              placeholder="0"
              className="input-base"
              value={distanciaKm || ""}
              onChange={(e) => setDistanciaKm(parseFloat(e.target.value) || 0)}
            />
            <p className="text-xs text-brand-muted mt-1.5">
              Distância aproximada da sua cidade ao local. Se for na cidade, deixe 0.
            </p>
          </div>

          {/* Real-time price preview */}
          <PricePreviewCard
            placas={numPlacas}
            tipoInstalacao={tipoInstalacao}
            sujeira={sujeira}
            acesso={acesso}
            distanciaKm={distanciaKm}
          />
        </div>

        {/* ── Card 3: Agendamento ──────────────────────────────── */}
        <div className="card space-y-5">
          <h2 className="font-heading font-bold text-brand-dark text-base -mb-1">
            📅 Agendamento
          </h2>

          <div>
            <label className="label-base">Data preferida *</label>
            <input
              type="date"
              className="input-base"
              min={minDate()}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
            />
          </div>

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

        {/* Seguro contra danos */}
        <div className="flex items-start gap-2.5 bg-brand-light border border-brand-border rounded-xl px-4 py-3">
          <span className="text-lg flex-shrink-0">🛡️</span>
          <p className="text-xs text-brand-dark leading-snug">
            <strong>Seguro contra danos incluso.</strong> Se houver qualquer problema durante a limpeza
            (telhado, placas, equipamentos), você está coberto.
          </p>
        </div>

        {disponibilidade && !disponibilidade.disponivel ? (
          <div className="space-y-2">
            <button
              type="button"
              disabled
              className="w-full py-3.5 rounded-2xl bg-gray-200 text-gray-400 font-heading font-bold text-sm cursor-not-allowed"
            >
              🚫 Sem técnicos disponíveis na sua região
            </button>
            <p className="text-xs text-center text-brand-muted">
              Deixe seu contato acima e avisamos quando tivermos cobertura.
            </p>
          </div>
        ) : (
          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={submitting}
            disabled={numPlacas > 200 || submitting}
          >
            {submitting ? "Criando solicitação…" : "🚀 Enviar solicitação e pagar via PIX"}
          </Button>
        )}
      </form>
    </div>
  );
}
