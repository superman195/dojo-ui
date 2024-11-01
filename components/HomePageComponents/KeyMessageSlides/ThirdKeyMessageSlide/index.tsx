import { KEY_MESSAGE_SCROLL_HEIGHT } from '@/constants';
import { FontSpaceMono } from '@/utils/typography';
import { useWindowSize } from '@uidotdev/usehooks';
import { easeOut, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
interface Props {}

const elemAnimParentVariant = {
  hide: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};
const elemAnimVariant = {
  hide: {
    y: '100%',
    opacity: 0,
  },
  show: {
    y: '0%',
    opacity: 1,
    transition: {
      ease: easeOut,
      duration: 0.4,
    },
  },
};

const coinAnimVariant = {
  hide: {
    y: '60%',
    rotateY: '0deg',
    opacity: 0,
  },
  show: {
    y: '0%',
    rotateY: '360deg',
    opacity: 1,
    transition: {
      ease: easeOut,
      duration: 1,
    },
  },
};

type AnimStateType = 'hide' | 'show';
const ThirdKeyMessageSlide = () => {
  // const { scrollY } = props;
  const { scrollY } = useScroll();

  const { height: windowHeight } = useWindowSize();

  const [animState, setAnimState] = useState<AnimStateType>('hide');

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (!windowHeight) return;
    const lowerBound = (windowHeight ?? 0) * 6;
    // const lowerBound = (windowHeight ?? 0) * 3;
    const upperBound = (windowHeight ?? 0) * 3 + KEY_MESSAGE_SCROLL_HEIGHT * 7;
    if (latest > lowerBound && latest < upperBound) setAnimState('show');
    else setAnimState('hide');
  });

  return (
    <motion.section className="sticky left-0 top-0 z-[200] flex h-screen w-full justify-center overflow-hidden border-t-4 border-solid border-black bg-gray-100">
      <Image src="/grid.svg" alt="Example Icon" width={100} height={200} className="absolute w-full opacity-[0.03]" />
      <motion.div
        variants={elemAnimParentVariant}
        initial="hide"
        animate={animState}
        className="flex h-screen w-full max-w-4xl flex-col items-center justify-evenly p-4"
      >
        <div className="text-center">
          <div className="overflow-hidden">
            <motion.h2
              variants={elemAnimVariant}
              className={`${FontSpaceMono.className} text-4xl font-bold uppercase leading-tight md:text-5xl`}
            >
              GET PAID TO CONTRIBUTE TO OPEN SOURCE AI
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.p variants={elemAnimVariant} className="mt-4 text-lg leading-snug text-gray-500 md:text-xl">
              Your responses will be used to train open-source models and improve outputs on other Bittensor Subnets
            </motion.p>
          </div>
        </div>
        {/* key visual graphic */}
        <motion.div variants={coinAnimVariant} className="relative flex">
          <div className="absolute z-[-1] size-[200px] animate-pulseYandScale rounded-full bg-[#00B6A6] bg-opacity-10"></div>
          <div className="relative flex size-[200px] animate-pulseY items-center justify-center rounded-full border-4 border-black bg-white shadow-brut-sm">
            <Image className="size-[90px]" width={100} height={100} alt="Bittensor AI" src={'/tao-logo.png'} />
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};
export default ThirdKeyMessageSlide;
