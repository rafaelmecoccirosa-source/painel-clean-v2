import { COLORS } from '@/lib/brand-tokens';

export default function ClienteHomePlaceholder() {
  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 28px', textAlign: 'center' }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>☀️</div>
      <h1
        style={{
          fontFamily: "'Montserrat',sans-serif",
          fontWeight: 800,
          fontSize: 28,
          color: COLORS.dark,
          letterSpacing: '-.02em',
          margin: 0,
        }}
      >
        Dashboard em construção
      </h1>
      <p style={{ fontSize: 14, color: COLORS.muted, marginTop: 8 }}>
        Próxima fase: hero dinâmico + stat cards + histórico.
      </p>
    </main>
  );
}
