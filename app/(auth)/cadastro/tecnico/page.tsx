'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Clock } from 'lucide-react';
import { LoginBackground } from '@/components/LoginBackground';
import { COLORS } from '@/lib/brand-tokens';
import { SC_MUNICIPIOS } from '@/components/landing-v2/sc-municipios';

const CIDADES = SC_MUNICIPIOS.map((m) => m.name);

const ESPECIALIDADES = [
  'Limpeza de painéis solares',
  'Elétrica residencial',
  'Elétrica comercial',
  'Instalação solar',
  'Manutenção de inversores',
];

const GOOGLE_SVG = (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
  </svg>
);

export default function CadastroTecnicoPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState<string | null>(null);

  // Step 1 — dados pessoais
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');

  // Step 2 — experiência
  const [experiencia, setExperiencia] = useState('');
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);

  function toggleEspecialidade(item: string) {
    setEspecialidades((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  }

  function goToStep2() {
    if (!nome.trim()) return setError('Informe seu nome completo.');
    if (!email.trim()) return setError('Informe seu e-mail.');
    if (password.length < 8) return setError('A senha deve ter pelo menos 8 caracteres.');
    if (!cidade) return setError('Selecione sua cidade principal de atuação.');
    setError(null);
    setStep(2);
  }

  function goToStep3() {
    if (!experiencia.trim()) return setError('Descreva sua experiência profissional.');
    if (!termsAccepted) return setError('Você precisa aceitar os Termos de Uso para continuar.');
    setError(null);
    setStep(3);
  }

  const stepLabels = ['Dados pessoais', 'Experiência'];

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

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/landing-v2-logo-mark.jpg" alt="Painel Clean" style={{ width: 36, height: 36, borderRadius: 9, objectFit: 'cover' }} />
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 20, color: 'white', letterSpacing: '-.02em' }}>
              Painel <span style={{ color: COLORS.green }}>Clean</span>
            </span>
          </Link>
        </div>

        {/* Stepper */}
        {step < 3 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 20 }}>
            {stepLabels.map((label, i) => {
              const n = i + 1;
              const active = step === n;
              const done = step > n;
              return (
                <div key={n} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 9999,
                        background: done ? COLORS.green : active ? 'white' : 'rgba(255,255,255,.2)',
                        color: done ? 'white' : active ? COLORS.dark : 'rgba(255,255,255,.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Montserrat',sans-serif",
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      {done ? '✓' : n}
                    </div>
                    <span style={{ fontSize: 10, color: active ? 'white' : 'rgba(255,255,255,.5)', fontFamily: "'Open Sans',sans-serif", fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>
                      {label}
                    </span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div style={{ width: 60, height: 1, background: step > n ? COLORS.green : 'rgba(255,255,255,.2)', margin: '0 6px', marginBottom: 18 }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Card */}
        <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 24px 48px rgba(0,0,0,.22)', overflow: 'hidden' }}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div style={{ padding: '32px' }}>
              <BackLink href="/cadastro" />
              <h1 style={titleStyle}>Cadastro de técnico</h1>
              <p style={subtitleStyle}>Receba chamados de limpeza de painéis solares na sua região.</p>

              {/* Google */}
              <button
                type="button"
                style={googleBtnStyle}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.green; e.currentTarget.style.background = COLORS.light; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = 'white'; }}
              >
                {GOOGLE_SVG}
                <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.dark, fontFamily: "'Open Sans',sans-serif" }}>Cadastrar com Google</span>
              </button>
              <Divider />
              {error && <ErrorBox message={error} />}

              <Field label="Nome completo" htmlFor="nome">
                <Input id="nome" type="text" placeholder="Rafael Silva" autoComplete="name" value={nome} onChange={setNome} />
              </Field>
              <Field label="E-mail" htmlFor="email">
                <Input id="email" type="email" placeholder="seu@email.com" autoComplete="email" value={email} onChange={setEmail} />
              </Field>
              <Field label="Senha" htmlFor="password">
                <Input id="password" type="password" placeholder="Mínimo 8 caracteres" autoComplete="new-password" value={password} onChange={setPassword} />
              </Field>
              <Field label="Telefone / WhatsApp" htmlFor="telefone">
                <Input id="telefone" type="tel" placeholder="(47) 9 9999-9999" autoComplete="tel" value={telefone} onChange={setTelefone} />
              </Field>
              <Field label="Cidade principal de atuação" htmlFor="cidade">
                <select
                  id="cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.green; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(61,196,90,.12)`; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <option value="">Selecione sua cidade</option>
                  {CIDADES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <button type="button" onClick={goToStep2} style={{ ...primaryBtnStyle, marginTop: 8, cursor: 'pointer' }}>
                Continuar →
              </button>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div style={{ padding: '32px' }}>
              <button type="button" onClick={() => { setStep(1); setError(null); }} style={backBtnStyle}>← Voltar</button>
              <h1 style={titleStyle}>Experiência profissional</h1>
              <p style={subtitleStyle}>Conte um pouco sobre sua formação e experiência técnica.</p>

              {error && <ErrorBox message={error} />}

              <Field label="Descreva sua experiência" htmlFor="experiencia">
                <textarea
                  id="experiencia"
                  placeholder="Ex: Eletricista há 5 anos, experiência em instalação e manutenção de sistemas fotovoltaicos residenciais e comerciais em Jaraguá do Sul e região."
                  value={experiencia}
                  onChange={(e) => setExperiencia(e.target.value)}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.green; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(61,196,90,.12)`; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </Field>

              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.dark, fontFamily: "'Open Sans',sans-serif", marginBottom: 10 }}>
                  Especialidades <span style={{ color: COLORS.muted, fontWeight: 400, fontSize: 11 }}>(opcional)</span>
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {ESPECIALIDADES.map((item) => {
                    const checked = especialidades.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleEspecialidade(item)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 9999,
                          border: `1px solid ${checked ? COLORS.green : COLORS.border}`,
                          background: checked ? COLORS.light : 'white',
                          color: checked ? COLORS.dark : COLORS.muted,
                          fontSize: 12,
                          fontWeight: checked ? 600 : 400,
                          fontFamily: "'Open Sans',sans-serif",
                          cursor: 'pointer',
                          transition: 'all .15s',
                        }}
                      >
                        {checked ? '✓ ' : ''}{item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Terms */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  padding: '14px',
                  marginBottom: 20,
                  cursor: 'pointer',
                }}
                onClick={() => setTermsAccepted((v) => !v)}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    border: `2px solid ${termsAccepted ? COLORS.green : COLORS.border}`,
                    background: termsAccepted ? COLORS.green : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1,
                    transition: 'all .15s',
                  }}
                >
                  {termsAccepted && <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>✓</span>}
                </div>
                <p style={{ fontSize: 12, color: COLORS.muted, margin: 0, lineHeight: 1.55, fontFamily: "'Open Sans',sans-serif" }}>
                  Li e aceito os{' '}
                  <Link href="/termos" target="_blank" onClick={(e) => e.stopPropagation()} style={{ color: COLORS.green, fontWeight: 600, textDecoration: 'none' }}>
                    Termos de Uso
                  </Link>{' '}
                  da plataforma, incluindo a proibição de contato direto com clientes fora da plataforma e o repasse de <b style={{ color: COLORS.dark }}>75%</b> do valor do serviço.
                </p>
              </div>

              <button type="button" onClick={goToStep3} style={{ ...primaryBtnStyle, cursor: 'pointer' }}>
                Enviar cadastro →
              </button>
            </div>
          )}

          {/* ── STEP 3 — Aguardando aprovação ── */}
          {step === 3 && (
            <div style={{ padding: '40px 32px', textAlign: 'center' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 9999,
                  background: 'rgba(245,158,11,.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <Clock size={32} style={{ color: '#D97706' }} />
              </div>
              <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 22, color: COLORS.dark, margin: '0 0 8px', letterSpacing: '-.02em' }}>
                Cadastro enviado!
              </h2>
              <p style={{ fontSize: 14, color: COLORS.muted, margin: '0 0 16px', lineHeight: 1.6, fontFamily: "'Open Sans',sans-serif" }}>
                Recebemos seu cadastro como técnico. Nossa equipe vai revisar seu perfil em até <b style={{ color: COLORS.dark }}>48 horas</b>.
              </p>

              <div
                style={{
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 14,
                  padding: '20px',
                  marginBottom: 28,
                  textAlign: 'left',
                }}
              >
                {[
                  ['O que acontece agora?', ''],
                ].map(() => null)}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    ['📧', 'Você receberá um e-mail de confirmação em breve.'],
                    ['🔍', 'Nossa equipe vai revisar sua experiência e especialidades.'],
                    ['✅', 'Após aprovado, você poderá aceitar chamados na plataforma.'],
                  ].map(([emoji, text]) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{emoji}</span>
                      <p style={{ fontSize: 13, color: COLORS.muted, margin: 0, lineHeight: 1.55, fontFamily: "'Open Sans',sans-serif" }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ ...primaryBtnStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  Voltar para a página inicial
                </div>
              </Link>
            </div>
          )}
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

/* ── Shared sub-components ── */

function BackLink({ href }: { href: string }) {
  return (
    <Link href={href} style={{ display: 'inline-flex', alignItems: 'center', fontSize: 12, color: COLORS.muted, textDecoration: 'none', fontFamily: "'Open Sans',sans-serif", marginBottom: 10 }}>
      ← Voltar
    </Link>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={htmlFor} style={{ display: 'block', fontSize: 13, fontWeight: 600, color: COLORS.dark, fontFamily: "'Open Sans',sans-serif", marginBottom: 5 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ id, type, placeholder, autoComplete, value, onChange }: {
  id: string; type: string; placeholder: string; autoComplete?: string;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={inputStyle}
      onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.green; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(61,196,90,.12)`; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = 'none'; }}
    />
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
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
      <AlertCircle size={15} style={{ color: '#DC2626', flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 13, color: '#B91C1C', fontFamily: "'Open Sans',sans-serif", lineHeight: 1.45 }}>{message}</span>
    </div>
  );
}

const titleStyle: React.CSSProperties = {
  fontFamily: "'Montserrat',sans-serif",
  fontWeight: 800,
  fontSize: 20,
  color: COLORS.dark,
  margin: '8px 0 4px',
  letterSpacing: '-.02em',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 13,
  color: COLORS.muted,
  margin: '0 0 20px',
  fontFamily: "'Open Sans',sans-serif",
};

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
  letterSpacing: '-.01em',
  transition: 'background .15s',
  boxSizing: 'border-box',
};

const backBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: 12,
  color: COLORS.muted,
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: "'Open Sans',sans-serif",
  marginBottom: 10,
};
