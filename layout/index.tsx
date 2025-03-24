'use client';
import { CustomButton } from '@/components/Common/CustomComponents/button';
import SubscriptionModal from '@/components/Common/Modal/SubscriptionModal';
import UserCard from '@/components/Common/UserCard';
import Web3Icon from '@/components/Common/Wallet/web3-icon';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useEtherScanOpen } from '@/hooks/useEtherScanOpen';
import { useModal } from '@/hooks/useModal';
import { useAuth } from '@/providers/authContext';
import { MODAL } from '@/types/ProvidersTypes';
import { getFromLocalStorage } from '@/utils/general_helpers';
import { getFirstFourLastFour } from '@/utils/math_helpers';
import { tokenType } from '@/utils/states';
import { cn } from '@/utils/tw';
import { FontManrope, FontSpaceMono } from '@/utils/typography';
import { IconCopy, IconExternalLink } from '@tabler/icons-react';
import Head from 'next/head';
import React, { ReactNode, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import NavigationBar from '../components/Common/NavigationBar';

type LayoutProps = {
  children: ReactNode;
  showFooter?: boolean;
  isFullWidth?: boolean;
  headerText?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, showFooter = true, isFullWidth = false, headerText }) => {
  const { openModal } = useModal(MODAL.wallet);
  const [showUserCard, setShowUserCard] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleViewClick = () => {
    setShowUserCard(false);
    setIsModalVisible(true);
  };

  const walletManagementHandler = () => {
    openModal();
    setShowUserCard(false);
  };

  const { isConnected, address } = useAccount();
  const { isAuthenticated, frontendJWTIsValid, localLogin, workerLogout: localLogout } = useAuth();
  const handleCopy = useCopyToClipboard(address ?? '');
  const handleEtherscan = useEtherScanOpen(address ?? '', 'address');
  const { openModal: openInfoModal } = useModal(MODAL.informational);

  useEffect(() => {
    const token = getFromLocalStorage(tokenType);
    // disconnect();
    if (token && address) {
      const authState = frontendJWTIsValid(address, token);
      if (authState) {
        localLogin(token);
      } else {
        localLogout();
        openInfoModal({
          buttonMeta: {
            buttonSuccess: 'Sign In',
            buttonGroupClassName: 'flex justify-center',
            buttonSuccessFn: () => {
              openModal();
            },
          },
          headerTitle: 'Session Expired',
          content: (
            <div className="flex w-full max-w-[350px] text-center font-normal">
              Welcome back! Your previous session has expired, please sign in again.
            </div>
          ),
        });
      }
    }
  }, [address, frontendJWTIsValid, openInfoModal, openModal, isAuthenticated]);

  return (
    <>
      <Head>
        <title>Dojo - Improve Decentralized AI Model with Crowd Sourcing</title>
      </Head>
      <div className="flex min-h-screen max-w-screen-lg flex-col items-stretch overflow-x-hidden bg-primaryBG-bg text-black">
        <div className="border-b-2 border-black bg-ecru-white text-white">
          <NavigationBar openModal={() => setShowUserCard(true)} />
          {/* Title portion */}
          {headerText && (
            <div className="flex items-center justify-center px-4">
              <div className={cn('w-[1075px]')}>
                <h1
                  className={`mb-11 ${FontSpaceMono.className} mt-9 text-center text-4xl font-bold tracking-tight text-black`}
                >
                  {headerText}
                </h1>
              </div>
            </div>
          )}
        </div>
        <main className={cn(!isFullWidth && 'max-w-[1075px]', `w-full mx-auto grow flex flex-col`)}>{children}</main>
        {showFooter && <hr className=" border-black" />}
        {showUserCard && (
          <UserCard closeModal={setShowUserCard}>
            <div className="flex w-full flex-col gap-[5px] border-b-2  p-5 py-3.5">
              <div className="flex items-center justify-between ">
                <div className="flex items-center justify-start gap-[5px]">
                  <img className="aspect-square w-5" alt="i" src={'/wallet_logo/metamask_logo.svg'}></img>
                  <p className={`${FontManrope.className} font-bold`}>Metamask</p>
                </div>
                <div className=" inline-flex gap-2" onClick={walletManagementHandler}>
                  <span
                    className={`${FontManrope.className} flex w-fit items-center justify-start gap-2 overflow-hidden rounded-full p-[10px] text-black hover:cursor-pointer hover:bg-muted `}
                  >
                    <Web3Icon size={20} address={address ?? ''}></Web3Icon>
                    {getFirstFourLastFour(address ?? '')}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-start gap-[20px] pl-5">
                <CustomButton onClick={handleCopy} className="h-fit p-0 font-bold text-darkGreen" variant={'link'}>
                  <span className=" mr-[3px] text-xs underline underline-offset-2">COPY ADDRESS</span>{' '}
                  <IconCopy className="size-4" />
                </CustomButton>
                <CustomButton onClick={handleEtherscan} className="h-fit p-0 font-bold text-darkGreen" variant={'link'}>
                  <span className="mr-[3px] text-xs underline underline-offset-2">VIEW ON ETHERSCAN</span>{' '}
                  <IconExternalLink className="size-4" />
                </CustomButton>
              </div>
            </div>
            <div className="flex  w-full items-center justify-between border-b-2 p-4 text-sm">
              <h1 className={`${FontSpaceMono.className} font-bold uppercase`}>Subscription Keys</h1>
              <button
                className={`${FontSpaceMono.className} font-bold text-darkGreen underline`}
                onClick={handleViewClick}
              >
                VIEW
              </button>
            </div>
            <div className=" w-full px-4 py-5">
              <button
                onClick={walletManagementHandler}
                className={` focus-visible:ring-ring inline-flex h-[40px] w-full items-center justify-center whitespace-nowrap rounded-none border-2 border-black bg-primary px-4 py-2 text-xs text-white ring-offset-background transition-colors hover:cursor-pointer hover:bg-opacity-75 hover:shadow-brut-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none md:text-sm ${FontSpaceMono.className} text-base font-bold uppercase`}
              >
                Manage Wallet
              </button>
            </div>
          </UserCard>
        )}
        {isModalVisible && <SubscriptionModal setIsModalVisible={setIsModalVisible} isModalVisible={isModalVisible} />}
      </div>
    </>
  );
};

export default Layout;
