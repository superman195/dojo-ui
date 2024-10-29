import { ModalContext } from '@/providers/modals';
import { MODAL } from '@/types/ProvidersTypes';
import { useCallback, useContext } from 'react';

type UseModal = (modal: MODAL) => {
  openModal: (modalOptions?: any) => void;
  closeModal: () => void;
};

export const useModal: UseModal = (modal) => {
  const methods = useContext(ModalContext);

  const openModal = useCallback(
    (modalOptions: any) => {
      methods.openModal(modal, modalOptions);
    },
    [methods, modal]
  );

  return {
    openModal,
    closeModal: methods.closeModal,
  };
};
