'use client';

import { COLORS, Counter, useIsMobile } from './shared';

type Stat = {
  val: number;
  suffix: string;
  label: string;
  format?: (n: number) => string;
};

export default function StatsBar() {
  const isMobile = useIsMobile(768);

  const stats: Stat[] = [
    { val: 2400, suffix: '+', label: 'usinas monitoradas' },
    { val: 180, suffix: '+', label: 'técnicos certificados' },
    {
      val: 49,
      suffix: '★',
      label: 'avaliação média',
      format: (n: number) => (n / 10).toFixed(1).replace('.', ','),
    },
    { val: 13, suffix: '', label: 'cidades em SC' },
  ];

  return (
    <section
      style={{
        background: 'white',
        borderBottom: `1px solid ${COLORS.border}`,
        padding: isMobile ? '28px 20px' : '32px 32px',
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? 20 : 28,
          textAlign: 'center',
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              position: 'relative',
              padding: isMobile ? '0' : '0 16px',
              borderRight: !isMobile && i < stats.length - 1 ? `1px solid ${COLORS.border}` : 'none',
            }}
          >
            <div
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 900,
                fontSize: isMobile ? 30 : 40,
                lineHeight: 1,
                letterSpacing: '-.025em',
                color: COLORS.dark,
              }}
            >
              <Counter to={s.val} format={s.format} />
              <span style={{ color: COLORS.green }}>{s.suffix}</span>
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: "'Open Sans',sans-serif",
                fontSize: isMobile ? 11.5 : 13,
                fontWeight: 600,
                color: COLORS.muted,
                letterSpacing: '.02em',
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
