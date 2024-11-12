import {
  HeroCardSection,
  HowToGetStartedSection,
  KeyMessageSlides,
  LandingPageLayout,
  RoadMapSection,
} from '@/components/HomePageComponents';
import AnimatedFlowChart from '@/components/HomePageComponents/AnimatedFlowChart';

const Index = () => {
  return (
    <LandingPageLayout>
      <HeroCardSection />
      <KeyMessageSlides />
      <AnimatedFlowChart />
      <HowToGetStartedSection />
      <RoadMapSection />
    </LandingPageLayout>
  );
};

export default Index;
