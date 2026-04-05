import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DisponibilidadeToggle from "@/components/tecnico/DisponibilidadeToggle";
import GanhosChart from "@/components/tecnico/GanhosChart";
import { MOCK_TECNICO } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { SUBSCRIPTION_ENABLED } from "@/lib/config";

export const metadata: Metadata = { title: "Dashboard — Técnico | Painel Clean" };

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short",
  });
}

type ChamadoAberto = {
  id: string;
  cidade: string;
  address: string;
  placas: number;
  valorServico: number;
  repasse: number;
  dataFormatada: string;
  hora: string;
};

export default async function TecnicoDashboardPage() {
  let userName = "Técnico";
  let hasLocation = false;
  let chamadosAbertos: ChamadoAberto[] = [];

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      userName = user.email?.split("@")[0] ?? "Técnico";
      const admin = createServiceClient();

      // 1. Profile (nome, localização, cidade)
      const { data: profile } = await admin
        .from("profiles")
        .select("full_name, lat, city")
        .eq("user_id", user.id)
        .single();

      if (profile?.full_name) userName = profile.full_name.split(" ")[0];
      hasLocation = profile?.lat != null;

      // 2. Chamados em aberto na cidade do técnico
      const city = profile?.city;
      if (city) {
        const { data } = await admin
          .from("service_requests")
          .select("id, city, address, module_count, panel_count, price_estimate, preferred_date, preferred_time")
          .eq("status", "pending")
          .eq("payment_status", "confirmed")
          .is("technician_id", null)
          .eq("city", city)
          .order("preferred_date", { ascending: true })
          .limit(3);

        chamadosAbertos = (data ?? []).map((c) => ({
          id:           c.id,
          cidade:       c.city ?? city,
          address:      c.address ?? "",
          placas:       c.module_count ?? c.panel_count ?? 0,
          valorServico: c.price_estimate,
          repasse:      Math.round(c.price_estimate * 0.75),
          dataFormatada: fmtDate(c.preferred_date),
          hora:         c.preferred_time,
        }));
      }
    }
  } catch { /* fallback — keep empty */ }

  const mesAtual = new Date().toLocaleString("pt-BR", { month: "long" });
  const mesCapitalized = mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1);
  const anoAtual = new Date().getFullYear();

  const resumo = [
    {
      emoji: "💰",
      label: "Ganhos do mês",
      value: fmt(MOCK_TECNICO.ganhosMes),
      trend: `+${MOCK_TECNICO.tendencia.ganhos}%`,
      up: true,
      sub: "vs mês anterior",
    },
    {
      emoji: "📋",
      label: "Serviços realizados",
      value: String(MOCK_TECNICO.servicosMes),
      trend: `+${MOCK_TECNICO.tendencia.servicos}`,
      up: true,
      sub: "vs mês anterior",
    },
    {
      emoji: "⭐",
      label: "Avaliação média",
      value: MOCK_TECNICO.avaliacaoMedia.toFixed(1),
      trend: null,
      up: true,
      sub: "últimos 30 dias",
    },
    {
      emoji: "⏱️",
      label: "Tempo médio",
      value: `${MOCK_TECNICO.tempoMedio}h`,
      trend: null,
      up: true,
      sub: "por serviço",
    },
  ];

  const { performance, ultimosServicos: historico } = MOCK_TECNICO;

  return (
    <div className="page-container space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-dark">
            Olá, {userName}! 👋
          </h1>
          <p className="text-brand-muted text-sm mt-0.5">{mesCapitalized} {anoAtual} · veja seus números</p>
        </div>
        <DisponibilidadeToggle cidade="Jaraguá do Sul, SC" />
      </div>

      {/* ── Banner sem mensalidade (MVP) ── */}
      {!SUBSCRIPTION_ENABLED && (
        <div className="flex items-start gap-3 bg-brand-light border border-brand-border rounded-2xl px-4 py-3.5">
          <span className="text-2xl flex-shrink-0">💰</span>
          <div>
            <p className="text-sm font-bold text-brand-dark">
              ✅ Sem mensalidade — apenas 25% de comissão por serviço realizado
            </p>
            <p className="text-xs text-brand-muted mt-0.5">
              Exemplo: num serviço de R$ 600, você recebe R$ 450 via PIX automático.
            </p>
          </div>
        </div>
      )}

      {/* ── Banner seguro contra danos ── */}
      <div className="flex items-start gap-3 bg-white border border-brand-border rounded-2xl px-4 py-3.5">
        <span className="text-2xl flex-shrink-0">🛡️</span>
        <div>
          <p className="text-sm font-bold text-brand-dark">
            Seguro contra danos — todos os serviços
          </p>
          <p className="text-xs text-brand-muted mt-0.5">
            Todos os serviços realizados pela plataforma incluem cobertura contra danos acidentais durante a limpeza. Trabalhe com tranquilidade.
          </p>
        </div>
      </div>

      {/* ── Seção 1: KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {resumo.map(({ emoji, label, value, trend, up, sub }) => (
          <div
            key={label}
            className="bg-white border border-brand-border rounded-2xl p-4 flex flex-col gap-2 shadow-sm"
          >
            <span className="text-2xl leading-none">{emoji}</span>
            <div className="mt-1">
              <p className="font-heading text-[22px] font-bold text-brand-dark leading-tight">
                {value}
              </p>
              <p className="text-xs text-brand-muted mt-0.5">{label}</p>
            </div>
            {trend ? (
              <div className="flex items-center gap-1">
                <span className={`text-[11px] font-bold flex items-center gap-0.5 ${up ? "text-emerald-600" : "text-red-500"}`}>
                  {up ? "↑" : "↓"} {trend}
                </span>
                <span className="text-[10px] text-brand-muted">{sub}</span>
              </div>
            ) : (
              <p className="text-[10px] text-brand-muted">{sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* ── Seção 2: Chamados em aberto (dados reais) ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-brand-dark text-base">
            🔔 Chamados disponíveis
          </h2>
          <Link
            href="/tecnico/chamados"
            className="text-xs text-brand-green font-semibold hover:underline flex items-center gap-1"
          >
            Ver todos <ArrowRight size={12} />
          </Link>
        </div>

        {chamadosAbertos.length === 0 ? (
          <div className="card flex flex-col items-center py-10 text-center gap-3">
            <span className="text-4xl">📭</span>
            <p className="font-heading font-bold text-brand-dark text-sm">Nenhum chamado disponível</p>
            <p className="text-xs text-brand-muted max-w-xs">
              Fique online para receber novos chamados na sua região!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {chamadosAbertos.map((c) => (
              <div
                key={c.id}
                className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1 space-y-2">
                  <span className="font-heading font-bold text-brand-dark text-sm">
                    📍 {c.cidade}
                  </span>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-muted">
                    <span>📅 {c.dataFormatada} · {c.hora}</span>
                    <span>🔋 {c.placas} placas</span>
                    <span>
                      💰 {fmt(c.valorServico)}{" "}
                      <span className="text-brand-green font-semibold">
                        (repasse: {fmt(c.repasse)})
                      </span>
                    </span>
                  </div>
                </div>
                <Link
                  href={`/tecnico/chamados/${c.id}`}
                  className="flex-shrink-0 text-xs font-semibold text-brand-dark border border-brand-border rounded-xl px-4 py-2 hover:bg-brand-light transition-colors flex items-center gap-1"
                >
                  Ver detalhes <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Banner: completar perfil com CEP ── */}
      {!hasLocation && (
        <div className="bg-brand-light border border-brand-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-brand-dark">Complete seu perfil</p>
            <p className="text-xs text-brand-muted mt-0.5">
              Informe seu CEP para aparecer no mapa de cobertura
            </p>
          </div>
          <a href="/tecnico/perfil" className="text-sm font-medium text-brand-dark underline whitespace-nowrap">
            Adicionar CEP →
          </a>
        </div>
      )}

      {/* ── Seção 3: Ranking + Fluxo de clientes ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-brand-dark rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-heading font-bold text-white text-sm">Seu ranking</p>
                <p className="text-white/50 text-xs">Jaraguá do Sul</p>
              </div>
            </div>
            <span className="font-heading font-extrabold text-brand-green text-2xl">#2</span>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/60">Posição atual</span>
              <span className="text-brand-green font-semibold">Top 3 → mais chamados</span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-brand-green rounded-full" style={{ width: "72%" }} />
            </div>
            <p className="text-white/40 text-[10px] mt-1.5">
              Faltam 3 serviços para o #1 · Top 3 recebem prioridade nos chamados
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { pos: "#1", nome: "Carlos M.", pts: "48 serv.", destaque: false },
              { pos: "#2", nome: userName,    pts: "45 serv.", destaque: true  },
              { pos: "#3", nome: "Luiz O.",   pts: "38 serv.", destaque: false },
            ].map(({ pos, nome, pts, destaque }) => (
              <div
                key={pos}
                className={`rounded-xl p-2.5 text-center border ${
                  destaque ? "bg-brand-green/20 border-brand-green/40" : "bg-white/5 border-white/10"
                }`}
              >
                <p className={`text-xs font-bold ${destaque ? "text-brand-green" : "text-white/60"}`}>{pos}</p>
                <p className="text-white text-[11px] font-semibold truncate mt-0.5">{nome}</p>
                <p className="text-white/40 text-[10px]">{pts}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📈</span>
            <div>
              <p className="font-heading font-bold text-brand-dark text-sm">Chamados pela plataforma</p>
              <p className="text-brand-muted text-xs">{mesCapitalized} {anoAtual}</p>
            </div>
          </div>
          <div>
            <p className="font-heading font-extrabold text-brand-dark text-3xl">
              {MOCK_TECNICO.servicosMes}
              <span className="text-brand-muted text-base font-normal ml-1">chamados</span>
            </p>
            <p className="text-xs text-brand-muted mt-1">
              Técnicos ativos recebem em média{" "}
              <span className="font-semibold text-brand-dark">15 chamados/mês</span>
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-brand-muted">Meta mensal</span>
              <span className="font-semibold text-brand-dark">
                {MOCK_TECNICO.servicosMes}/15 ({Math.round((MOCK_TECNICO.servicosMes / 15) * 100)}%)
              </span>
            </div>
            <div className="h-2 bg-brand-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-green rounded-full"
                style={{ width: `${Math.min(100, Math.round((MOCK_TECNICO.servicosMes / 15) * 100))}%` }}
              />
            </div>
          </div>
          <div className="bg-brand-light rounded-xl px-3 py-2.5">
            <p className="text-xs font-medium text-brand-dark">
              💡 Fique online o máximo possível para receber mais chamados automaticamente
            </p>
          </div>
        </div>
      </div>

      {/* ── Seção 4: Gráfico de ganhos ── */}
      <GanhosChart />

      {/* ── Seção 5: Desempenho ── */}
      <div className="card">
        <h2 className="font-heading font-bold text-brand-dark text-base mb-5">
          🎯 Desempenho — métricas vs meta
        </h2>
        <div className="space-y-4">
          {performance.map(({ label, pct, meta }) => {
            const aboveMeta = pct >= meta;
            return (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-brand-dark">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${aboveMeta ? "text-emerald-600" : "text-amber-500"}`}>
                      {pct}%
                    </span>
                    <span className="text-[10px] text-brand-muted">meta {meta}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-brand-light rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${aboveMeta ? "bg-brand-green" : "bg-amber-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-brand-muted mt-4">
          ✅ Acima da meta &nbsp;|&nbsp; ⚠️ Abaixo da meta
        </p>
      </div>

      {/* ── Seção 6: Histórico rápido ── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-brand-dark text-base">
            🕘 Últimos serviços
          </h2>
          <Link
            href="/tecnico/ganhos"
            className="text-xs text-brand-green font-semibold hover:underline flex items-center gap-1"
          >
            Ver histórico completo <ArrowRight size={12} />
          </Link>
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left text-xs font-semibold text-brand-muted pb-2">Data</th>
                <th className="text-left text-xs font-semibold text-brand-muted pb-2">Cidade</th>
                <th className="text-right text-xs font-semibold text-brand-muted pb-2">Placas</th>
                <th className="text-right text-xs font-semibold text-brand-muted pb-2">Recebido</th>
                <th className="text-right text-xs font-semibold text-brand-muted pb-2">Nota</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((h, i) => (
                <tr key={i} className="border-b border-brand-border/50 last:border-0">
                  <td className="py-2.5 text-brand-dark font-medium">{h.data}</td>
                  <td className="py-2.5 text-brand-dark">{h.cidade}</td>
                  <td className="py-2.5 text-right text-brand-muted">{h.modulos}</td>
                  <td className="py-2.5 text-right font-bold text-brand-green">{fmt(h.recebido)}</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-amber-500">
                      ⭐ {h.nota.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden space-y-3">
          {historico.map((h, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2.5 border-b border-brand-border/50 last:border-0"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-brand-dark">{h.cidade}</p>
                <p className="text-[11px] text-brand-muted">{h.data} · {h.modulos} placas</p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="font-bold text-brand-green text-sm">{fmt(h.recebido)}</p>
                <p className="text-[11px] text-amber-500 font-semibold">⭐ {h.nota.toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
