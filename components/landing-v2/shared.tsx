'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type ButtonHTMLAttributes, type RefObject } from 'react';

export const COLORS = {
  dark: '#1B3A2D',
  darkHover: '#142C22',
  green: '#3DC45A',
  greenHover: '#2DAF4A',
  light: '#EBF3E8',
  bg: '#F4F8F2',
  border: '#C8DFC0',
  muted: '#7A9A84',
  amberBg: '#FEF3C7',
  amberBorder: '#FDE68A',
  amberText: '#B45309',
  amberTextDark: '#92400E',
} as const;

export const LOGO_WHITE = '/landing-v2-logo-white.png';
export const LOGO_DARK = '/landing-v2-logo-dark.png';
export const LOGO_MARK = '/landing-v2-logo-mark.jpg';
export const HERO_PHOTO = '/hero-solar-v2.png';

export function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'xl';

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  style = {},
  fullWidth,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...p
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Open Sans',sans-serif",
    fontWeight: 600,
    transition: 'all .15s ease',
    whiteSpace: 'nowrap',
    width: fullWidth ? '100%' : undefined,
    transform: press ? 'scale(0.98)' : hover ? 'translateY(-1px)' : 'none',
  };
  const variants: Record<Variant, CSSProperties> = {
    primary: {
      background: hover ? COLORS.greenHover : COLORS.green,
      color: 'white',
      boxShadow: hover ? '0 6px 18px rgba(61,196,90,0.35)' : '0 2px 8px rgba(61,196,90,0.25)',
    },
    secondary: {
      background: 'white',
      color: COLORS.dark,
      border: `1px solid ${COLORS.border}`,
      boxShadow: hover ? '0 4px 12px rgba(27,58,45,0.10)' : 'none',
    },
    ghost: { background: hover ? COLORS.light : 'transparent', color: COLORS.dark },
    dark: {
      background: hover ? COLORS.darkHover : COLORS.dark,
      color: 'white',
      boxShadow: hover ? '0 6px 18px rgba(27,58,45,0.35)' : '0 2px 8px rgba(27,58,45,0.2)',
    },
    outline: {
      background: hover ? 'rgba(255,255,255,0.12)' : 'transparent',
      color: 'white',
      border: '1.5px solid rgba(255,255,255,0.6)',
    },
  };
  const sizes: Record<Size, CSSProperties> = {
    sm: { padding: '8px 14px', fontSize: 13, borderRadius: 8 },
    md: { padding: '11px 20px', fontSize: 14, borderRadius: 12 },
    lg: { padding: '14px 26px', fontSize: 15.5, borderRadius: 14 },
    xl: { padding: '16px 32px', fontSize: 17, borderRadius: 14 },
  };
  return (
    <button
      onMouseEnter={(e) => { setHover(true); onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHover(false); setPress(false); onMouseLeave?.(e); }}
      onMouseDown={(e) => { setPress(true); onMouseDown?.(e); }}
      onMouseUp={(e) => { setPress(false); onMouseUp?.(e); }}
      style={{ ...base, ...variants[variant], ...sizes[size], ...style }}
      {...p}
    >
      {children}
    </button>
  );
}

type BadgeTone = 'light' | 'green' | 'greenSoft' | 'amber' | 'red' | 'blue' | 'emerald' | 'dark';

export function Badge({
  tone = 'light',
  children,
  style = {},
}: {
  tone?: BadgeTone;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const tones: Record<BadgeTone, CSSProperties> = {
    light: { background: COLORS.light, color: COLORS.dark },
    green: { background: COLORS.green, color: 'white' },
    greenSoft: { background: '#DCFCE7', color: '#166534' },
    amber: { background: '#FEF9C3', color: '#A16207' },
    red: { background: '#FEE2E2', color: '#B91C1C' },
    blue: { background: '#DBEAFE', color: '#1D4ED8' },
    emerald: { background: '#ECFDF5', color: '#059669' },
    dark: { background: 'rgba(255,255,255,0.14)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' },
  };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 12px',
        borderRadius: 9999,
        fontSize: 11.5,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
        ...tones[tone],
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  style = {},
  hoverable = false,
  padding = 24,
  onClick,
}: {
  children: ReactNode;
  style?: CSSProperties;
  hoverable?: boolean;
  padding?: number | string;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => hoverable && setHover(true)}
      onMouseLeave={() => hoverable && setHover(false)}
      onClick={onClick}
      style={{
        background: 'white',
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding,
        boxShadow: hover ? '0 12px 32px rgba(27,58,45,0.14)' : '0 2px 12px rgba(27,58,45,0.06)',
        transition: 'box-shadow .25s ease, transform .25s ease',
        transform: hover ? 'translateY(-4px)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  color = COLORS.green,
  style = {},
}: {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <p
      style={{
        fontFamily: "'Open Sans',sans-serif",
        fontWeight: 700,
        fontSize: 12,
        color,
        textTransform: 'uppercase',
        letterSpacing: '.12em',
        margin: 0,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

export function SectionHeadline({
  eyebrow,
  title,
  subtitle,
  center = true,
  dark = false,
  style = {},
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  center?: boolean;
  dark?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        textAlign: center ? 'center' : 'left',
        maxWidth: center ? 720 : 'none',
        margin: center ? '0 auto' : 0,
        ...style,
      }}
    >
      {eyebrow && <Eyebrow color={dark ? '#6EE7A0' : COLORS.green}>{eyebrow}</Eyebrow>}
      <h2
        style={{
          fontFamily: "'Montserrat',sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(28px, 4vw, 42px)',
          letterSpacing: '-.02em',
          lineHeight: 1.18,
          color: dark ? 'white' : COLORS.dark,
          margin: '10px 0 0',
          textWrap: 'balance',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: 'clamp(15px, 1.4vw, 17px)',
            lineHeight: 1.6,
            color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(27,58,45,0.65)',
            margin: '16px 0 0',
            textWrap: 'pretty',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Particles({
  count = 16,
  color = 'rgba(61,196,90,0.35)',
}: {
  count?: number;
  color?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const dots = Array.from({ length: count }, (_, i) => {
    const size = 3 + Math.random() * 5;
    return (
      <span
        key={i}
        style={{
          position: 'absolute',
          bottom: -10,
          left: `${Math.random() * 100}%`,
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
          animation: `pc-rise ${6 + Math.random() * 6}s linear ${Math.random() * 6}s infinite`,
        }}
      />
    );
  });
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {dots}
    </div>
  );
}

export function LogoLockup({
  inverted = false,
  showTagline = true,
}: {
  inverted?: boolean;
  showTagline?: boolean;
}) {
  const mark = inverted ? LOGO_WHITE : LOGO_DARK;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mark}
        alt="Painel Clean"
        style={{ width: 44, height: 44, objectFit: 'contain', display: 'block' }}
      />
      <div style={{ lineHeight: 1 }}>
        <div
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 800,
            fontSize: 20,
            color: inverted ? 'white' : COLORS.dark,
            letterSpacing: '-.015em',
            whiteSpace: 'nowrap',
          }}
        >
          Painel Clean
        </div>
        {showTagline && (
          <div
            style={{
              fontFamily: "'Open Sans',sans-serif",
              fontWeight: 600,
              fontSize: 10.5,
              color: inverted ? 'rgba(255,255,255,0.7)' : COLORS.muted,
              letterSpacing: '.06em',
              textTransform: 'uppercase',
              marginTop: 4,
              whiteSpace: 'nowrap',
            }}
          >
            Limpeza e cuidado para usinas solares
          </div>
        )}
      </div>
    </div>
  );
}

export function SunDotLogo({ size = 24 }: { size?: number }) {
  const dots: ReactNode[] = [];
  const cx = size / 2;
  const cy = size / 2;
  dots.push(<circle key="c" cx={cx} cy={cy} r={2.4} fill={COLORS.green} />);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    dots.push(
      <circle
        key={i}
        cx={cx + Math.cos(a) * 7}
        cy={cy + Math.sin(a) * 7}
        r={1.6}
        fill={COLORS.green}
        opacity={0.9}
      />,
    );
  }
  return (
    <svg width={size} height={size}>
      {dots}
    </svg>
  );
}

export function useInView<T extends Element>(ref: RefObject<T>, threshold = 0.2) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

export function Counter({
  to,
  prefix = '',
  suffix = '',
  duration = 1200,
  format = (n: number) => n.toLocaleString('pt-BR'),
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {format(n)}
      {suffix}
    </span>
  );
}
