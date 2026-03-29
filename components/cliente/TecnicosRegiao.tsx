"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

// ── Types ─────────────────────────────────────────────────────────────────

interface TecnicoCard {
  id: string;
  firstName: string;
  rating: number;
  services: number;
  online: boolean;
  cidade: string;
}

// ── Mock data (usado como fallback) ───────────────────────────────────────

const MOCK: TecnicoCard[] = [
  { id: "m1", firstName: "Carlos",   rating: 4.9, services: 23, online: true,  cidade: "Jaraguá do Sul" },
  { id: "m2", firstName: "Ana",      rating: 4.8, services: 18, online: true,  cidade: "Jaraguá do Sul" },
  { id: "m3", firstName: "Pedro",    rating: 4.7, services: 12, online: false, cidade: "Jaraguá do Sul" },
  { id: "m4", firstName: "Marcos",   rating: 4.9, services: 25, online: true,  cidade: "Pomerode"       },
  { id: "m5", firstName: "Julia",    rating: 5.0, services:  8, online: false, cidade: "Pomerode"       },
  { id: "m6", firstName: "Roberto",  rating: 4.8, services: 20, online: true,  cidade: "Florianópolis"  },
  { id: "m7", firstName: "Fernanda", rating: 4.9, services: 15, online: true,  cidade: "Florianópolis"  },
  { id: "m8", firstName: "Lucas",    rating: 4.7, services: 10, online: false, cidade: "Florianópolis"  },
];

const PILOT_CITIES = ["Jaraguá do Sul", "Pomerode", "Florianópolis"];

// Distâncias entre cidades piloto (km)
const NEARBY: Record<string, { cidade: string; km: number }> = {
  "jaragua do sul": { cidade: "Pomerode", km: 25 },
  "pomerode":       { cidade: "Jaraguá do Sul", km: 25 },
  "florianopolis":  { cidade: "Jaraguá do Sul", km: 180 },
};

// ── Helpers ───────────────────────────────────────────────────────────────

function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function pilotMatch(cidade: string): string | null {
  const n = norm(cidade);
  if (n.includes("jaragua") || n.includes("jaraguá")) return "Jaraguá do Sul";
  if (n.includes("pomerode")) return "Pomerode";
  if (n.includes("florianop")) return "Florianópolis";
  return null;
}

// Enriquecimento determinístico com mock (rating, serviços, online) baseado no id
function enrich(id: string): Pick<TecnicoCard, "rating" | "services" | "online"> {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return {
    rating:   parseFloat((4.5 + (Math.abs(h % 6) * 0.1)).toFixed(1)),
    services: 5 + Math.abs((h >> 4) % 21),
    online:   Math.abs((h >> 8) % 10) < 6,
  };
}

function tempoAceite(cidade: string): string {
  const n = norm(cidade);
  if (n.includes("florianop")) return "~10 min";
  if (n.includes("jaragua"))   return "~15 min";
  if (n.includes("pomerode"))  return "~20 min";
  return "~25 min";
}

function calcPreco(n: number): string {
  if (!n || n <= 0) return "—";
  if (n <= 10) return "R$ 180";
  if (n <= 30) return "R$ 300";
  if (n <= 60) return "R$ 520";
  return "Sob consulta";
}

// ── Skeleton shimmer ──────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="h-12 w-12 rounded-full bg-brand-light flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-brand-light rounded-full w-28" />
            <div className="h-3 bg-brand-light rounded-full w-40" />
          </div>
          <div className="h-3 bg-brand-light rounded-full w-14" />
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

interface Props {
  cidade: string;
  modulos: number;
}

export default function TecnicosRegiao({ cidade, modulos }: Props) {
  const [tecnicos, setTecnicos]     = useState<TecnicoCard[]>([]);
  const [loading, setLoading]       = useState(false);
  const [visible, setVisible]       = useState(false);
  const [expanded, setExpanded]     = useState(false);
  const [nearbyInfo, setNearbyInfo] = useState<{ cidade: string; km: number | null } | null>(null);
  const [noTecnicos, setNoTecnicos] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (cidade.trim().length < 3) {
      setTecnicos([]);
      setVisible(false);
      setNearbyInfo(null);
      setNoTecnicos(false);
      return;
    }

    setLoading(true);
    setVisible(false);
    setExpanded(false);

    timerRef.current = setTimeout(async () => {
      setNearbyInfo(null);
      setNoTecnicos(false);

      try {
        const supabase = createClient();

        // 1) Busca técnicos na cidade exata
        const { data: exact } = await supabase
          .from("profiles")
          .select("id, full_name, city")
          .eq("role", "tecnico")
          .ilike("city", `%${cidade.trim()}%`)
          .limit(10);

        if (exact && exact.length > 0) {
          const cards: TecnicoCard[] = exact
            .map((p) => ({
              id: p.id,
              firstName: (p.full_name as string)?.split(" ")[0] ?? "Técnico",
              cidade: (p.city as string) ?? cidade,
              ...enrich(p.id as string),
            }))
            .sort((a, b) => +b.online - +a.online || b.rating - a.rating);

          setTecnicos(cards);
          setLoading(false);
          setTimeout(() => setVisible(true), 40);
          return;
        }

        // 2) Fallback: cidade piloto mais próxima
        const matched = pilotMatch(cidade);
        if (matched) {
          setTecnicos(MOCK.filter((t) => t.cidade === matched));
          setLoading(false);
          setTimeout(() => setVisible(true), 40);
          return;
        }

        // 3) Tenta cidades próximas de piloto
        const nearbyEntry = NEARBY[norm(cidade)];
        if (nearbyEntry) {
          setNearbyInfo(nearbyEntry);
          setTecnicos(MOCK.filter((t) => t.cidade === nearbyEntry.cidade).slice(0, 3));
          setLoading(false);
          setTimeout(() => setVisible(true), 40);
          return;
        }

        // 4) Busca qualquer técnico nas cidades piloto no Supabase
        const { data: pilot } = await supabase
          .from("profiles")
          .select("id, full_name, city")
          .eq("role", "tecnico")
          .in("city", PILOT_CITIES)
          .limit(6);

        if (pilot && pilot.length > 0) {
          const nearest = PILOT_CITIES[0];
          setNearbyInfo({ cidade: nearest, km: null });
          setTecnicos(
            pilot.map((p) => ({
              id: p.id as string,
              firstName: (p.full_name as string)?.split(" ")[0] ?? "Técnico",
              cidade: (p.city as string) ?? nearest,
              ...enrich(p.id as string),
            }))
          );
          setLoading(false);
          setTimeout(() => setVisible(true), 40);
          return;
        }

        // 5) Fallback total: sem técnicos na região
        setNoTecnicos(true);
        setTecnicos([]);
      } catch {
        // Erro de conexão: usa mock da cidade piloto mais próxima
        const matched = pilotMatch(cidade);
        const city = matched ?? "Jaraguá do Sul";
        if (!matched) setNearbyInfo({ cidade: city, km: null });
        setTecnicos(MOCK.filter((t) => t.cidade === city));
      }

      setLoading(false);
      setTimeout(() => setVisible(true), 40);
    }, 420);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [cidade]);

  // Não renderiza nada se cidade ainda não preenchida
  if (cidade.trim().length < 3) return null;

  const shown = expanded ? tecnicos : tecnicos.slice(0, 3);
  const tempo = tempoAceite(cidade);
  const preco = calcPreco(modulos);
  const dispHoje = tecnicos.some((t) => t.online);

  return (
    <div
      className="transition-all duration-500 ease-out"
      style={{
        opacity: visible && !loading ? 1 : 0,
        transform: visible && !loading ? "translateY(0)" : "translateY(8px)",
      }}
    >
      <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-card">

        {/* ── Header ── */}
        <div className="bg-brand-light px-5 py-4 border-b border-brand-border flex items-center justify-between gap-3">
          <h3 className="font-heading font-bold text-brand-dark text-base">
            🧑‍🔧 Técnicos na sua região
          </h3>
          {!loading && !noTecnicos && tecnicos.length > 0 && (
            <span className="flex-shrink-0 text-xs font-semibold text-brand-green bg-brand-green/10 px-2.5 py-1 rounded-full">
              {tecnicos.length} disponível{tecnicos.length > 1 ? "s" : ""}
              {nearbyInfo ? ` em ${nearbyInfo.cidade}` : ""}
            </span>
          )}
        </div>

        {/* ── Nearby notice ── */}
        {nearbyInfo && !loading && (
          <div className="px-5 py-2.5 bg-yellow-50 border-b border-yellow-100 text-xs text-yellow-800">
            Não encontramos técnicos em <strong>"{cidade}"</strong>. Mostrando de{" "}
            <strong>{nearbyInfo.cidade}</strong>
            {nearbyInfo.km ? ` (${nearbyInfo.km} km)` : ""}.
          </div>
        )}

        <div className="p-5 space-y-4">

          {/* ── Loading skeleton ── */}
          {loading && <Skeleton />}

          {/* ── Empty state ── */}
          {!loading && noTecnicos && (
            <div className="text-center py-6 space-y-2">
              <p className="text-3xl">🗺️</p>
              <p className="font-heading font-semibold text-brand-dark text-sm">
                Ainda não temos técnicos nessa região
              </p>
              <p className="text-brand-muted text-xs max-w-xs mx-auto leading-relaxed">
                Seu pedido ficará aberto para técnicos de cidades próximas assim que for enviado.
              </p>
            </div>
          )}

          {/* ── Technician cards ── */}
          {!loading && tecnicos.length > 0 && (
            <>
              <div className="space-y-2">
                {shown.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 bg-white border border-brand-border p-3 shadow-sm"
                    style={{ borderRadius: "12px" }}
                  >
                    {/* Avatar + online dot */}
                    <div className="relative flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-brand-light border border-brand-border flex items-center justify-center text-xl select-none">
                        👤
                      </div>
                      <span
                        className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white"
                        style={{ backgroundColor: t.online ? "#3DC45A" : "#ccc" }}
                      />
                    </div>

                    {/* Name + badge + stats */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-semibold text-brand-dark text-sm">{t.firstName}</p>
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white leading-none"
                          style={{ backgroundColor: "#3DC45A" }}
                        >
                          Certificado Painel Clean ✅
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-brand-muted">
                        <span>⭐ {t.rating.toFixed(1)}</span>
                        <span className="text-brand-border">·</span>
                        <span>🔧 {t.services} serviços</span>
                      </div>
                    </div>

                    {/* Online status */}
                    <p
                      className="text-xs font-semibold flex-shrink-0"
                      style={{ color: t.online ? "#3DC45A" : "#bbb" }}
                    >
                      ● {t.online ? "Online" : "Offline"}
                    </p>
                  </div>
                ))}
              </div>

              {tecnicos.length > 3 && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="w-full text-xs font-semibold text-brand-green hover:text-brand-green/80 transition-colors py-1"
                >
                  {expanded
                    ? "▲ Ver menos"
                    : `▼ Ver mais ${tecnicos.length - 3} técnico${tecnicos.length - 3 > 1 ? "s" : ""}`}
                </button>
              )}
            </>
          )}

          {/* ── Quick indicators ── */}
          {!loading && (
            <div
              className="grid grid-cols-3 gap-2 text-center"
              style={{ backgroundColor: "#F4F8F2", borderRadius: "12px", padding: "12px" }}
            >
              <div>
                <p className="text-lg leading-none mb-1">⏱️</p>
                <p className="font-heading font-bold text-brand-dark text-sm">{tempo}</p>
                <p className="text-[10px] text-brand-muted mt-0.5">aceite médio</p>
              </div>
              <div>
                <p className="text-lg leading-none mb-1">💰</p>
                <p className="font-heading font-bold text-brand-dark text-sm">{modulos > 0 ? preco : "—"}</p>
                <p className="text-[10px] text-brand-muted mt-0.5">estimativa</p>
              </div>
              <div>
                <p className="text-lg leading-none mb-1">📅</p>
                <p className="font-heading font-bold text-brand-dark text-sm">
                  {noTecnicos ? "Em breve" : dispHoje ? "Hoje" : "Próximos dias"}
                </p>
                <p className="text-[10px] text-brand-muted mt-0.5">disponível</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
