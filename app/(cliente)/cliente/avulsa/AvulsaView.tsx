'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, Eyebrow } from '@/components/landing-v2/shared';
import { COLORS } from '@/lib/brand-tokens';
import { MOCK_CLIENTE } from '@/lib/mock-cliente';

type Step = 'detalhes' | 'resumo' | 'confirmacao';

const STEPS: { k: Step; label: string }[] = [
  { k: 'detalhes', label: 'Detalhes' },
  { k: 'resumo', label: 'Resumo' },
  { k: 'confirmacao', label: 'Confirmação' },
];

const PRECO_AVULSO = 180;
const DESCONTO_PCT = 0.4;
const PRECO_ASSINANTE = Math.round(PRECO_AVULSO * (1 - DESCONTO_PCT));

export default function AvulsaView() {
  const c = MOCK_CLIENTE;
  const [step, setStep] = useState<Step>('detalhes');
  const [modulos, setModulos] = useState<number>(c.modulos);
  const [data, setData] = useState('');
  const [obs, setObs] = useState('');

  const currentIdx = STEPS.findIndex((s) => s.k === step);

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 28px 72px', display: 'grid', gap: 28 }}>
      <div>
        <Eyebrow>Solicitar serviço avulso</Eyebrow>
        <h1
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 800,
            fontSize: 28,
            color: COLORS.dark,
            margin: '6px 0 0',
            letterSpacing: '-.025em',
          }}
        >
          Limpeza fora do agendamento
        </h1>
      </div>

      {/* Steps bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {STEPS.map((s, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <div key={s.k} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 16px',
                  borderRadius: 9999,
                  background: done ? COLORS.green : active ? COLORS.dark : 'transparent',
                  color: done || active ? 'white' : COLORS.muted,
                  border: done || active ? 'none' : `1px solid ${COLORS.border}`,
                  fontSize: 13,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 9999,
                    background: done ? 'rgba(255,255,255,.2)' : active ? COLORS.green : COLORS.border,
                    color: done || active ? 'white' : COLORS.dark,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                  }}
                >
                  {done ? '✓' : i + 1}
                </span>
                {s.label}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: done ? COLORS.green : COLORS.border,
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {step === 'detalhes' && (
        <StepDetalhes
          modulos={modulos}
          setModulos={setModulos}
          data={data}
          setData={setData}
          obs={obs}
          setObs={setObs}
          onNext={() => setStep('resumo')}
          endereco={`R. das Araucárias, 520 — ${c.cidade}`}
        />
      )}

      {step === 'resumo' && (
        <StepResumo
          modulos={modulos}
          data={data}
          cidade={c.cidade}
          onBack={() => setStep('detalhes')}
          onNext={() => setStep('confirmacao')}
        />
      )}

      {step === 'confirmacao' && <StepConfirmacao email={c.email} data={data} />}
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'white',
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: 28,
        boxShadow: '0 2px 12px rgba(27,58,45,.08)',
      }}
    >
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: COLORS.muted,
        textTransform: 'uppercase',
        letterSpacing: '.08em',
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  type = 'text',
  placeholder,
  ...rest
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'placeholder'>) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      {...rest}
      style={{
        width: '100%',
        padding: '12px 14px',
        borderRadius: 10,
        border: `1.5px solid ${COLORS.border}`,
        fontSize: 14,
        color: COLORS.dark,
        fontFamily: "'Open Sans',sans-serif",
        outline: 'none',
      }}
    />
  );
}

function StepDetalhes({
  modulos,
  setModulos,
  data,
  setData,
  obs,
  setObs,
  onNext,
  endereco,
}: {
  modulos: number;
  setModulos: (n: number) => void;
  data: string;
  setData: (v: string) => void;
  obs: string;
  setObs: (v: string) => void;
  onNext: () => void;
  endereco: string;
}) {
  const today = new Date().toISOString().split('T')[0];
  const valid = data !== '';
  return (
    <Card>
      <div style={{ display: 'grid', gap: 20 }}>
        <div>
          <FieldLabel>Endereço de serviço</FieldLabel>
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              fontSize: 14,
              color: COLORS.dark,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{endereco}</span>
            <Button variant="ghost" size="sm">
              Alterar
            </Button>
          </div>
        </div>

        <div>
          <FieldLabel>Quantidade de módulos</FieldLabel>
          <select
            value={modulos}
            onChange={(e) => setModulos(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: `1.5px solid ${COLORS.border}`,
              fontSize: 14,
              color: COLORS.dark,
              background: 'white',
              fontFamily: "'Open Sans',sans-serif",
              cursor: 'pointer',
            }}
          >
            {[10, 15, 20, 25, 30, 40, 50, 60].map((n) => (
              <option key={n} value={n}>
                {n} módulos
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel>Data desejada</FieldLabel>
          <Input type="date" min={today} value={data} onChange={setData} />
        </div>

        <div>
          <FieldLabel>Observações (opcional)</FieldLabel>
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            rows={3}
            placeholder="Horário preferido, pontos de atenção..."
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: `1.5px solid ${COLORS.border}`,
              fontSize: 14,
              color: COLORS.dark,
              fontFamily: "'Open Sans',sans-serif",
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        <div
          style={{
            background: COLORS.light,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: 18,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 13, color: COLORS.muted }}>Preço tabela avulso:</span>
            <span
              style={{
                fontSize: 15,
                color: COLORS.muted,
                textDecoration: 'line-through',
                fontWeight: 600,
              }}
            >
              R$ {PRECO_AVULSO},00
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, color: COLORS.dark, fontWeight: 700 }}>Preço assinante (40% off):</span>
            <span
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 800,
                fontSize: 24,
                color: COLORS.green,
                letterSpacing: '-.02em',
              }}
            >
              R$ {PRECO_ASSINANTE},00
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <Link href="/cliente/home" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="md">
              ← Voltar para home
            </Button>
          </Link>
          <Button variant="primary" size="md" disabled={!valid} onClick={onNext}>
            Continuar →
          </Button>
        </div>
      </div>
    </Card>
  );
}

function StepResumo({
  modulos,
  data,
  cidade,
  onBack,
  onNext,
}: {
  modulos: number;
  data: string;
  cidade: string;
  onBack: () => void;
  onNext: () => void;
}) {
  const dataFmt = data ? new Date(data + 'T00:00:00').toLocaleDateString('pt-BR') : '—';
  const desconto = PRECO_AVULSO - PRECO_ASSINANTE;
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <Card>
        <Eyebrow>Detalhes do serviço</Eyebrow>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          <Row label="Serviço" value="Limpeza profissional avulsa" />
          <Row label="Endereço" value={`R. das Araucárias, 520 — ${cidade}`} />
          <Row label="Módulos" value={`${modulos} módulos · 550W cada`} />
          <Row label="Data solicitada" value={dataFmt} />
          <Row label="Técnico" value={`A confirmar (região: ${cidade})`} />
        </div>
      </Card>

      <Card>
        <Eyebrow>Cobrança</Eyebrow>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          <Row label="Preço tabela avulso" value={`R$ ${PRECO_AVULSO},00`} />
          <Row
            label="Desconto assinante 40%"
            value={<span style={{ color: COLORS.green, fontWeight: 700 }}>− R$ {desconto},00</span>}
          />
          <div style={{ height: 1, background: COLORS.border, margin: '4px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 14, color: COLORS.dark, fontWeight: 700 }}>Total</span>
            <span
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 800,
                fontSize: 20,
                color: COLORS.dark,
                letterSpacing: '-.02em',
              }}
            >
              R$ {PRECO_ASSINANTE},00
            </span>
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>
            Cobrança separada da assinatura · Cartão Mastercard •••• 4782
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <Button variant="secondary" size="md" onClick={onBack}>
          ← Voltar
        </Button>
        <Button variant="primary" size="md" onClick={onNext}>
          Confirmar pedido →
        </Button>
      </div>
    </div>
  );
}

function StepConfirmacao({ email, data }: { email: string; data: string }) {
  const dataFmt = data ? new Date(data + 'T00:00:00').toLocaleDateString('pt-BR') : '—';
  const protocolo = `AV-2026-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`;
  return (
    <Card>
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 9999,
            background: COLORS.light,
            color: COLORS.green,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 34,
            marginBottom: 18,
          }}
        >
          ✅
        </div>
        <h2
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 800,
            fontSize: 24,
            color: COLORS.dark,
            margin: 0,
            letterSpacing: '-.02em',
          }}
        >
          Solicitação recebida
        </h2>
        <p
          style={{
            fontSize: 14,
            color: COLORS.muted,
            marginTop: 10,
            lineHeight: 1.55,
            maxWidth: 520,
            margin: '10px auto 0',
          }}
        >
          Confirmação enviada para <b style={{ color: COLORS.dark }}>{email}</b>. Um técnico da sua região entrará em
          contato em até 24h para confirmar a data.
        </p>
      </div>

      <div
        style={{
          background: COLORS.bg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 18,
          margin: '0 0 20px',
          display: 'grid',
          gap: 10,
        }}
      >
        <Row label="Protocolo" value={`#${protocolo}`} />
        <Row label="Data solicitada" value={dataFmt} />
        <Row
          label="Valor a cobrar"
          value={<span style={{ color: COLORS.green, fontWeight: 700 }}>R$ {PRECO_ASSINANTE},00</span>}
        />
      </div>

      <Link href="/cliente/home" style={{ textDecoration: 'none' }}>
        <Button variant="primary" size="lg" fullWidth>
          Voltar ao início →
        </Button>
      </Link>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
      <span style={{ color: COLORS.muted }}>{label}</span>
      <span style={{ color: COLORS.dark, fontWeight: 600, textAlign: 'right' }}>{value}</span>
    </div>
  );
}
