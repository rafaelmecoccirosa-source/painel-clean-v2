import type { Metadata } from 'next';
import './landing-v2.css';

export const metadata: Metadata = {
  title: 'Painel Clean — Sua usina solar merece cuidado todo mês',
  description:
    'Assinatura mensal de limpeza e monitoramento de painéis solares em Santa Catarina. A partir de R$ 30/mês. 1ª limpeza com 50% off.',
};

export default function LandingV2Layout({ children }: { children: React.ReactNode }) {
  return <div className="landing-v2-root">{children}</div>;
}
