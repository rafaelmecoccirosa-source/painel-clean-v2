'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoginBackground } from '@/components/LoginBackground';
import { COLORS } from '@/lib/brand-tokens';

export default function CadastroPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 20px',
        position: 'relative',
      }}
    >
      <LoginBackground />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/landing-v2-logo-mark.jpg" alt="Painel Clean" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 22, color: 'white', letterSpacing: '-.02em' }}>
              Painel <span style={{ color: COLORS.green }}>Clean</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            boxShadow: '0 24px 48px rgba(0,0,0,.22)',
            padding: '32px',
          }}
        >
          <h1
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 800,
              fontSize: 22,
              color: COLORS.dark,
              margin: '0 0 6px',
              letterSpacing: '-.02em',
            }}
          >
            Criar conta
          </h1>
          <p style={{ fontSize: 14, color: COLORS.muted, margin: '0 0 28px', fontFamily: "'Open Sans',sans-serif" }}>
            Como você quer usar a plataforma?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <RoleCard
              emoji="🏠"
              title="Sou cliente"
              description="Quero agendar limpeza das minhas placas solares e acompanhar o desempenho da minha usina."
              onClick={() => router.push('/cadastro/cliente')}
            />
            <RoleCard
              emoji="🔧"
              title="Sou técnico"
              description="Quero prestar serviços de limpeza de painéis solares e receber chamados na minha região."
              onClick={() => router.push('/cadastro/tecnico')}
            />
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,.65)', marginTop: 20, fontFamily: "'Open Sans',sans-serif" }}>
          Já tem conta?{' '}
          <Link href="/login" style={{ color: COLORS.green, fontWeight: 600, textDecoration: 'none' }}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

function RoleCard({
  emoji,
  title,
  description,
  onClick,
}: {
  emoji: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        background: COLORS.bg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: '18px 20px',
        cursor: 'pointer',
        transition: 'border-color .15s, background .15s, box-shadow .15s',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = COLORS.green;
        e.currentTarget.style.background = COLORS.light;
        e.currentTarget.style.boxShadow = `0 0 0 3px rgba(61,196,90,.1)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.border;
        e.currentTarget.style.background = COLORS.bg;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{emoji}</span>
      <div>
        <div
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: COLORS.dark,
            marginBottom: 4,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 13,
            color: COLORS.muted,
            lineHeight: 1.5,
            fontFamily: "'Open Sans',sans-serif",
          }}
        >
          {description}
        </div>
      </div>
      <span
        style={{
          marginLeft: 'auto',
          flexShrink: 0,
          fontSize: 18,
          color: COLORS.muted,
          alignSelf: 'center',
        }}
      >
        →
      </span>
    </button>
  );
}
