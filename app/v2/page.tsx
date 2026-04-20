import Calculator from '@/components/landing-v2/Calculator';
import Coverage from '@/components/landing-v2/Coverage';
import CTAFinal from '@/components/landing-v2/CTAFinal';
import DashboardPreview from '@/components/landing-v2/DashboardPreview';
import Differentiators from '@/components/landing-v2/Differentiators';
import FAQ from '@/components/landing-v2/FAQ';
import Footer from '@/components/landing-v2/Footer';
import Header from '@/components/landing-v2/Header';
import Hero from '@/components/landing-v2/Hero';
import HowItWorks from '@/components/landing-v2/HowItWorks';
import Plans from '@/components/landing-v2/Plans';
import StatsBar from '@/components/landing-v2/StatsBar';
import TechB2B from '@/components/landing-v2/TechB2B';
import TechDiff from '@/components/landing-v2/TechDiff';
import Testimonials from '@/components/landing-v2/Testimonials';

export default function LandingV2Page() {
  return (
    <main>
      <Header />
      <Hero />
      <StatsBar />
      <Calculator />
      <DashboardPreview />
      <HowItWorks />
      <TechDiff />
      <Differentiators />
      <Testimonials />
      <Plans />
      <Coverage />
      <FAQ />
      <CTAFinal />
      <TechB2B />
      <Footer />
    </main>
  );
}
