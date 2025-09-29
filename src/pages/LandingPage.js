// src/pages/LandingPage.js
import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import QuickSearch from '../components/sections/QuickSearch';
import ValueProposition from '../components/sections/ValueProposition';
import SuccessStories from '../components/sections/SuccessStories';
import CTASection from '../components/sections/CTASection';

const LandingPage = () => {
  return (
    <main id="main-content">
      <HeroSection />
      <QuickSearch />
      <ValueProposition />
      <SuccessStories />
      <CTASection />
    </main>
  );
};

export default LandingPage;