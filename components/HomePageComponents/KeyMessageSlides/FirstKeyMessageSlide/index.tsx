import { KEY_MESSAGE_SCROLL_HEIGHT, elemAnimParentVariant, elemAnimVariant } from '@/constants';
import { AnimStateType } from '@/types/HomePageTypes';
import { FontSpaceMono } from '@/utils/typography';
import { useWindowSize } from '@uidotdev/usehooks';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import NewtonsCradle from './InteractiveComponent/newtonsCradle';
import styles from './styles.module.css';

const conversations = [
  {
    text: 'Decentralized AI can democratize access and enhance privacy. Thoughts?',
    actor: 'J',
    isRightAligned: false,
    gradientClass: styles.actorGradient1,
  },
  {
    text: 'Yea! It also reduces the risk of data breaches by eliminating single points of control.',
    actor: 'D',
    isRightAligned: true,
    gradientClass: styles.actorGradient2,
  },
  {
    text: 'Open collaboration in decentralized AI can drive faster innovation.',
    actor: 'J',
    isRightAligned: false,
    gradientClass: styles.actorGradient1,
  },
  {
    text: "Agreed. Let's integrate it into our projects for a competitive edge and ethical alignment.",
    actor: 'D',
    isRightAligned: true,
    gradientClass: styles.actorGradient2,
  },
];

const FirstKeyMessageSlide = () => {
  const { scrollY } = useScroll();
  const { height: windowHeight } = useWindowSize();
  const [animState, setAnimState] = useState<AnimStateType>('hide');

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (!windowHeight) return;

    const lowerBound = windowHeight - 800;
    const upperBound = windowHeight + KEY_MESSAGE_SCROLL_HEIGHT * 3.25;
    if (latest > lowerBound && latest < upperBound) setAnimState('show');
    else setAnimState('hide');
  });

  return (
    <section className="sticky top-0 flex h-[200vh] w-full justify-center overflow-hidden border-t-4 border-solid border-black">
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
              Work anytime from anywhere
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.p variants={elemAnimVariant} className="mt-4 text-lg leading-snug text-gray-500 md:text-xl">
              Enjoy the freedom to work on tasks at your convenience from any location
            </motion.p>
          </div>
        </div>
        <div className="z-20 flex w-full justify-center">
          <NewtonsCradle />
        </div>
      </motion.div>
    </section>
  );
};
export default FirstKeyMessageSlide;
