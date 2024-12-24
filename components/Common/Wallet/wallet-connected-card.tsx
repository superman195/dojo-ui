import { BrutCard } from '@/components/Common/CustomComponents/brut-card';
import { CustomButton } from '@/components/Common/CustomComponents/button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useEtherScanOpen } from '@/hooks/useEtherScanOpen';
import { useAuth } from '@/providers/authContext';
import { clearLocalStorage } from '@/utils/general_helpers';
import { getFirstFourLastFour } from '@/utils/math_helpers';
import { cn } from '@/utils/tw';
import { FontManrope, FontSpaceMono } from '@/utils/typography';
import { IconCopy, IconExternalLink } from '@tabler/icons-react';
import { Connector, useDisconnect } from 'wagmi';
import Web3Icon from './web3-icon';

interface Props {
  connector: Connector;
  address?: string;
}
const WalletConnectedCard = ({ connector, address }: Props) => {
  const { disconnectAsync } = useDisconnect();
  const handleCopy = useCopyToClipboard(address ?? '');
  const handleEtherscan = useEtherScanOpen(address ?? '', 'address');
  const { workerLogout } = useAuth();
  const disconnectHandler = async () => {
    try {
      const result = await disconnectAsync();
      clearLocalStorage();
      workerLogout();
    } catch (err) {
      console.error('Error in disconnecting', err);
    }

    //Do disconenct to your backend here as well.
  };

  return (
    <div className="p-2 text-xs sm:text-base">
      <span className={cn(FontSpaceMono.className, 'text-xs font-bold')}>CONNECTED WALLET</span>
      <BrutCard className={cn(FontSpaceMono.className, 'p-3')}>
        <div className="flex flex-col gap-[5px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start gap-[5px]">
              {connector && <img className="aspect-square w-5" alt="i" src={connector.icon}></img>}
              {connector && connector.name} <div className="size-2 translate-y-[2px] rounded-full bg-primary"></div>
            </div>
            <CustomButton
              onClick={disconnectHandler}
              variant={'secondary'}
              className={cn(
                FontSpaceMono.className,
                'hover:bg-primary hover:shadow-brut-sm hover:text-white px-[15px] py-[12px] h-[20px] text-xs text-font-primary font-bold'
              )}
            >
              DISCONNECT
            </CustomButton>
          </div>
          <div className="flex items-center gap-[5px]">
            <Web3Icon size={20} address={address ?? ''}></Web3Icon>
            <span className={FontManrope.className}>{getFirstFourLastFour(address ?? '')}</span>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-[8px]">
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
      </BrutCard>
    </div>
  );
};

export default WalletConnectedCard;
