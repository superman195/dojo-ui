'use client';
import { HTMLAttributes } from 'react';

import { useModal } from '@/hooks/useModal';
import { MODAL } from '@/types/ProvidersTypes';
import { cn } from '@/utils/tw';
import { FontSpaceMono } from '@/utils/typography';
import { CustomButton } from '../CustomComponents/button';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const WalletConnect = (props: Props) => {
  const { onClick, style, className, ...rest } = props;
  const { openModal } = useModal(MODAL.wallet);

  return (
    <>
      <CustomButton
        className={cn(
          FontSpaceMono.className,
          'px-3 text-xs !h-[40px] hover:text-font-secondary md:text-sm bg-transparent text-font-primary hover:bg-primary rounded-sm border-[2px] border-black hover:shadow-brut-sm',
          className
        )}
        onClick={openModal}
      >
        CONNECT WALLET
      </CustomButton>
    </>
  );
};

export default WalletConnect;
