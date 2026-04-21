'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { LoginBackground } from '@/components/LoginBackground';
import { COLORS } from '@/lib/brand-tokens';
import { SC_MUNICIPIOS } from '@/components/landing-v2/sc-municipios';
import { sugerirPlano } from '@/lib/pricing';

const CIDADES = SC_MUNICIPIOS.map((m) => m.name);

const INVERSORES = ['Growatt', 'Sungrow', 'Fronius', 'Deye', 'ABB', 'Canadian Solar', 'WEG', 'Outro'];

const PLANOS = [
  { id: 'basic', label: 'Básico', modulos: 'Até 15 módulos', valor: 30, limpezas: 2 },
  { id: 'standard', label: 'Padrão', modulos: '16 – 30 módulos', valor: 50, limpezas: 2 },
  { id: 'plus', label: 'Plus', modulos: '31 – 60 módulos', valor: 100, limpezas: 2 },
  { id: 'pro', label: 'Pro', modulos: '61 – 200 módulos', valor: null, limpezas: null },
] as const;

type Plano = (typeof PLANOS)[number]['id'];

const GOOGLE_SVG = (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
  </svg>
);

export default function CadastroClientePage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [error, setError] = useState<string | null>(null);

  // Step 1 — dados pessoais
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefone, setTelefone] = useState('');

  // Step 2 — usina
  const [modulos, setModulos] = useState('');
  const [cidade, setCidade] = useState('');
  const [inversor, setInversor] = useState('');
  const [tipoInstalacao, setTipoInstalacao] = useState<'solo' | 'telhado_padrao' | 'telhado_dificil' | ''>('');

  // Step 3 — plano
  const modulosNum = parseInt(modulos) || 0;
  const sugerido = modulosNum > 0 ? sugerirPlano(modulosNum) : 'standard';
  const [planoSelecionado, setPlanoSelecionado] = useState<Plano | null>(null);
  const planoFinal = planoSelecionado ?? sugerido;

  function goToStep2() {
    if (!nome.trim()) return setError('Informe seu nome completo.');
    if (!email.trim()) return setError('Informe seu e-mail.');
    if (password.length < 8) return setError('A senha deve ter pelo menos 8 caracteres.');
    setError(null);
    setStep(2);
  }

  function goToStep3() {
    if (!modulos || modulosNum < 1) return setError('Informe o número de módulos.');
    if (!cidade) return setError('Selecione sua cidade.');
    setError(null);
    setStep(3);
  }

  function goToStep4() {
    setError(null);
    setStep(4);
  }

  const stepLabels = ['Dados pessoais', 'Usina', 'Plano', 'Confirmação'];

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
        {step < 4 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 20 }}>
            {stepLabels.slice(0, 3).map((label, i) => {
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
                        transition: 'background .2s',
                      }}
                    >
                      {done ? '✓' : n}
                    </div>
                    <span style={{ fontSize: 10, color: active ? 'white' : 'rgba(255,255,255,.5)', fontFamily: "'Open Sans',sans-serif", fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>
                      {label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div style={{ width: 48, height: 1, background: step > n ? COLORS.green : 'rgba(255,255,255,.2)', margin: '0 6px', marginBottom: 18, transition: 'background .2s' }} />
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
              <StepHeader back="/cadastro" title="Dados pessoais" subtitle="Crie sua conta para começar." />

              {/* Google OAuth */}
              <GoogleBtn label="Cadastrar com Google" onClick={() => {}} />
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
              <Field label="Telefone / WhatsApp" htmlFor="telefone" optional>
                <Input id="telefone" type="tel" placeholder="(47) 9 9999-9999" autoComplete="tel" value={telefone} onChange={setTelefone} />
              </Field>

              <PrimaryBtn label="Continuar →" onClick={goToStep2} />
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div style={{ padding: '32px' }}>
              <StepHeader back={() => setStep(1)} title="Dados da usina" subtitle="Informe os dados da sua instalação solar." />
              {error && <ErrorBox message={error} />}

              <Field label="Número de módulos" htmlFor="modulos">
                <Input id="modulos" type="number" placeholder="Ex: 20" value={modulos} onChange={setModulos} min="1" max="500" />
              </Field>
              <Field label="Cidade" htmlFor="cidade">
                <Select id="cidade" value={cidade} onChange={setCidade} placeholder="Selecione sua cidade">
                  {CIDADES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>
              <Field label="Marca do inversor" htmlFor="inversor" optional>
                <Select id="inversor" value={inversor} onChange={setInversor} placeholder="Selecione (opcional)">
                  {INVERSORES.map((inv) => <option key={inv} value={inv}>{inv}</option>)}
                </Select>
              </Field>
              <Field label="Tipo de instalação" htmlFor="tipo" optional>
                <Select id="tipo" value={tipoInstalacao} onChange={(v) => setTipoInstalacao(v as typeof tipoInstalacao)} placeholder="Selecione (opcional)">
                  <option value="solo">Solo (acesso fácil)</option>
                  <option value="telhado_padrao">Telhado padrão</option>
                  <option value="telhado_dificil">Telhado difícil / alto</option>
                </Select>
              </Field>

              <PrimaryBtn label="Continuar →" onClick={goToStep3} />
            </div>
          )}

          {/* ── STEP 3 — Plano ── */}
          {step === 3 && (
            <div style={{ padding: '32px' }}>
              <StepHeader back={() => setStep(2)} title="Escolha seu plano" subtitle={`Com ${modulosNum} módulos, recomendamos o plano ${PLANOS.find(p => p.id === sugerido)?.label ?? 'Padrão'}.`} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {PLANOS.map((p) => {
                  const isRecomendado = p.id === sugerido;
                  const isSelected = planoFinal === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlanoSelecionado(p.id)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: isSelected ? COLORS.light : 'white',
                        border: `1.5px solid ${isSelected ? COLORS.green : COLORS.border}`,
                        borderRadius: 12,
                        padding: '14px 18px',
                        cursor: 'pointer',
                        transition: 'border-color .15s, background .15s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 9999,
                            border: `2px solid ${isSelected ? COLORS.green : COLORS.border}`,
                            background: isSelected ? COLORS.green : 'white',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isSelected && <div style={{ width: 6, height: 6, borderRadius: 9999, background: 'white' }} />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 14, color: COLORS.dark }}>
                              Plano {p.label}
                            </span>
                            {isRecomendado && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.green, background: 'rgba(61,196,90,.12)', padding: '2px 8px', borderRadius: 9999, fontFamily: "'Open Sans',sans-serif" }}>
                                Recomendado
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2, fontFamily: "'Open Sans',sans-serif" }}>{p.modulos}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {p.valor ? (
                          <>
                            <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 18, color: COLORS.dark }}>
                              R$ {p.valor}
                            </div>
                            <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: "'Open Sans',sans-serif" }}>/mês · {p.limpezas}×/ano</div>
                          </>
                        ) : (
                          <div style={{ fontSize: 13, color: COLORS.muted, fontFamily: "'Open Sans',sans-serif", fontWeight: 600 }}>Sob consulta</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <PrimaryBtn label="Confirmar →" onClick={goToStep4} />
            </div>
          )}

          {/* ── STEP 4 — Confirmação ── */}
          {step === 4 && (
            <div style={{ padding: '40px 32px', textAlign: 'center' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 9999,
                  background: 'rgba(61,196,90,.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <CheckCircle2 size={32} style={{ color: COLORS.green }} />
              </div>
              <h2
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  color: COLORS.dark,
                  margin: '0 0 8px',
                  letterSpacing: '-.02em',
                }}
              >
                Tudo certo!
              </h2>
              <p style={{ fontSize: 14, color: COLORS.muted, margin: '0 0 8px', lineHeight: 1.6, fontFamily: "'Open Sans',sans-serif" }}>
                Sua conta foi criada com o <b style={{ color: COLORS.dark }}>Plano {PLANOS.find(p => p.id === planoFinal)?.label}</b>.
              </p>
              <p style={{ fontSize: 13, color: COLORS.muted, margin: '0 0 28px', lineHeight: 1.6, fontFamily: "'Open Sans',sans-serif" }}>
                Verifique seu e-mail para confirmar o cadastro e acessar o painel.
              </p>

              <div style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
                {[
                  ['Nome', nome],
                  ['E-mail', email],
                  ['Cidade', cidade],
                  ['Módulos', `${modulos} módulos`],
                  ['Plano', PLANOS.find(p => p.id === planoFinal)?.label ?? ''],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontSize: 12, color: COLORS.muted, fontFamily: "'Open Sans',sans-serif" }}>{k}</span>
                    <span style={{ fontSize: 12, color: COLORS.dark, fontWeight: 600, fontFamily: "'Open Sans',sans-serif" }}>{v}</span>
                  </div>
                ))}
              </div>

              <Link href="/login" style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ ...primaryBtnStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  Ir para o login →
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

function StepHeader({ back, title, subtitle }: { back: string | (() => void); title: string; subtitle: string }) {
  const backEl = typeof back === 'string' ? (
    <Link href={back} style={backLinkStyle}>← Voltar</Link>
  ) : (
    <button type="button" onClick={back} style={{ ...backLinkStyle, background: 'none', border: 'none', padding: 0 }}>← Voltar</button>
  );
  return (
    <div style={{ marginBottom: 20 }}>
      {backEl}
      <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 20, color: COLORS.dark, margin: '8px 0 4px', letterSpacing: '-.02em' }}>{title}</h1>
      <p style={{ fontSize: 13, color: COLORS.muted, margin: 0, fontFamily: "'Open Sans',sans-serif" }}>{subtitle}</p>
    </div>
  );
}

function GoogleBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={googleBtnStyle}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.green; e.currentTarget.style.background = COLORS.light; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = 'white'; }}
    >
      {GOOGLE_SVG}
      <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.dark, fontFamily: "'Open Sans',sans-serif" }}>{label}</span>
    </button>
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

function Field({ label, htmlFor, optional, children }: { label: string; htmlFor: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={htmlFor} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: COLORS.dark, fontFamily: "'Open Sans',sans-serif", marginBottom: 5 }}>
        {label}
        {optional && <span style={{ fontSize: 11, color: COLORS.muted, fontWeight: 400 }}>(opcional)</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ id, type, placeholder, autoComplete, value, onChange, min, max }: {
  id: string; type: string; placeholder: string; autoComplete?: string; value: string;
  onChange: (v: string) => void; min?: string; max?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      max={max}
      style={inputStyle}
      onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.green; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(61,196,90,.12)`; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = 'none'; }}
    />
  );
}

function Select({ id, value, onChange, placeholder, children }: {
  id: string; value: string; onChange: (v: string) => void; placeholder: string; children: React.ReactNode;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...inputStyle, cursor: 'pointer' }}
      onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.green; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(61,196,90,.12)`; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  );
}

function PrimaryBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ ...primaryBtnStyle, marginTop: 8, cursor: 'pointer' }}>
      {label}
    </button>
  );
}

const backLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: 12,
  color: COLORS.muted,
  textDecoration: 'none',
  fontFamily: "'Open Sans',sans-serif",
  cursor: 'pointer',
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
