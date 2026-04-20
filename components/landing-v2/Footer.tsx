"use client";

import Link from "next/link";

const product = [
  { label: "Como funciona",  href: "#como-funciona" },
  { label: "Planos",         href: "#planos" },
  { label: "Calculadora",    href: "#calculadora" },
  { label: "Limpeza avulsa", href: "/cadastro" },
  { label: "Para técnicos",  href: "#para-tecnicos" },
];

const empresa = [
  { label: "Sobre nós",    href: "/cadastro" },
  { label: "Depoimentos",  href: "#depoimentos" },
  { label: "Cobertura",    href: "#cobertura" },
  { label: "Blog",         href: "/cadastro" },
  { label: "Contato",      href: "/cadastro" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#111D17", color: "rgba(255,255,255,0.55)", padding: "64px 0 0" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/v2" className="flex items-center gap-2 w-fit">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-heading font-extrabold text-sm"
                style={{ background: "#3DC45A", color: "#1B3A2D" }}
              >
                P
              </div>
              <span
                className="font-heading font-extrabold text-white"
                style={{ fontSize: "16px", letterSpacing: "-0.02em" }}
              >
                Painel Clean
              </span>
            </Link>
            <p style={{ fontSize: "13px", lineHeight: 1.65, maxWidth: 220 }}>
              Assinatura mensal de limpeza e monitoramento para painéis solares.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-1">
              <a
                href="https://instagram.com/painelclean"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-opacity hover:opacity-100"
                style={{ opacity: 0.55 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/painel-clean"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="transition-opacity hover:opacity-100"
                style={{ opacity: 0.55 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://wa.me/5547997175878"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="transition-opacity hover:opacity-100"
                style={{ opacity: 0.55 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2 — Produto */}
          <div>
            <p className="font-heading font-bold text-white text-sm mb-4">Produto</p>
            <div className="flex flex-col gap-2.5">
              {product.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Col 3 — Empresa */}
          <div>
            <p className="font-heading font-bold text-white text-sm mb-4">Empresa</p>
            <div className="flex flex-col gap-2.5">
              {empresa.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Col 4 — Contato */}
          <div>
            <p className="font-heading font-bold text-white text-sm mb-4">Contato</p>
            <div className="flex flex-col gap-3" style={{ fontSize: "13px" }}>
              <a
                href="https://wa.me/5547997175878"
                className="hover:text-white transition-colors"
              >
                (47) 99717-5878
              </a>
              <a
                href="mailto:contato@painelclean.com.br"
                className="hover:text-white transition-colors"
              >
                contato@painelclean.com.br
              </a>
              <p style={{ lineHeight: 1.6 }}>
                Rua Cesare Valentini, 265, sala 17<br />
                Novale Ind — Jaraguá do Sul/SC<br />
                CEP 89254-193
              </p>
            </div>
          </div>

        </div>

        {/* Legal bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "20px 0" }}>
          <div
            className="flex flex-col sm:flex-row gap-3 justify-between items-center"
            style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}
          >
            <p>© 2026 Painel Clean · CNPJ 32.852.325/0001-99 · Jaraguá do Sul/SC</p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/termos" className="hover:text-white transition-colors">Termos de uso</Link>
              <Link href="/termos" className="hover:text-white transition-colors">Política de privacidade</Link>
              <Link href="/termos" className="hover:text-white transition-colors">LGPD</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
