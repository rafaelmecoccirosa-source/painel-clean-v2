"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MOCK_USUARIOS } from "@/lib/mock-data";

type Filtro = "todos" | "cliente" | "tecnico" | "admin";
const CIDADES = ["Todas", "Jaraguá do Sul", "Pomerode", "Florianópolis"];

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtData(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function initialsColor(nome: string) {
  const colors = [
    "bg-emerald-100 text-emerald-700",
    "bg-blue-100 text-blue-700",
    "bg-violet-100 text-violet-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];
  return colors[nome.charCodeAt(0) % colors.length];
}

function initials(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function TipoBadge({ tipo }: { tipo: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    cliente: { label: "Cliente", cls: "bg-blue-100 text-blue-700" },
    tecnico: { label: "Técnico", cls: "bg-emerald-100 text-emerald-700" },
    admin:   { label: "Admin",   cls: "bg-violet-100 text-violet-700" },
  };
  const s = map[tipo] ?? { label: tipo, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "ativo")
    return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Ativo</span>;
  if (status === "pendente")
    return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">Pendente</span>;
  return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600">Inativo</span>;
}

function AprovacaoBadge({ aprovacao }: { aprovacao?: string }) {
  if (aprovacao === "aprovado")
    return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">✅ Aprovado</span>;
  if (aprovacao === "pendente")
    return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">⏳ Pendente</span>;
  if (aprovacao === "recusado")
    return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600">❌ Recusado</span>;
  return null;
}

type Usuario = (typeof MOCK_USUARIOS)[number];

export default function UsuariosPage() {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busca, setBusca] = useState("");
  const [cidade, setCidade] = useState("Todas");
  const [expandido, setExpandido] = useState<number | null>(null);

  const inicioMes = new Date("2026-03-01");

  const filtered = useMemo(() => {
    return MOCK_USUARIOS.filter((u) => {
      if (filtro !== "todos" && u.tipo !== filtro) return false;
      if (cidade !== "Todas" && u.cidade !== cidade) return false;
      if (busca) {
        const b = busca.toLowerCase();
        if (!u.nome.toLowerCase().includes(b) && !u.email.toLowerCase().includes(b)) return false;
      }
      return true;
    });
  }, [filtro, busca, cidade]);

  const counters = {
    total: MOCK_USUARIOS.length,
    clientes: MOCK_USUARIOS.filter((u) => u.tipo === "cliente").length,
    tecnicos: MOCK_USUARIOS.filter((u) => u.tipo === "tecnico" && u.status === "ativo").length,
    novosMes: MOCK_USUARIOS.filter((u) => new Date(u.cadastro) >= inicioMes).length,
  };

  const tabs: { key: Filtro; label: string; emoji: string }[] = [
    { key: "todos",   label: "Todos",    emoji: "👥" },
    { key: "cliente", label: "Clientes", emoji: "👤" },
    { key: "tecnico", label: "Técnicos", emoji: "🔧" },
    { key: "admin",   label: "Admins",   emoji: "🛡️" },
  ];

  const isTecnicoView = filtro === "tecnico";

  function getTecnicoField<K extends keyof Usuario>(u: Usuario, key: K): Usuario[K] | undefined {
    return key in u ? (u as Usuario)[key] : undefined;
  }

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-brand-muted hover:text-brand-dark transition-colors" aria-label="Voltar">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-dark">👥 Usuários</h1>
          <p className="text-brand-muted text-sm mt-0.5">Clientes, técnicos e admins cadastrados na plataforma</p>
        </div>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { emoji: "👥", label: "Total de usuários", value: counters.total },
          { emoji: "👤", label: "Clientes",           value: counters.clientes },
          { emoji: "🔧", label: "Técnicos ativos",    value: counters.tecnicos },
          { emoji: "🌟", label: "Novos este mês",     value: counters.novosMes },
        ].map(({ emoji, label, value }) => (
          <div key={label} className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm">
            <span className="text-2xl">{emoji}</span>
            <p className="font-heading font-bold text-brand-dark text-2xl mt-2">{value}</p>
            <p className="text-xs text-brand-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card space-y-4">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFiltro(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filtro === t.key
                  ? "bg-brand-dark text-white"
                  : "bg-brand-bg text-brand-muted hover:text-brand-dark"
              }`}
            >
              <span>{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-brand-border text-sm text-brand-dark placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-green/30 bg-white"
          />
          <select
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-brand-border text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-green/30 bg-white min-w-[180px]"
          >
            {CIDADES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <p className="text-xs text-brand-muted">
          {filtered.length} usuário{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Table — desktop */}
      <div className="card !p-0 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-brand-bg">
              <tr>
                {(isTecnicoView
                  ? ["", "Nome", "Email", "Cidade", "Cadastro", "Status", "Aprovação", "Avaliação", "Serviços", "Ganhos/Mês", ""]
                  : ["", "Nome", "Email", "Tipo", "Cidade", "Cadastro", "Status", ""]
                ).map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 font-semibold text-brand-muted uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((u) => {
                const isNew = new Date(u.cadastro) >= inicioMes;
                const aprovacao = "aprovacao" in u ? (u as { aprovacao?: string }).aprovacao : undefined;
                const avaliacao = "avaliacao" in u ? (u as { avaliacao?: number }).avaliacao : undefined;
                const servicos  = "servicos"  in u ? (u as { servicos?: number }).servicos  : undefined;
                const ganhosMes = "ganhosMes" in u ? (u as { ganhosMes?: number }).ganhosMes : undefined;

                return (
                  <>
                    <tr
                      key={u.id}
                      className="hover:bg-brand-bg/50 transition-colors cursor-pointer"
                      onClick={() => setExpandido(expandido === u.id ? null : u.id)}
                    >
                      <td className="px-4 py-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${initialsColor(u.nome)}`}>
                          {initials(u.nome)}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-brand-dark whitespace-nowrap">
                        {u.nome}
                        {isNew && <span className="ml-1.5 text-[9px] bg-brand-light text-brand-green font-bold px-1.5 py-0.5 rounded-full">NOVO</span>}
                      </td>
                      <td className="px-4 py-3 text-brand-muted">{u.email}</td>
                      {!isTecnicoView && (
                        <td className="px-4 py-3"><TipoBadge tipo={u.tipo} /></td>
                      )}
                      <td className="px-4 py-3 text-brand-dark whitespace-nowrap">📍 {u.cidade}</td>
                      <td className="px-4 py-3 text-brand-muted whitespace-nowrap">{fmtData(u.cadastro)}</td>
                      <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                      {isTecnicoView && (
                        <>
                          <td className="px-4 py-3"><AprovacaoBadge aprovacao={aprovacao} /></td>
                          <td className="px-4 py-3 text-amber-500 font-bold">
                            {avaliacao ? `⭐ ${avaliacao.toFixed(1)}` : "—"}
                          </td>
                          <td className="px-4 py-3 text-center text-brand-dark font-medium">
                            {servicos ?? 0}
                          </td>
                          <td className="px-4 py-3 font-semibold text-brand-green">
                            {ganhosMes ? fmt(ganhosMes) : "—"}
                          </td>
                        </>
                      )}
                      <td className="px-4 py-3">
                        <button className="text-xs text-brand-green hover:underline font-semibold whitespace-nowrap">
                          {expandido === u.id ? "Fechar ↑" : "Ver detalhes →"}
                        </button>
                      </td>
                    </tr>
                    {expandido === u.id && u.tipo === "tecnico" && (
                      <tr key={`exp-${u.id}`} className="bg-brand-bg/30">
                        <td colSpan={isTecnicoView ? 11 : 8} className="px-6 py-4">
                          <div className="grid grid-cols-3 gap-4 text-xs">
                            <div className="bg-white rounded-xl p-4 border border-brand-border">
                              <p className="text-brand-muted font-semibold mb-1">Cidade de atuação</p>
                              <p className="text-brand-dark font-bold">📍 {u.cidade}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-brand-border">
                              <p className="text-brand-muted font-semibold mb-1">Avaliação</p>
                              <p className="text-amber-500 font-bold text-base">
                                {avaliacao ? `⭐ ${avaliacao.toFixed(1)}` : "Sem avaliações"}
                              </p>
                              <p className="text-brand-muted mt-0.5">{servicos ?? 0} serviços realizados</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-brand-border">
                              <p className="text-brand-muted font-semibold mb-1">Ganhos no mês</p>
                              <p className="text-brand-green font-bold text-base">
                                {ganhosMes ? fmt(ganhosMes) : "R$ 0,00"}
                              </p>
                              <p className="text-brand-muted mt-0.5">repasse 85%</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-12 text-brand-muted text-sm">Nenhum usuário encontrado.</p>
          )}
        </div>
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden space-y-3">
        {filtered.map((u) => {
          const isNew = new Date(u.cadastro) >= inicioMes;
          const aprovacao = "aprovacao" in u ? (u as { aprovacao?: string }).aprovacao : undefined;
          const avaliacao = "avaliacao" in u ? (u as { avaliacao?: number }).avaliacao : undefined;
          const servicos  = "servicos"  in u ? (u as { servicos?: number }).servicos  : undefined;
          const ganhosMes = "ganhosMes" in u ? (u as { ganhosMes?: number }).ganhosMes : undefined;

          return (
            <div key={u.id} className="card space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${initialsColor(u.nome)}`}>
                  {initials(u.nome)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-brand-dark text-sm">{u.nome}</p>
                    {isNew && <span className="text-[9px] bg-brand-light text-brand-green font-bold px-1.5 py-0.5 rounded-full">NOVO</span>}
                  </div>
                  <p className="text-xs text-brand-muted truncate">{u.email}</p>
                </div>
                <TipoBadge tipo={u.tipo} />
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-brand-muted">
                <span>📍 {u.cidade}</span>
                <span>·</span>
                <span>Cadastro: {fmtData(u.cadastro)}</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={u.status} />
                {aprovacao && <AprovacaoBadge aprovacao={aprovacao} />}
              </div>

              {u.tipo === "tecnico" && (
                <div className="flex gap-4 text-xs pt-1 border-t border-brand-border">
                  <span className="text-amber-500 font-bold">
                    {avaliacao ? `⭐ ${avaliacao.toFixed(1)}` : "Sem avaliação"}
                  </span>
                  <span className="text-brand-muted">{servicos ?? 0} serviços</span>
                  {ganhosMes ? (
                    <span className="text-brand-green font-semibold">{fmt(ganhosMes)}</span>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center py-12 text-brand-muted text-sm">Nenhum usuário encontrado.</p>
        )}
      </div>
    </div>
  );
}
