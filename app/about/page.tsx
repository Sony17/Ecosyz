'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';

import FeatureCards from '../components/FeatureCards';
import PurposeSection from '../components/PurposeSection';
import UniquePoints from '../components/UniquePoints';
import ResourcesSection from '../components/ResourcesSection';
import ImpactSection from '../components/ImpactSection';
import ChallengesSection from '../components/ChallengesSection';
import TechnologySection from '../components/TechnologySection';
import CommunitySection from '../components/CommunitySection';
import JoinRevolution from '../components/JoinRevolution';
import FAQSection from '../components/FAQSection';
import FinalCTA from '../components/FinalCTA';

export default function About() {
  return (
    <div>
     <Header/>
      <FeatureCards />
      <PurposeSection />
      <UniquePoints />
      <ResourcesSection />
      <ImpactSection />
      <ChallengesSection />
      <TechnologySection />
      <CommunitySection />
      <JoinRevolution />
      <FAQSection />
      <FinalCTA />
      <Footer/>
    </div>
  );
}
