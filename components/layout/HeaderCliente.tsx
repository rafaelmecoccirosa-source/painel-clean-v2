"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, X, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/cliente", label: "Início" },
  { href: "/cliente/solicitar", label: "Solicitar limpeza" },
  { href: "/cliente/historico", label: "Histórico" },
];

const NOTIFICACOES = [
  { id: 1, texto: "Técnico Carlos aceitou seu chamado",         tempo: "há 10 min",  lida: false },
  { id: 2, texto: "Serviço concluído em Jaraguá do Sul",        tempo: "há 2 horas", lida: false },
  { id: 3, texto: "Avalie o técnico do último serviço",         tempo: "ontem",      lida: true  },
];

interface HeaderClienteProps {
  userName?: string;
  notificationCount?: number;
}

export default function HeaderCliente({
  userName = "Usuário",
  notificationCount = 0,
}: HeaderClienteProps) {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [bellOpen, setBellOpen]       = useState(false);
  const pathname = usePathname();
  const router   = useRouter();

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 bg-brand-light border-b border-brand-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="sm" />

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/cliente"
                  ? pathname === "/cliente"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-green text-white"
                      : "text-brand-dark/70 hover:text-brand-dark hover:bg-brand-dark/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Bell */}
            <div className="relative">
              <button
                onClick={() => { setBellOpen(!bellOpen); setProfileOpen(false); }}
                className="relative p-2 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/5 rounded-lg transition-colors"
                aria-label="Notificações"
              >
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green text-[10px] font-bold text-white">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </button>

              {bellOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setBellOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-card-hover border border-brand-border z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-brand-border">
                      <p className="text-xs font-bold text-brand-dark uppercase tracking-wide">Notificações</p>
                    </div>
                    <div className="divide-y divide-brand-border">
                      {NOTIFICACOES.map((n) => (
                        <div key={n.id} className={`px-4 py-3 flex gap-3 ${n.lida ? "opacity-60" : ""}`}>
                          <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${n.lida ? "bg-brand-border" : "bg-brand-green"}`} />
                          <div>
                            <p className="text-sm text-brand-dark leading-snug">{n.texto}</p>
                            <p className="text-[10px] text-brand-muted mt-0.5">{n.tempo}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setBellOpen(false); }}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-brand-dark/5 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-brand-green flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {initials}
                </div>
                <span className="hidden sm:block text-brand-dark text-sm font-medium max-w-[120px] truncate">
                  {userName}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-brand-dark/50 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card-hover border border-brand-border z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-brand-border">
                      <p className="text-xs text-brand-muted">Logado como</p>
                      <p className="text-sm font-semibold text-brand-dark truncate">{userName}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/cliente/perfil"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-brand-dark hover:bg-brand-bg transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        Meu perfil
                      </Link>
                      <Link
                        href="/cliente/configuracoes"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-brand-dark hover:bg-brand-bg transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        Configurações
                      </Link>
                    </div>
                    <div className="border-t border-brand-border py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              className="md:hidden p-2 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/5 rounded-lg transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-brand-border bg-brand-light">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/cliente"
                  ? pathname === "/cliente"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-green text-white"
                      : "text-brand-dark/70 hover:text-brand-dark hover:bg-brand-dark/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
