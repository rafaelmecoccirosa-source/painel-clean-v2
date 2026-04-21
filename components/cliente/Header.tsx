'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { COLORS } from '@/components/landing-v2/shared';
import { createClient } from '@/lib/supabase/client';
import { initialsOf } from '@/lib/mock-cliente';

type NavItem = { href: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { href: '/cliente/home', label: 'Início' },
  { href: '/cliente/relatorios', label: 'Relatórios' },
  { href: '/cliente/historico', label: 'Histórico' },
  { href: '/cliente/avulsa', label: 'Solicitar Limpeza' },
  { href: '/cliente/indicacoes', label: 'Indicações' },
  { href: '/cliente/perfil', label: 'Perfil' },
];

const NOTIFICATIONS = [
  { emoji: '📅', title: 'Limpeza agendada para 03 jun', meta: 'Confirmada pelo técnico Carlos S.', time: 'há 2h', unread: true },
  { emoji: '📊', title: 'Relatório de março disponível', meta: 'Usina gerou 94% do esperado', time: 'ontem', unread: true },
  { emoji: '💳', title: 'Cobrança de R$ 44,00 em 20 mai', meta: 'Lembrete da assinatura mensal', time: 'há 3d', unread: true },
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
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
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
        <Link href="/cliente/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 11 }}>
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
                fontSize: 12,
                marginTop: 4,
                color: COLORS.muted,
                fontWeight: 500,
                fontFamily: "'Open Sans',sans-serif",
                letterSpacing: '.02em',
              }}
            >
              Limpeza e monitoramento solar
            </div>
          </div>
        </Link>

        <nav style={{ display: 'flex', gap: 2 }}>
          {NAV_ITEMS.map((item) => (
            <NavPill key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
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
                border: 'none',
                background: 'transparent',
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
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(27,58,45,.15)',
                  fontFamily: "'Montserrat',sans-serif",
                  letterSpacing: '.02em',
                }}
              >
                {initials}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 13, color: COLORS.dark, fontWeight: 600 }}>{userName}</span>
                <span
                  style={{
                    fontSize: 12,
                    color: COLORS.muted,
                    fontFamily: "'Open Sans',sans-serif",
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
                  style={{ ...dropdownItemStyle, color: COLORS.dark }}
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
      </div>
    </header>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/cliente/home') return pathname === '/cliente' || pathname.startsWith('/cliente/home');
  return pathname.startsWith(href);
}

const dropdownItemStyle: React.CSSProperties = {
  display: 'block',
  padding: '9px 12px',
  fontSize: 13,
  fontWeight: 500,
  borderRadius: 8,
  textDecoration: 'none',
  fontFamily: "'Open Sans',sans-serif",
};

function NavPill({ item, active }: { item: NavItem; active: boolean }) {
  const [hover, setHover] = useState(false);
  const color = active ? COLORS.dark : hover ? COLORS.dark : COLORS.muted;
  const background = active ? 'white' : hover ? 'rgba(255,255,255,.55)' : 'transparent';
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
        fontSize: 14,
        fontWeight: 600,
        background,
        color,
        fontFamily: "'Open Sans',sans-serif",
        transition: 'background .15s, color .15s',
        boxShadow: active ? '0 1px 3px rgba(27,58,45,.08)' : 'none',
      }}
    >
      {item.label}
    </Link>
  );
}

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
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 14, color: COLORS.dark }}>
          Notificações
        </div>
        <span style={{ fontSize: 11, color: COLORS.green, fontWeight: 600, cursor: 'pointer' }}>Marcar todas</span>
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
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.dark, lineHeight: 1.35 }}>{n.title}</div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 3, lineHeight: 1.4 }}>{n.meta}</div>
            </div>
            <div style={{ fontSize: 10, color: COLORS.muted, whiteSpace: 'nowrap', marginTop: 2 }}>{n.time}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: 10, textAlign: 'center', borderTop: `1px solid ${COLORS.border}` }}>
        <span style={{ fontSize: 12, color: COLORS.dark, fontWeight: 600, cursor: 'pointer' }}>Ver todas →</span>
      </div>
    </div>
  );
}
