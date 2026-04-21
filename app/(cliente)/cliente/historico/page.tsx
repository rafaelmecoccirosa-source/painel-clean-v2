import { Button, Eyebrow } from '@/components/landing-v2/shared';
import { COLORS } from '@/lib/brand-tokens';
import EficienciaChart from '@/components/cliente/charts/EficienciaChart';
import ImpactoChart from '@/components/cliente/charts/ImpactoChart';
import { MOCK_HISTORICO, formatDateBR } from '@/lib/mock-cliente';

export default function HistoricoPage() {
  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 28px 72px', display: 'grid', gap: 24 }}>
      <div>
        <Eyebrow>Histórico completo</Eyebrow>
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
          Todos os serviços da sua usina
        </h1>
      </div>

      <section
        className="fade-up fade-up-1"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
      >
        <ChartCard eyebrow="Eficiência ao longo do tempo" title="Evolução em 12 meses">
          <EficienciaChart />
        </ChartCard>
        <ChartCard eyebrow="Impacto das limpezas" title="Geração antes e depois">
          <ImpactoChart />
        </ChartCard>
      </section>

      <section className="fade-up fade-up-2">
        <Eyebrow>Tabela completa</Eyebrow>
        <h3
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: COLORS.dark,
            margin: '4px 0 16px',
            letterSpacing: '-.01em',
          }}
        >
          Serviços realizados
        </h3>
        <div
          style={{
            background: 'white',
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(27,58,45,.08)',
          }}
        >
          {MOCK_HISTORICO.map((row, i) => (
            <div
              key={row.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '44px 1fr auto auto auto',
                gap: 18,
                alignItems: 'center',
                padding: '16px 22px',
                borderBottom: i < MOCK_HISTORICO.length - 1 ? `1px solid ${COLORS.border}` : 'none',
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
          ))}
        </div>
      </section>
    </main>
  );
}

function ChartCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'white',
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 2px 12px rgba(27,58,45,.08)',
      }}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h3
        style={{
          fontFamily: "'Montserrat',sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: COLORS.dark,
          margin: '4px 0 16px',
          letterSpacing: '-.01em',
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
