import { cn } from '@/utils/tw';
import { FontManrope } from '@/utils/typography';
import { IconArrowUpRight } from '@tabler/icons-react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { headerItems } from '../NavigationBar';

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const MobileNavbar = ({ className, ...props }: Props) => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const topBarVariants: Variants = {
    closed: { rotate: 0, y: 0, x: 0 },
    open: {
      rotate: [0, 0, 0, 45],
      y: [0, 7, 7, 7],
      x: 2,
      transition: {
        ease: 'easeInOut',
        delay: 0.1,
        times: [0, 0.3, 0.4, 0.8],
        duration: 0.6,
      },
    },
  };

  const middleBarVariants: Variants = {
    closed: { opacity: 1, x: 0 },
    open: { opacity: 0, transition: { delay: 0.2 } },
  };

  const bottomBarVariants: Variants = {
    closed: { rotate: 0, y: 0, x: 0 },
    open: {
      rotate: [0, 0, 0, -45],
      y: [0, -7, -7, -7],
      x: 2,
      transition: {
        ease: 'easeInOut',
        delay: 0.1,
        times: [0, 0.3, 0.4, 0.8],
        duration: 0.6,
      },
    },
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setNavbarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef]);
  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          'bg-background z-20 fixed top-0 left-0 w-[100vw] transition-all flex flex-col ease-in-out duration-500',
          navbarOpen ? 'translate-y-0' : 'translate-y-[-100%]'
        )}
      >
        <Link className="w-fit p-6" href="/">
          <img className="h-[20px] w-[220px] md:h-[30px]" src="/logo.svg" alt="logo" />
        </Link>
        <div
          className={cn(
            'h-fit border-b-[2px] border-font-primary divide-y-[2px] divide-black flex flex-col text-font-primary ',
            FontManrope.className,
            className
          )}
        >
          {headerItems.map((item, index) => (
            <Link
              onClick={() => setNavbarOpen(false)}
              key={`mobile_navbar_${index}`}
              href={item.url}
              className={cn(
                'p-6 hover:bg-primary flex gap-[10px] items-stretch uppercase justify-center text-3xl font-extrabold hover:text-font-secondary text-font-primary hover:cursor-pointer visited:text-font-primary ',
                item.disabled && 'cursor-not-allowed text-muted-foreground'
              )}
            >
              <div className="flex items-center">{item.title}</div>{' '}
              {item.url.startsWith('https://') && <IconArrowUpRight className="size-[45px]" />}
            </Link>
          ))}
        </div>
      </div>
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          setNavbarOpen((prev) => !prev);
        }}
        className={cn('z-20 flex items-center text-font-primary md:hidden', 'hover:cursor-pointer')}
      >
        <div className="flex flex-col gap-[5px] transition-all duration-300">
          <motion.div
            variants={topBarVariants}
            animate={navbarOpen ? 'open' : 'closed'}
            className="h-[2px] w-[28px] bg-black"
          ></motion.div>
          <motion.div
            variants={middleBarVariants}
            animate={navbarOpen ? 'open' : 'closed'}
            className="h-[2px] w-[28px] bg-black"
          ></motion.div>
          <motion.div
            variants={bottomBarVariants}
            animate={navbarOpen ? 'open' : 'closed'}
            className="h-[2px] w-[28px] bg-black"
          ></motion.div>
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
