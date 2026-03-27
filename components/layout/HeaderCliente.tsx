"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, X, ChevronDown } from "lucide-react";
import Logo from "./Logo";

const navLinks = [
  { href: "/cliente", label: "Início" },
  { href: "/cliente/solicitar", label: "Solicitar limpeza" },
  { href: "/cliente/historico", label: "Histórico" },
];

interface HeaderClienteProps {
  userName?: string;
  notificationCount?: number;
}

export default function HeaderCliente({
  userName = "Usuário",
  notificationCount = 0,
}: HeaderClienteProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-brand-dark shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo inverted size="sm" />

          {/* Desktop nav */}
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
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button
              className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Notificações"
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green text-[10px] font-bold text-white">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-brand-green flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {initials}
                </div>
                <span className="hidden sm:block text-white/90 text-sm font-medium max-w-[120px] truncate">
                  {userName}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-white/60 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card-hover border border-brand-border z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-brand-border">
                      <p className="text-xs text-brand-muted">Logado como</p>
                      <p className="text-sm font-semibold text-brand-dark truncate">
                        {userName}
                      </p>
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
                      <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        Sair
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-brand-dark">
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
                      : "text-white/80 hover:text-white hover:bg-white/10"
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
