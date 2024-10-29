'use client';

import { getFirstFourLastFour } from '@/utils/math_helpers';
import Web3Icon from './web3-icon';

interface Props {
  account?: string;
}
const WalletBadgeButton = (props: Props) => {
  const account = props.account;

  return (
    <div className="flex items-center justify-start gap-[5px] text-xs sm:text-base">
      <Web3Icon size={20} address={account ?? ''}></Web3Icon>
      <div id="flex walletBadeAccountAddress">{getFirstFourLastFour(props.account ?? '')}</div>
    </div>
  );
};

export default WalletBadgeButton;
