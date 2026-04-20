"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";

export default function Header() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "#calculadora", label: "Calculadora" },
    { href: "#como-funciona", label: "Como funciona" },
    { href: "#planos", label: "Planos" },
    { href: "#cobertura", label: "Cobertura" },
  ];

  return (
    <header
      className="sticky top-0 z-50 bg-white"
      style={{ borderBottom: "1px solid #C8DFC0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Logo size="sm" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <a
              key={label}
              href={href}
              className="text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <Link
            href="/login"
            className="text-sm font-semibold text-brand-dark px-5 py-2 rounded-xl transition-colors hover:bg-brand-light"
            style={{ border: "1px solid #C8DFC0" }}
          >
            Entrar
          </Link>
          <a
            href="#planos"
            className="text-sm font-bold text-brand-dark px-5 py-2 rounded-xl transition-colors hover:opacity-90"
            style={{ background: "#3DC45A" }}
          >
            Assinar →
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col items-center justify-center gap-1.5 w-9 h-9 flex-shrink-0"
        >
          <span
            className="block w-5 h-0.5 bg-brand-dark rounded-full"
            style={{ transition: "transform 200ms", transform: open ? "rotate(45deg) translateY(8px)" : "none" }}
          />
          <span
            className="block w-5 h-0.5 bg-brand-dark rounded-full"
            style={{ transition: "opacity 200ms", opacity: open ? 0 : 1 }}
          />
          <span
            className="block w-5 h-0.5 bg-brand-dark rounded-full"
            style={{ transition: "transform 200ms", transform: open ? "rotate(-45deg) translateY(-8px)" : "none" }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        style={{
          maxHeight: open ? "400px" : "0",
          overflow: "hidden",
          transition: "max-height 250ms ease-in-out",
        }}
        className="md:hidden bg-white"
      >
        <div className="px-4 pt-2 pb-5 border-t" style={{ borderColor: "#C8DFC0" }}>
          <nav className="flex flex-col gap-0.5 mb-4">
            {navLinks.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-brand-dark px-2 py-2.5 rounded-lg hover:bg-brand-light transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-brand-dark py-3 rounded-xl text-center transition-colors hover:bg-brand-light"
              style={{ border: "1px solid #C8DFC0" }}
            >
              Entrar
            </Link>
            <a
              href="#planos"
              onClick={() => setOpen(false)}
              className="text-sm font-bold text-brand-dark py-3 rounded-xl text-center transition-colors hover:opacity-90"
              style={{ background: "#3DC45A" }}
            >
              Assinar →
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
