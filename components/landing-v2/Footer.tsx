import Link from "next/link";

const navLinks = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Planos",        href: "#planos" },
  { label: "Depoimentos",   href: "#depoimentos" },
  { label: "Cobertura",     href: "#cobertura" },
  { label: "Técnicos",      href: "/cadastro" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#111D17", color: "rgba(255,255,255,0.55)", padding: "48px 0 32px" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top row */}
        <div className="flex flex-col md:flex-row gap-10 justify-between mb-10">

          {/* Brand */}
          <div className="flex flex-col gap-4" style={{ maxWidth: 280 }}>
            <Link href="/v2" className="flex items-center gap-2 w-fit">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-heading font-extrabold text-sm"
                style={{ background: "#3DC45A", color: "#1B3A2D" }}
              >
                P
              </div>
              <span className="font-heading font-extrabold text-white" style={{ fontSize: "16px", letterSpacing: "-0.02em" }}>
                Painel Clean
              </span>
            </Link>
            <p style={{ fontSize: "13px", lineHeight: 1.6 }}>
              Assinatura de limpeza e monitoramento de painéis solares em Santa Catarina.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-1">
              {/* Instagram */}
              <a
                href="https://instagram.com/painelclean"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:opacity-100 transition-opacity"
                style={{ opacity: 0.55 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com/company/painelclean"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:opacity-100 transition-opacity"
                style={{ opacity: 0.55 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a
                href="https://wa.me/5547997175878"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="hover:opacity-100 transition-opacity"
                style={{ opacity: 0.55 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-2">
            <p className="font-heading font-bold text-white text-sm mb-2">Navegação</p>
            {navLinks.map(({ label, href }) => (
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

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <p className="font-heading font-bold text-white text-sm mb-2">Contato</p>
            <p style={{ fontSize: "13px" }}>+55 47 99717-5878</p>
            <p style={{ fontSize: "13px" }}>contato@painelclean.com.br</p>
            <p style={{ fontSize: "13px", lineHeight: 1.5 }}>
              Rua Cesare Valentini, 265<br />
              Jaraguá do Sul – SC
            </p>
          </div>

        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px" }}>
          <div className="flex flex-col sm:flex-row gap-2 justify-between items-center text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            <p>© {new Date().getFullYear()} Painel Clean. Todos os direitos reservados.</p>
            <p>CNPJ 32.852.325/0001-99</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
