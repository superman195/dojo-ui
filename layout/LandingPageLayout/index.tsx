import MainFooter from '@/components/Common/Footer/MainFooter';
import NavigationBar from '@/components/Common/NavigationBar';
import Head from 'next/head';
import { ReactNode } from 'react';

const LandingPageLayout = ({ children }: { children: ReactNode }) => (
  <>
    <Head>
      <title>Dojo - Improve Decentralized AI Model with Crowd Sourcing</title>
    </Head>
    <div className="min-h-screen bg-[#FFFFF4] text-black">
      <div className="border-b-2 border-black bg-[#F6F6E6] text-white">
        <NavigationBar openModal={() => {}} isHomePage />
      </div>
      <main className="mx-auto">{children}</main>
      <MainFooter />
    </div>
  </>
);

export default LandingPageLayout;
