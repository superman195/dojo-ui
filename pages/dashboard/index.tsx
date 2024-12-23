'use client';
import MainFooter from '@/components/Common/Footer/MainFooter';
import SubscriptionModal from '@/components/Common/Modal/SubscriptionModal';
import DashboardGraphAndMetrics from '@/components/DashboardPageComponents/DashboardGraphAndMetrics';
import LeaderboardSection from '@/components/DashboardPageComponents/LeaderboardSection';
import { WalletManagement } from '@/components/TaskListPageComponents';
import { useModal } from '@/hooks/useModal';
import useSubnetMetagraph from '@/hooks/useSubnetMetaGraph';
import Layout from '@/layout';
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
      const totalEmission = data.historicalEmissions.reduce((sum, { emission }) => sum + emission, 0);
      const neuronWithEmission = { ...data, totalEmission };

      const matchedValidator = delegateKeys.find((key) => key === data.hotkey);
      if (matchedValidator) {
        validators.push(neuronWithEmission);
      } else {
        miners.push(neuronWithEmission);
      }
    });

    setMinerData(miners);
    setValidatorData(validators);
  }, [delegates, subnetData]);
  const { openModal } = useModal(MODAL.wallet);
  const { address } = useAccount();

  return (
    <Layout isFullWidth headerText={'Dashboard'}>
      <main className="px-4">
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
    </Layout>
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
