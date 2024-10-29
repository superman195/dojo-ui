import InformationalModal from '@/components/Common/InformationalModal';
import ManageWalletConnectModal from '@/components/Common/Wallet/manage-wallet-modal';
import { MODAL, ModalContextValue } from '@/types/ProvidersTypes';
import { FC, PropsWithChildren, createContext, memo, useCallback, useMemo, useState } from 'react';

export const ModalContext = createContext({} as ModalContextValue);

const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [active, setActive] = useState<MODAL | null>(null);
  const [modalOptions, setModalOptions] = useState<any>(null);

  const openModal = useCallback((modal: MODAL, modalOptions: any) => {
    setModalOptions(modalOptions);
    setActive(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActive(null);
    setModalOptions(null);
  }, []);

  const value = useMemo(
    () => ({
      openModal,
      closeModal,
    }),
    [closeModal, openModal]
  );

  const common = {
    onClose: closeModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {/* <WalletModal open={active === MODAL.wallet} {...common} /> */}
      <ManageWalletConnectModal
        open={active === MODAL.connect || active === MODAL.wallet}
        onClose={common.onClose}
        onSave={common.onClose}
      ></ManageWalletConnectModal>
      {/* <WalletsModalForEth
        open={active === MODAL.connect}
        metrics={walletsMetrics}
        hiddenWallets={['Opera Wallet']}
        {...common}
      /> */}
      <InformationalModal
        open={active === MODAL.informational}
        {...common}
        onClose={common.onClose}
        onSave={common.onClose}
        {...modalOptions}
      />
    </ModalContext.Provider>
  );
};

export default memo<FC<PropsWithChildren>>(ModalProvider);
