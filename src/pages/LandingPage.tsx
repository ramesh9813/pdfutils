import React from 'react';
import { LandingHero } from '../components/landing/LandingHero';
import { ToolBentoGrid } from '../components/landing/ToolBentoGrid';
import { LandingTrustSection } from '../components/landing/LandingTrustSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-10 py-4 sm:py-8">
      <LandingHero />
      <ToolBentoGrid />
      <LandingTrustSection />
    </div>
  );
};
