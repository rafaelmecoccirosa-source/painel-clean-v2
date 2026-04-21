'use client';

/**
 * Cliente dashboard header — ported from the Claude Design handoff
 * (dashboards-painel-clean/project/components/Header.jsx) with these overrides:
 *   • tagline 12 px (handoff had 10)
 *   • active nav pill: white bg + dark text (handoff had green bg + white text)
 *   • avatar: solid COLORS.dark (handoff had green linear-gradient)
 *   • bell badge: red #DC2626 (handoff had green)
 *   • nav items without emojis
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { COLORS } from '@/lib/brand-tokens';
import { createClient } from '@/lib/supabase/client';
import { initialsOf } from '@/lib/mock-cliente';

type NavItem = { href: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { href: '/cliente/home',       label: 'Início'            },
  { href: '/cliente/relatorios', label: 'Relatórios'        },
  { href: '/cliente/historico',  label: 'Histórico'         },
  { href: '/cliente/avulsa',     label: 'Solicitar Limpeza' },
  { href: '/cliente/indicacoes', label: 'Indicações'        },
  { href: '/cliente/perfil',     label: 'Perfil'            },
];

const NOTIFICATIONS = [
  { emoji: '📅', title: 'Limpeza agendada para 03 jun',    meta: 'Confirmada pelo técnico Carlos S.', time: 'há 2h',  unread: true  },
  { emoji: '📊', title: 'Relatório de março disponível',   meta: 'Usina gerou 94% do esperado',       time: 'ontem',  unread: true  },
  { emoji: '💳', title: 'Cobrança de R$ 44,00 em 20 mai',  meta: 'Lembrete da assinatura mensal',     time: 'há 3d',  unread: true  },
  { emoji: '✅', title: 'Limpeza concluída em 12 mar',     meta: '+11% de ganho de geração',          time: 'há 2m',  unread: false },
];

export default function Header({
  userName = 'Cliente',
  plano = 'Padrão',
  notifCount = 3,
}: {
  userName?: string;
  plano?: string;
  notifCount?: number;
}) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: COLORS.light,
        borderBottom: `1px solid ${COLORS.border}`,
        boxShadow: '0 1px 2px rgba(27,58,45,.04)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 28px',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <LogoLockup />

        <nav style={{ display: 'flex', gap: 2 }}>
          {NAV_ITEMS.map((item) => (
            <NavPill key={item.href} item={item} />
          ))}
        </nav>

        <RightSide userName={userName} plano={plano} notifCount={notifCount} />
      </div>
    </header>
  );
}

// ─────────────────────────── Logo

function LogoLockup() {
  return (
    <Link
      href="/cliente/home"
      style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/landing-v2-logo-mark.jpg"
        alt="Painel Clean"
        style={{ width: 38, height: 38, borderRadius: 9, objectFit: 'cover' }}
      />
      <div style={{ lineHeight: 1 }}>
        <div
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 800,
            fontSize: 19,
            letterSpacing: '-.02em',
            color: COLORS.dark,
          }}
        >
          Painel <span style={{ color: COLORS.green }}>Clean</span>
        </div>
        <div
          style={{
            marginTop: 4,
            fontFamily: "'Open Sans',sans-serif",
            fontSize: 12,
            fontWeight: 500,
            color: COLORS.muted,
            letterSpacing: '.01em',
          }}
        >
          Limpeza e monitoramento solar
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────── Nav pill

function NavPill({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const [hover, setHover] = useState(false);
  const active = isActive(pathname, item.href);

  return (
    <Link
      href={item.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '9px 14px',
        borderRadius: 10,
        textDecoration: 'none',
        fontFamily: "'Open Sans',sans-serif",
        fontSize: 14,
        fontWeight: 600,
        color: active ? COLORS.dark : hover ? COLORS.dark : COLORS.muted,
        background: active ? 'white' : hover ? 'rgba(255,255,255,.55)' : 'transparent',
        boxShadow: active ? '0 1px 3px rgba(27,58,45,.08)' : 'none',
        transition: 'background .15s, color .15s',
      }}
    >
      {item.label}
    </Link>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/cliente/home') {
    return pathname === '/cliente' || pathname.startsWith('/cliente/home');
  }
  return pathname.startsWith(href);
}

// ─────────────────────────── Right side (bell + divider + avatar)

function RightSide({
  userName,
  plano,
  notifCount,
}: {
  userName: string;
  plano: string;
  notifCount: number;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const initials = initialsOf(userName);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div ref={notifRef} style={{ position: 'relative' }}>
        <button
          onClick={() => {
            setNotifOpen((v) => !v);
            setProfileOpen(false);
          }}
          aria-label="Notificações"
          style={{
            position: 'relative',
            background: notifOpen ? 'white' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: COLORS.dark,
            padding: 9,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background .15s',
          }}
        >
          <Bell size={19} />
          {notifCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                background: '#DC2626',
                color: 'white',
                fontFamily: "'Open Sans',sans-serif",
                fontSize: 9,
                fontWeight: 800,
                minWidth: 16,
                height: 16,
                padding: '0 4px',
                borderRadius: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 0 2px ${COLORS.light}`,
              }}
            >
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </button>
        {notifOpen && <NotifDropdown />}
      </div>

      <div
        ref={profileRef}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          paddingLeft: 10,
          marginLeft: 2,
          borderLeft: `1px solid ${COLORS.border}`,
        }}
      >
        <button
          onClick={() => {
            setProfileOpen((v) => !v);
            setNotifOpen(false);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9999,
              background: COLORS.dark,
              color: 'white',
              fontFamily: "'Montserrat',sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '.02em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(27,58,45,.15)',
            }}
          >
            {initials}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              lineHeight: 1.15,
            }}
          >
            <span
              style={{
                fontFamily: "'Open Sans',sans-serif",
                fontSize: 13,
                color: COLORS.dark,
                fontWeight: 600,
              }}
            >
              {userName}
            </span>
            <span
              style={{
                fontFamily: "'Open Sans',sans-serif",
                fontSize: 12,
                color: COLORS.muted,
                marginTop: 2,
              }}
            >
              Plano {plano}
            </span>
          </div>
        </button>

        {profileOpen && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              minWidth: 200,
              background: 'white',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              boxShadow: '0 12px 24px rgba(27,58,45,.15)',
              padding: 6,
              zIndex: 60,
            }}
          >
            <Link
              href="/cliente/perfil"
              onClick={() => setProfileOpen(false)}
              style={dropdownItemStyle}
            >
              Meu perfil
            </Link>
            <div style={{ height: 1, background: COLORS.border, margin: '6px 0' }} />
            <button
              onClick={handleLogout}
              style={{
                ...dropdownItemStyle,
                width: '100%',
                textAlign: 'left',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#B91C1C',
              }}
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const dropdownItemStyle: React.CSSProperties = {
  display: 'block',
  padding: '9px 12px',
  fontFamily: "'Open Sans',sans-serif",
  fontSize: 13,
  fontWeight: 500,
  color: COLORS.dark,
  borderRadius: 8,
  textDecoration: 'none',
};

// ─────────────────────────── Notifications dropdown

function NotifDropdown() {
  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 'calc(100% + 8px)',
        width: 340,
        background: 'white',
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        boxShadow: '0 16px 32px rgba(27,58,45,.18)',
        overflow: 'hidden',
        zIndex: 60,
      }}
    >
      <div
        style={{
          padding: '14px 18px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: COLORS.dark,
          }}
        >
          Notificações
        </div>
        <span
          style={{
            fontFamily: "'Open Sans',sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: COLORS.green,
            cursor: 'pointer',
          }}
        >
          Marcar todas
        </span>
      </div>
      <div style={{ maxHeight: 340, overflowY: 'auto' }}>
        {NOTIFICATIONS.map((n, i) => (
          <div
            key={i}
            style={{
              padding: '12px 18px',
              borderBottom: i < NOTIFICATIONS.length - 1 ? `1px solid ${COLORS.border}` : 'none',
              display: 'grid',
              gridTemplateColumns: '28px 1fr auto',
              gap: 12,
              alignItems: 'flex-start',
              background: n.unread ? 'rgba(61,196,90,.04)' : 'white',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: COLORS.light,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
              }}
            >
              {n.emoji}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Open Sans',sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: COLORS.dark,
                  lineHeight: 1.35,
                }}
              >
                {n.title}
              </div>
              <div
                style={{
                  fontFamily: "'Open Sans',sans-serif",
                  fontSize: 11,
                  color: COLORS.muted,
                  marginTop: 3,
                  lineHeight: 1.4,
                }}
              >
                {n.meta}
              </div>
            </div>
            <div
              style={{
                fontFamily: "'Open Sans',sans-serif",
                fontSize: 10,
                color: COLORS.muted,
                whiteSpace: 'nowrap',
                marginTop: 2,
              }}
            >
              {n.time}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: 10, textAlign: 'center', borderTop: `1px solid ${COLORS.border}` }}>
        <span
          style={{
            fontFamily: "'Open Sans',sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: COLORS.dark,
            cursor: 'pointer',
          }}
        >
          Ver todas →
        </span>
      </div>
    </div>
  );
}
