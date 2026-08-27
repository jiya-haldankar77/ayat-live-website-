import LaunchPackages from '@/components/sections/LaunchPackages';
import DeveloperRetainer from '@/components/sections/DeveloperRetainer';
import TurnkeyBuilding from '@/components/sections/TurnkeyBuilding';
import SecureBuy from '@/components/sections/SecureBuy';
import MediaProduction from '@/components/sections/MediaProduction';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function ServicesPage() {
  useScrollReveal();
  return (
    <div className="bg-white pt-16">
      <div className="bg-cream py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">WHAT WE DO</p>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-stone-900">Our Services</h1>
          <p className="mt-5 text-stone-600 leading-relaxed">From cinematic content to data-driven campaigns, we deliver every element needed to position your property for success in Goa's competitive market.</p>
        </div>
      </div>
      <LaunchPackages />
      <MediaProduction />
      <DeveloperRetainer />
      <TurnkeyBuilding />
      <SecureBuy />
    </div>
  );
}
