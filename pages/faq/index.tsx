import SubscriptionModal from '@/components/Common/Modal/SubscriptionModal';
import NavigationBar from '@/components/Common/NavigationBar';
import { FAQHero, FAQList } from '@/components/FAQPage';
import { WalletManagement } from '@/components/TaskListPageComponents';
import { useModal } from '@/hooks/useModal';
import { MODAL } from '@/types/ProvidersTypes';
import { FontSpaceMono } from '@/utils/typography';
import Head from 'next/head';
import { useState } from 'react';
import { useAccount } from 'wagmi';

const Page = () => {
  const [showUserCard, setShowUserCard] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { openModal } = useModal(MODAL.wallet);
  const { address } = useAccount();

  return (
    <>
      <Head>
        <title>Learn about Dojo Crowd Sourcing Platform for AI Model Development</title>
        <meta
          name="description"
          content="Learn about Dojo and how to get started. Crowd Sourcing and support Open Source AI Models (Bittensor Subnet, etc)"
        ></meta>
      </Head>
      <div className="h-full bg-background text-black">
        <div className="flex h-[320px] flex-col gap-4 border-b-2 border-black bg-background-accent">
          <NavigationBar openModal={() => setShowUserCard(true)} />
          <h1
            className={`${FontSpaceMono.className} px-4 text-center text-4xl font-bold tracking-wide text-font-primary`}
          >
            FREQUENTLY ASKED QUESTIONS
          </h1>
        </div>
        <FAQHero />
        <FAQList />
        {showUserCard && (
          <WalletManagement
            address={address || ''}
            openModal={openModal}
            closeModal={setShowUserCard}
            setShowUserCard={setShowUserCard}
            setShowSubscriptionCard={setIsModalVisible}
          />
        )}{' '}
        {isModalVisible && <SubscriptionModal setIsModalVisible={setIsModalVisible} isModalVisible={isModalVisible} />}
      </div>
    </>
  );
};

export default Page;
