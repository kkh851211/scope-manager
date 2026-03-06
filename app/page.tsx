import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { PainPoints } from '@/components/landing/PainPoints';
import { Solution } from '@/components/landing/Solution';
import { SocialProof } from '@/components/landing/SocialProof';
import { DemoPreview } from '@/components/landing/DemoPreview';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F1117]">
      <Header />
      <main>
        <Hero />
        <PainPoints />
        <Solution />
        <SocialProof />
        <DemoPreview />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
