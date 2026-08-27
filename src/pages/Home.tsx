import Hero from '@/components/sections/Hero';
import Properties from '@/components/sections/Properties';
import ServicesOverview from '@/components/sections/ServicesOverview';
import StatsBar from '@/components/sections/StatsBar';
import OurProjects from '@/components/sections/OurProjects';
import Portfolio from '@/components/sections/Portfolio';
import Testimonials from '@/components/sections/Testimonials';
import FaqSection from '@/components/sections/FaqSection';
import FinalCTA from '@/components/sections/FinalCTA';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Home() {
  useScrollReveal();
  return (
    <>
      <Hero />
      <Properties />
      <ServicesOverview />
      <StatsBar />
      <OurProjects />
      <Portfolio />
      <Testimonials />
      <FaqSection />
      <FinalCTA />
    </>
  );
}
