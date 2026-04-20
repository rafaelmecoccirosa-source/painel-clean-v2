'use client';

import { Button, COLORS, Particles, useIsMobile } from './shared';

export default function CTAFinal() {
  const isMobile = useIsMobile(768);

  return (
    <section
      style={{
        background: COLORS.dark,
        color: 'white',
        padding: isMobile ? '72px 20px' : '104px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Particles count={24} color="rgba(61,196,90,0.25)" />
      <div
        style={{
          maxWidth: 820,
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: '7px 16px',
            background: 'rgba(61,196,90,0.14)',
            border: '1px solid rgba(61,196,90,0.4)',
            borderRadius: 9999,
            color: '#6EE7A0',
            fontFamily: "'Open Sans',sans-serif",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
          }}
        >
          🎁 OFERTA DE LANÇAMENTO
        </span>

        <h2
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 900,
            fontSize: isMobile ? 'clamp(30px, 8vw, 42px)' : 'clamp(42px, 5vw, 56px)',
            lineHeight: 1.05,
            letterSpacing: '-.025em',
            color: 'white',
            margin: '20px 0 0',
            textWrap: 'balance',
          }}
        >
          Pare de pagar pela sujeira
          <br />
          do seu painel solar.
        </h2>

        <p
          style={{
            fontFamily: "'Open Sans',sans-serif",
            fontSize: isMobile ? 16 : 19,
            lineHeight: 1.55,
            color: 'rgba(255,255,255,0.78)',
            margin: '22px auto 0',
            maxWidth: 640,
            textWrap: 'pretty',
          }}
        >
          Assine hoje e ganhe{' '}
          <strong style={{ color: '#6EE7A0', fontWeight: 800 }}>50% off na 1ª limpeza</strong>. A partir de R$
          30/mês. Primeira visita em até 48h.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 14,
            marginTop: 36,
          }}
        >
          <Button
            variant="primary"
            size="xl"
            style={{
              fontSize: isMobile ? 16 : 18,
              padding: isMobile ? '16px 30px' : '18px 38px',
              boxShadow: '0 12px 36px rgba(61,196,90,0.45)',
            }}
          >
            Assinar agora →
          </Button>
          <Button variant="outline" size="lg">
            Falar com especialista
          </Button>
        </div>

        <div
          style={{
            marginTop: 36,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: isMobile ? '10px 18px' : '12px 28px',
            fontFamily: "'Open Sans',sans-serif",
            fontSize: 13,
            color: 'rgba(255,255,255,0.62)',
            fontWeight: 500,
          }}
        >
          <span>✓ 1ª limpeza em até 48h</span>
          <span>✓ PIX na hora</span>
          <span>✓ Contrato 12 meses</span>
          <span>✓ Seguro incluso</span>
        </div>
      </div>
    </section>
  );
}
