'use client';

import { useSIWE } from '@/hooks/useSIWE';
import { useAuth } from '@/providers/authContext';
import { cn } from '@/utils/tw';
import { FontSpaceMono } from '@/utils/typography';
import { Connector, useAccount, useChainId, useConnect } from 'wagmi';
import ModalContainer from '../Modal/ModalContainer';
import WalletConnectedCard from './wallet-connected-card';
import WalletNetworkCard from './walletnetwork-card';
interface Props {
  open: boolean;
  onSave?: () => void;
  onClose?: () => void;
}

const getConnectorById = (connectors: readonly Connector[], connectorId: string) => {
  return connectors.find((connector) => connector.id === connectorId);
};

const allowedNetwork: number[] = [1, 42161, 10, 8453];

const ManageWalletConnectModal = ({ open, onSave, onClose, ...props }: Props) => {
  const { connectors, connectAsync, connect } = useConnect();
  const { connector, address, status, isConnected } = useAccount();
  const { signInWithEthereum } = useSIWE(() => {});
  const { isAuthenticated } = useAuth();
  const chainId = useChainId();

  const connectWalletHandler = async (connectorId: string) => {
    const connector = getConnectorById(connectors, connectorId);
    if (!connector) {
      console.error('Failed to find connector');
      return;
    }
    if (isConnected && address) {
      signInWithEthereum(address ?? '');
      return;
    }
    try {
      const { accounts } = await connectAsync({ connector, chainId });
      if (!accounts.length) {
        throw new Error('No accounts returned');
      } else {
        signInWithEthereum(accounts[0]);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
    }
  };

  return (
    <ModalContainer
      header={'MANAGE WALLET'}
      open={open}
      onSave={() => {
        onSave?.();
      }}
      onClose={() => {
        onClose?.();
      }}
      bodyClassName="p-0"
      className="w-[90%] sm:max-w-[420px]"
    >
      <div className="flex min-w-full max-w-[410px] flex-col">
        {status === 'connected' && connector && isAuthenticated && (
          <WalletConnectedCard connector={connector} address={address}></WalletConnectedCard>
        )}
        <div className="flex w-full flex-col p-2 pb-[31px]">
          <span className={cn(FontSpaceMono.className, 'font-bold text-xs')}>CHOOSE WALLET</span>
          <div className="flex min-w-fit flex-wrap items-stretch gap-[10px] pt-[3px] sm:flex-nowrap">
            <WalletNetworkCard
              // disabled={!getConnectorById(connectors, 'io.metamask') || status === 'connected' }
              onClick={() => {
                connectWalletHandler('io.metamask');
              }}
              logo="/wallet_logo/metamask_logo.svg"
              Description="Metamask"
            ></WalletNetworkCard>
            <WalletNetworkCard
              disabled={true}
              logo="/wallet_logo/walletconnect_blue_logo.svg"
              Description="WalletConnect"
            ></WalletNetworkCard>
            <WalletNetworkCard
              disabled={!getConnectorById(connectors, 'io.rabby') || status === 'connected'}
              onClick={() => {
                connectWalletHandler('io.rabby');
              }}
              logo="/wallet_logo/rabbywallet_logo.svg"
              Description="Rabby"
            ></WalletNetworkCard>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ManageWalletConnectModal;
