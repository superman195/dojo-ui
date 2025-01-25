'use client';
import { cn } from '@/utils/tw';
import Link from 'next/link';
import GetStartedButton from '../Button/GetStarted';
import MobileNavbar from '../MobileNavbar/MobileNavbar';
import { WalletButton } from '../Wallet/WalletButton';

type NavigationBarProps = {
  openModal: () => void;
  isHomePage?: boolean;
  className?: string;
};

export const headerItems = [
  { title: 'Dashboard', url: '/dashboard' },
  { title: 'Task List', url: '/task-list?sort=numCriteria&order=desc' },
  { title: 'FAQ', url: '/faq' },
  { title: 'Demo', url: '/task-list?exp=demo&?sort=numCriteria&order=desc', disabled: false },
  { title: 'Docs', url: 'https://docs.tensorplex.ai/tensorplex-docs' },
];

const NavigationBar = ({ openModal, isHomePage, className }: NavigationBarProps) => {
  return (
    <div className="flex items-center justify-center p-4">
      <nav
        className={cn(
          'w-[1075px] h-[67.6px] bg-background border-[2px] border-black rounded-md flex px-[20px] py-[12px] items-center',
          className
        )}
      >
        <div className=" flex h-[45px] w-full justify-between gap-[15px]">
          <div className="flex h-full items-center gap-[30px]">
            <div className="">
              <Link href="/">
                <img className="h-[20px] w-[220px] md:h-[30px]" src="/logo.svg" alt="logo" />
              </Link>
            </div>
            <div className="hidden items-center gap-[10px] whitespace-nowrap md:flex">
              {headerItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? '#' : item.url}
                  className={cn(
                    'text-font-primary hover:cursor-pointer hover:underline hover:text-primary',
                    item.disabled &&
                      'text-muted-foreground hover:cursor-not-allowed hover:text-muted-foreground hover:no-underline'
                  )}
                >
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isHomePage ? (
              <div className="flex gap-[10px]">
                <div className="flex items-center justify-center gap-[8px]">
                  <WalletButton openModal={openModal}></WalletButton>
                </div>
              </div>
            ) : (
              <GetStartedButton />
            )}
            <MobileNavbar />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavigationBar;
