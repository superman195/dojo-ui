import { KEY_MESSAGE_SCROLL_HEIGHT } from '@/constants';
import { FontSpaceMono } from '@/utils/typography';
import { useWindowSize } from '@uidotdev/usehooks';
import { easeOut, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from 'react';

const elemAnimParentVariant = {
  hide: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const slideInOutVariant = {
  hide: {
    y: '100%',
    opacity: 0,
  },
  show: {
    y: '0%',
    opacity: 1,
    transition: {
      ease: easeOut,
      duration: 0.5,
    },
  },
};

type AnimStateType = 'hide' | 'show';

const AnimatedFlowChart: React.FC = () => {
  const { scrollY } = useScroll();
  const { height: windowHeight } = useWindowSize();
  const [animState, setAnimState] = useState<AnimStateType>('hide');

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (!windowHeight) return;
    const lowerBound = (windowHeight ?? 0) * 4.5;
    const upperBound = (windowHeight ?? 0) * 5 + 200 + KEY_MESSAGE_SCROLL_HEIGHT * 6.3;
    if (latest > lowerBound && latest < upperBound) {
      setAnimState('show');
    } else setAnimState('hide');
  });

  return (
    <>
      <section className="sticky top-0 flex h-[200vh] w-full justify-center overflow-hidden border-t-4 border-solid border-black">
        <Image src="/grid.svg" alt="Example Icon" width={100} height={200} className="absolute w-full opacity-[0.03]" />
        <motion.div
          variants={elemAnimParentVariant}
          initial="hide"
          animate={animState}
          className="flex h-screen w-full max-w-4xl flex-col items-center justify-evenly p-4"
        >
          <motion.h2
            variants={slideInOutVariant}
            className={`${FontSpaceMono.className} mt-10 text-4xl font-bold uppercase leading-tight md:text-5xl`}
          >
            How it works?
          </motion.h2>
          <motion.div
            variants={slideInOutVariant}
            className="relative mx-auto flex h-auto w-full items-center overflow-auto md:size-full md:overflow-hidden"
          >
            <object type="image/svg+xml" data="/flow-chart-animation.svg">
              svg-animation
            </object>
          </motion.div>
        </motion.div>
      </section>
      <div className={`w-full`} style={{ height: '300px' }}></div>
    </>
  );
};

export default AnimatedFlowChart;
