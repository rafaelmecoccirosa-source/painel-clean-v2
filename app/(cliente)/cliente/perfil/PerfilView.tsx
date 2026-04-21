'use client';

import { useState } from 'react';
import { Badge, Button, Eyebrow } from '@/components/landing-v2/shared';
import { COLORS } from '@/lib/brand-tokens';
import { MOCK_CLIENTE, initialsOf } from '@/lib/mock-cliente';

type NotifKey = 'lembrete' | 'relatorio' | 'alerta' | 'promocoes';

export default function PerfilView() {
  const c = MOCK_CLIENTE;
  const [notif, setNotif] = useState<Record<NotifKey, boolean>>({
    lembrete: true,
    relatorio: true,
    alerta: true,
    promocoes: false,
  });

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 28px 72px', display: 'grid', gap: 24 }}>
      <div>
        <Eyebrow>Seu perfil</Eyebrow>
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
          Dados e preferências
        </h1>
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 24 }}>
        {/* Dados pessoais */}
        <div
          style={{
            background: 'white',
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            padding: 28,
            boxShadow: '0 2px 12px rgba(27,58,45,.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 9999,
                background: COLORS.dark,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 800,
                fontSize: 26,
                letterSpacing: '.02em',
              }}
            >
              {initialsOf(c.nome)}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  color: COLORS.dark,
                  letterSpacing: '-.02em',
                }}
              >
                {c.nome}
              </div>
              <div style={{ marginTop: 6 }}>
                <Badge tone="green">Assinante {c.plano}</Badge>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <FieldRow label="Email" value={c.email} />
            <FieldRow label="Telefone" value="(47) 99812-3456" />
            <FieldRow label="CPF" value="•••.•••.123-45" />
            <FieldRow
              label="Endereço"
              value={`R. das Araucárias, 520 — ${c.cidade}, SC`}
              action={<Button variant="ghost" size="sm">Editar</Button>}
            />
          </div>

          <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${COLORS.border}` }}>
            <Button variant="secondary" size="md">
              Editar dados pessoais
            </Button>
          </div>
        </div>

        {/* Minha usina + Assinatura */}
        <div style={{ display: 'grid', gap: 20 }}>
          <div
            style={{
              background: 'white',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 2px 12px rgba(27,58,45,.08)',
            }}
          >
            <Eyebrow>Minha usina</Eyebrow>
            <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
              <KV label="Módulos" value={`${c.modulos} placas · 550W cada`} />
              <KV label="Potência" value={`${c.potencia} kWp`} />
              <KV label="Inversor" value={c.inversor} />
              <KV label="Instalação" value="Telhado inclinado" />
              <KV label="API inversor" value={<Badge tone="amber">Em breve</Badge>} />
            </div>
          </div>

          <div
            style={{
              background: 'white',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 2px 12px rgba(27,58,45,.08)',
            }}
          >
            <Eyebrow>Assinatura</Eyebrow>
            <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
              <KV label="Plano" value={`${c.plano} · R$ ${c.mensalidade}/mês`} />
              <KV label="Cliente desde" value="Abril 2026" />
              <KV label="Técnico fixo" value={c.tecnico} />
              <KV
                label="Desconto indicação"
                value={
                  <span style={{ color: COLORS.green, fontWeight: 700 }}>
                    {c.descontoIndicacao}% ativo
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pagamento */}
      <section
        style={{
          background: 'white',
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 2px 12px rgba(27,58,45,.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 42,
              borderRadius: 8,
              background: `linear-gradient(135deg, #EB001B, #F79E1B)`,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: 6,
                bottom: 6,
                fontSize: 8,
                fontWeight: 800,
                color: 'white',
                letterSpacing: '.02em',
              }}
            >
              MC
            </div>
          </div>
          <div>
            <Eyebrow>Forma de pagamento</Eyebrow>
            <div
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: COLORS.dark,
                marginTop: 4,
              }}
            >
              Mastercard •••• 4782
            </div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>Expira 09/2028</div>
          </div>
        </div>
        <Button variant="secondary" size="md">
          Trocar cartão
        </Button>
      </section>

      {/* Notificações */}
      <section
        style={{
          background: 'white',
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 2px 12px rgba(27,58,45,.08)',
        }}
      >
        <Eyebrow>Notificações</Eyebrow>
        <h3
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: COLORS.dark,
            margin: '4px 0 18px',
          }}
        >
          O que você quer receber
        </h3>
        <div style={{ display: 'grid', gap: 14 }}>
          {[
            { k: 'lembrete' as const, label: 'Lembrete de limpeza (3 dias antes)' },
            { k: 'relatorio' as const, label: 'Relatório mensal disponível' },
            { k: 'alerta' as const, label: 'Alerta de queda de geração' },
            { k: 'promocoes' as const, label: 'Promoções e novidades' },
          ].map((row) => (
            <ToggleRow
              key={row.k}
              label={row.label}
              on={notif[row.k]}
              onToggle={() => setNotif((prev) => ({ ...prev, [row.k]: !prev[row.k] }))}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function FieldRow({
  label,
  value,
  action,
}: {
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: `1px solid ${COLORS.border}`,
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.muted,
            textTransform: 'uppercase',
            letterSpacing: '.08em',
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 14, color: COLORS.dark, fontWeight: 500 }}>{value}</span>
      </div>
      {action}
    </div>
  );
}

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        fontSize: 13,
        gap: 12,
      }}
    >
      <span style={{ color: COLORS.muted }}>{label}</span>
      <span style={{ color: COLORS.dark, fontWeight: 600, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function ToggleRow({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ fontSize: 14, color: COLORS.dark, fontWeight: 500 }}>{label}</span>
      <button
        onClick={onToggle}
        aria-pressed={on}
        style={{
          width: 46,
          height: 26,
          borderRadius: 9999,
          background: on ? COLORS.green : COLORS.border,
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background .2s',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: on ? 23 : 3,
            width: 20,
            height: 20,
            borderRadius: 9999,
            background: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            transition: 'left .2s',
          }}
        />
      </button>
    </div>
  );
}
