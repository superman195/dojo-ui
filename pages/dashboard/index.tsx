'use client';
import MainFooter from '@/components/Common/Footer/MainFooter';
import SubscriptionModal from '@/components/Common/Modal/SubscriptionModal';
import DashboardGraphAndMetrics from '@/components/DashboardPageComponents/DashboardGraphAndMetrics';
import DashboardHeader from '@/components/DashboardPageComponents/DashboardHeader';
import LeaderboardSection from '@/components/DashboardPageComponents/LeaderboardSection';
import { WalletManagement } from '@/components/TaskListPageComponents';
import { useModal } from '@/hooks/useModal';
import useSubnetMetagraph from '@/hooks/useSubnetMetaGraph';
import { NonRootNeuronObj } from '@/types/DashboardTypes';
import { MODAL } from '@/types/ProvidersTypes';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface Delegate {
  id: string;
  name: string;
}

interface Props {
  delegates: Delegate[];
}

const DashboardPage: React.FC<Props> = ({ delegates }) => {
  const { data: subnetData, loading, error } = useSubnetMetagraph(52);
  const [showUserCard, setShowUserCard] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [minerData, setMinerData] = useState<NonRootNeuronObj[]>([]);
  const [validatorData, setValidatorData] = useState<NonRootNeuronObj[]>([]);
  const delegateKeys = Object.keys(delegates);

  useEffect(() => {
    const miners: NonRootNeuronObj[] = [];
    const validators: NonRootNeuronObj[] = [];

    subnetData?.nonRootNeurons.forEach((data) => {
      const matchedValidator = delegateKeys.find((key) => key === data.hotkey);
      if (matchedValidator) {
        console.log(matchedValidator);
        validators.push(data);
      } else {
        miners.push(data);
      }
    });
    setMinerData(miners);
    setValidatorData(validators);
  }, [delegates, subnetData]);
  const { openModal } = useModal(MODAL.wallet);
  const { address } = useAccount();

  const jwtTokenKey = `${process.env.NEXT_PUBLIC_REACT_APP_ENVIRONMENT}__jwtToken`;
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'wagmi.io.metamask.disconnected' || event.key === jwtTokenKey) {
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [jwtTokenKey]);

  return (
    <div
      className="min-h-screen text-black"
      style={{
        background: 'linear-gradient(to bottom, #FFFFF4 0%, #E1F5F4 54%, #FEFFF5 100%)',
      }}
    >
      <DashboardHeader setShowUserCard={setShowUserCard} />
      <main className="mx-5 mt-5 max-w-4xl lg:mx-auto xl:mx-auto">
        <DashboardGraphAndMetrics subnetData={subnetData} loading={loading} error={error} />
        <LeaderboardSection miners={minerData} validators={validatorData} loading={loading} error={error} />
      </main>
      {showUserCard && (
        <WalletManagement
          address={address || ''}
          openModal={openModal}
          closeModal={setShowUserCard}
          setShowUserCard={setShowUserCard}
          setShowSubscriptionCard={setIsModalVisible}
        />
      )}
      {isModalVisible && <SubscriptionModal setIsModalVisible={setIsModalVisible} isModalVisible={isModalVisible} />}
      <MainFooter />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(
    'https://raw.githubusercontent.com/opentensor/bittensor-delegates/refs/heads/main/public/delegates.json'
  );
  const delegates = await res.json();
  return {
    props: {
      delegates,
    },
  };
};

export default DashboardPage;
