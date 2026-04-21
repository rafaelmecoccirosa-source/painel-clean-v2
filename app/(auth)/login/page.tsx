'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { LoginBackground } from '@/components/LoginBackground';
import { createClient } from '@/lib/supabase/client';
import { COLORS } from '@/lib/brand-tokens';

const GOOGLE_SVG = (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setLoadingGoogle(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoadingGoogle(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setLoading(false);
      if (signInError.message.includes('Invalid login credentials') || signInError.message.includes('invalid_credentials')) {
        setError('E-mail ou senha incorretos.');
      } else if (signInError.message.includes('Email not confirmed')) {
        setError('Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.');
      } else {
        setError(signInError.message);
      }
      return;
    }
    window.location.href = '/api/auth/redirect';
  }

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
            overflow: 'hidden',
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${COLORS.border}` }}>
            <TabBtn label="Entrar" active />
            <TabBtn label="Criar conta" active={false} onClick={() => router.push('/cadastro')} />
          </div>

          {/* Form body */}
          <div style={{ padding: '28px 32px 32px' }}>
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loadingGoogle}
              style={googleBtnStyle}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.green; e.currentTarget.style.background = COLORS.light; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = 'white'; }}
            >
              {GOOGLE_SVG}
              <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.dark, fontFamily: "'Open Sans',sans-serif" }}>
                {loadingGoogle ? 'Redirecionando…' : 'Continuar com Google'}
              </span>
            </button>

            <Divider />

            {error && <ErrorBox message={error} />}

            <form onSubmit={handleSubmit}>
              <Field label="E-mail" htmlFor="email">
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.green; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(61,196,90,.12)`; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </Field>

              <Field
                label="Senha"
                htmlFor="password"
                extra={
                  <Link href="/recuperar-senha" style={{ fontSize: 12, color: COLORS.green, textDecoration: 'none', fontFamily: "'Open Sans',sans-serif" }}>
                    Esqueceu a senha?
                  </Link>
                }
              >
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.green; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(61,196,90,.12)`; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </Field>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...primaryBtnStyle,
                  marginTop: 24,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Entrando…' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,.65)', marginTop: 20, fontFamily: "'Open Sans',sans-serif" }}>
          Não tem conta?{' '}
          <Link href="/cadastro" style={{ color: COLORS.green, fontWeight: 600, textDecoration: 'none' }}>
            Cadastre-se grátis
          </Link>
        </p>
      </div>
    </div>
  );
}

function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        padding: '14px 0',
        background: 'transparent',
        border: 'none',
        borderBottom: active ? `2px solid ${COLORS.green}` : '2px solid transparent',
        fontFamily: "'Open Sans',sans-serif",
        fontSize: 14,
        fontWeight: active ? 700 : 500,
        color: active ? COLORS.dark : COLORS.muted,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'color .15s, border-color .15s',
        marginBottom: -1,
      }}
    >
      {label}
    </button>
  );
}

function Field({ label, htmlFor, extra, children }: { label: string; htmlFor: string; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <label
          htmlFor={htmlFor}
          style={{ fontSize: 13, fontWeight: 600, color: COLORS.dark, fontFamily: "'Open Sans',sans-serif" }}
        >
          {label}
        </label>
        {extra}
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
      <div style={{ flex: 1, height: 1, background: COLORS.border }} />
      <span style={{ fontSize: 11, color: COLORS.muted, fontFamily: "'Open Sans',sans-serif", fontWeight: 500 }}>ou</span>
      <div style={{ flex: 1, height: 1, background: COLORS.border }} />
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        background: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: 10,
        padding: '12px 14px',
        marginBottom: 16,
      }}
    >
      <AlertCircle size={15} style={{ color: '#DC2626', flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 13, color: '#B91C1C', fontFamily: "'Open Sans',sans-serif", lineHeight: 1.45 }}>{message}</span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: `1px solid ${COLORS.border}`,
  borderRadius: 10,
  fontSize: 14,
  fontFamily: "'Open Sans',sans-serif",
  color: COLORS.dark,
  background: COLORS.bg,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color .15s, box-shadow .15s',
};

const googleBtnStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  background: 'white',
  border: `1px solid ${COLORS.border}`,
  borderRadius: 10,
  padding: '11px 16px',
  cursor: 'pointer',
  transition: 'border-color .15s, background .15s',
  boxSizing: 'border-box',
};

const primaryBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '13px 0',
  background: COLORS.green,
  color: 'white',
  border: 'none',
  borderRadius: 10,
  fontFamily: "'Montserrat',sans-serif",
  fontWeight: 700,
  fontSize: 15,
  cursor: 'pointer',
  letterSpacing: '-.01em',
  transition: 'background .15s',
  boxSizing: 'border-box',
};
