'use client';

import { useEffect, useState } from 'react';
import { Button, COLORS, LogoLockup } from './shared';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 8);
    const r = () => setIsMobile(window.innerWidth < 960);
    window.addEventListener('scroll', s, { passive: true });
    window.addEventListener('resize', r);
    s();
    r();
    return () => {
      window.removeEventListener('scroll', s);
      window.removeEventListener('resize', r);
    };
  }, []);

  const navItems = [
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Planos', href: '#planos' },
    { label: 'Cobertura', href: '#cobertura' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(244,248,242,0.94)' : COLORS.bg,
        backdropFilter: scrolled ? 'saturate(140%) blur(10px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(140%) blur(10px)' : 'none',
        borderBottom: scrolled ? `1px solid ${COLORS.border}` : '1px solid transparent',
        transition: 'all .2s ease',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: isMobile ? '14px 20px' : '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        <a href="#top" style={{ textDecoration: 'none' }}>
          <LogoLockup showTagline={!isMobile} />
        </a>

        {!isMobile && (
          <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {navItems.map((n) => (
              <a
                key={n.href}
                href={n.href}
                style={{
                  fontFamily: "'Open Sans',sans-serif",
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: COLORS.dark,
                  textDecoration: 'none',
                  padding: '6px 0',
                  transition: 'color .15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.green)}
                onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.dark)}
              >
                {n.label}
              </a>
            ))}
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {!isMobile && (
            <Button variant="ghost" size="md">
              Entrar
            </Button>
          )}
          <Button variant="primary" size={isMobile ? 'sm' : 'md'}>
            Assinar →
          </Button>
          {isMobile && (
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Abrir menu"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                border: `1px solid ${COLORS.border}`,
                background: 'white',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'grid', gap: 4 }}>
                <span
                  style={{
                    width: 18,
                    height: 2,
                    background: COLORS.dark,
                    borderRadius: 2,
                    transition: 'transform .2s',
                    transform: mobileOpen ? 'translateY(6px) rotate(45deg)' : 'none',
                  }}
                />
                <span
                  style={{
                    width: 18,
                    height: 2,
                    background: COLORS.dark,
                    borderRadius: 2,
                    opacity: mobileOpen ? 0 : 1,
                    transition: 'opacity .15s',
                  }}
                />
                <span
                  style={{
                    width: 18,
                    height: 2,
                    background: COLORS.dark,
                    borderRadius: 2,
                    transition: 'transform .2s',
                    transform: mobileOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
                  }}
                />
              </div>
            </button>
          )}
        </div>
      </div>

      {isMobile && mobileOpen && (
        <div
          style={{
            borderTop: `1px solid ${COLORS.border}`,
            background: COLORS.bg,
            padding: '12px 20px 20px',
            display: 'grid',
            gap: 4,
            animation: 'pc-fade .18s ease',
          }}
        >
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: '12px 8px',
                fontFamily: "'Open Sans',sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: COLORS.dark,
                textDecoration: 'none',
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              {n.label}
            </a>
          ))}
          <a
            href="#"
            onClick={() => setMobileOpen(false)}
            style={{
              padding: '14px 8px 4px',
              fontFamily: "'Open Sans',sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: COLORS.dark,
              textDecoration: 'none',
            }}
          >
            Entrar →
          </a>
        </div>
      )}
    </header>
  );
}
