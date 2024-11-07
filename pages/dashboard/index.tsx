import MainFooter from '@/components/Common/Footer/MainFooter';
import SubscriptionModal from '@/components/Common/Modal/SubscriptionModal';
import DashboardGraphAndMetrics from '@/components/DashboardPageComponents/DashboardGraphAndMetrics';
import DashboardHeader from '@/components/DashboardPageComponents/DashboardHeader';
import LeaderboardSection from '@/components/DashboardPageComponents/LeaderboardSection';
import { WalletManagement } from '@/components/TaskListPageComponents';
import { useModal } from '@/hooks/useModal';
import useSubnetMetagraph from '@/hooks/useSubnetMetaGraph';
import { MODAL } from '@/types/ProvidersTypes';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const DashboardPage = () => {
  const { data: subnetData, loading, error } = useSubnetMetagraph(52);
  const [showUserCard, setShowUserCard] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
        <LeaderboardSection
          miners={
            subnetData?.nonRootNeurons.map((neuron) => ({
              ...neuron,
              performanceData: neuron.historicalEmissions?.map((e) => e.emission) ?? [],
            })) || []
          }
          validators={
            subnetData?.nonRootNeurons.map((neuron) => ({
              ...neuron,
              performanceData: neuron.historicalEmissions?.map((e) => e.emission) ?? [],
            })) || []
          }
          loading={loading}
          error={error}
        />
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

export default DashboardPage;
