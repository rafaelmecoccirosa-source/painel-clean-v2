'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, Eyebrow } from '@/components/landing-v2/shared';
import { COLORS } from '@/lib/brand-tokens';
import HeroCard from '@/components/cliente/HeroCard';
import { NextCleaningCard, PlanoAtivoCard, EconomiaCard } from '@/components/cliente/StatCards';
import ReagendarModal from '@/components/cliente/ReagendarModal';
import { MOCK_CLIENTE, MOCK_HISTORICO, daysUntil, formatDateBR } from '@/lib/mock-cliente';

export default function ClienteHomeView() {
  const [reagendarOpen, setReagendarOpen] = useState(false);

  const c = MOCK_CLIENTE;
  const userFirst = c.nome.split(' ')[0];
  const proximaLimpezaDias = daysUntil(c.proximaLimpeza);
  const proximaLimpezaData = formatDateBR(c.proximaLimpeza);

  return (
    <>
      <main
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '32px 28px 72px',
          display: 'grid',
          gap: 24,
        }}
      >
        <HeroCard
          state={c.heroState}
          userFirst={userFirst}
          plano={c.plano}
          proximaLimpezaDias={proximaLimpezaDias}
          proximaLimpezaData={proximaLimpezaData}
          tecnico={c.tecnico}
          eficiencia={c.eficienciaAtual}
          geracao={c.geracao}
          geracaoMeta={c.geracaoMeta}
          mesRelatorio="março"
          onReagendar={() => setReagendarOpen(true)}
        />

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          <NextCleaningCard
            dias={proximaLimpezaDias}
            data={proximaLimpezaData}
            turno={c.proximaLimpezaTurno}
            cidade={c.cidade}
            onReagendar={() => setReagendarOpen(true)}
          />
          <PlanoAtivoCard
            plano={c.plano}
            valor={c.mensalidade}
            usadas={c.limpezasUsadas}
            total={c.limpezasTotal}
          />
          <EconomiaCard total={c.economiaAcumulada} delta={95} />
        </section>

        <HistorySection />

        <AvulsaFooterCTA />
      </main>

      <ReagendarModal
        open={reagendarOpen}
        onClose={() => setReagendarOpen(false)}
        atualData={proximaLimpezaData}
        atualTurno={c.proximaLimpezaTurno}
        tecnico={c.tecnico}
      />
    </>
  );
}

function HistorySection() {
  const rows = MOCK_HISTORICO.slice(0, 2);
  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <h3
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 800,
              fontSize: 20,
              color: COLORS.dark,
              margin: 0,
              letterSpacing: '-.015em',
            }}
          >
            Histórico de serviços
          </h3>
          <p style={{ fontSize: 13, color: COLORS.muted, margin: '3px 0 0' }}>
            {MOCK_HISTORICO.length} limpezas realizadas desde o início da assinatura
          </p>
        </div>
        <Link href="/cliente/historico" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="sm">
            Ver tudo →
          </Button>
        </Link>
      </div>
      <div
        style={{
          background: 'white',
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(27,58,45,.08)',
        }}
      >
        {rows.map((row, i) => (
          <HistoryRow key={row.id} row={row} last={i === rows.length - 1} />
        ))}
      </div>
    </section>
  );
}

function HistoryRow({ row, last }: { row: (typeof MOCK_HISTORICO)[number]; last: boolean }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '44px 1fr auto auto auto',
        gap: 18,
        alignItems: 'center',
        padding: '16px 22px',
        borderBottom: last ? 'none' : `1px solid ${COLORS.border}`,
        background: 'white',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: COLORS.light,
          color: COLORS.green,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
        }}
      >
        {row.tipo === 'assinatura' ? '☀️' : '⚡'}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.dark }}>{row.titulo}</div>
        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 3 }}>
          {formatDateBR(row.data)} · {row.tecnico}
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: COLORS.green,
          background: COLORS.light,
          padding: '4px 10px',
          borderRadius: 9999,
        }}
      >
        {row.ganho} geração
      </div>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 9999,
          fontSize: 11,
          fontWeight: 700,
          background: '#ECFDF5',
          color: '#059669',
          whiteSpace: 'nowrap',
        }}
      >
        Concluído
      </span>
      <Button variant="secondary" size="sm">
        Ver PDF
      </Button>
    </div>
  );
}

function AvulsaFooterCTA() {
  return (
    <section>
      <div
        style={{
          background: COLORS.light,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: 24,
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
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'white',
              border: `1px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            ⚡
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: COLORS.dark,
                letterSpacing: '-.005em',
              }}
            >
              Precisa de uma limpeza antes do agendamento?
            </div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>
              Avulsa a partir de R$ 108 para assinantes · 40% off do preço normal
            </div>
          </div>
        </div>
        <Link href="/cliente/avulsa" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="lg">
            Solicitar avulsa →
          </Button>
        </Link>
      </div>
    </section>
  );
}
