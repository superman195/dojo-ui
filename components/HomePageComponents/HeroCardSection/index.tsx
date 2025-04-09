import GetStartedButton from '@/components/Common/Button/GetStarted';
import useAverageTaskCompletionTime from '@/hooks/useAverageTaskCompletionTime';
import useCompletedTasksCount from '@/hooks/useCompletedTasksCount';
import useDojoWorkerCount from '@/hooks/useDojoWorkerCount';
import { cn } from '@/utils/tw';
import { FontManrope, FontSpaceMono } from '@/utils/typography';
import { useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useCallback } from 'react';
import CountUp from 'react-countup';

const HeroCardSection = () => {
  const { scrollYProgress } = useScroll();

  const { numDojoWorkers } = useDojoWorkerCount();
  const { numCompletedTasks } = useCompletedTasksCount();
  const { averageTaskCompletionTime } = useAverageTaskCompletionTime();
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 1, 0]);

  const formatTime = useCallback((value: number) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} hrs`;
    } else if (minutes > 0) {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} mins`;
    } else {
      return `${seconds.toString().padStart(2, '0')} secs`;
    }
  }, []);

  return (
    <section id="first" className="flex h-auto w-full justify-center overflow-hidden px-4 md:px-5 lg:px-10">
      <div className="flex h-fit min-h-screen max-w-[1075px] flex-col gap-6 py-8 md:flex-row md:gap-10 lg:my-3 lg:gap-20">
        <div className="mt-8 flex w-full flex-col justify-center p-0 md:mt-0 md:w-7/12">
          <h1
            className={cn(
              `${FontSpaceMono.className} text-3xl font-bold uppercase text-black sm:text-4xl md:text-4xl lg:text-5xl xl:text-7xl`,
              'extra-large-screensize-title'
            )}
          >
            Accelerate Decentralized AI.
          </h1> 
          <p
            className={`${FontManrope.className}  mt-3 pr-2 text-base font-medium text-gray-500 md:text-lg lg:text-xl`}
          >
            Complete diverse tasks to advance AI development. Contribute to powerful multimodal models through
            crowd-sourced intelligence.
            <span className="inline-block font-bold text-primary">&nbsp;Welcome to DeAI Network</span>.
          </p>
          <div className="mb-5 mt-4">
            <GetStartedButton />
          </div>
          <hr className="border-black" />
          <div className="mt-6 flex flex-col gap-4 md:flex-row">
            {/* <div>
              <h3
                className={`uppercase ${FontSpaceMono.className} text-lg font-bold text-gray-500 sm:text-lg md:text-sm xl:text-base`}
              >
                Average Task Completion Time
              </h3>
              <h3
                className={` ${FontManrope.className} text-2xl font-extrabold sm:text-[32px] md:text-xl xl:text-3xl`}
                key={averageTaskCompletionTime}
              >
                <CountUp
                  start={0}
                  end={averageTaskCompletionTime || 0}
                  duration={3}
                  startOnMount
                  formattingFn={formatTime}
                />
              </h3>
            </div> */}
            <div>
              <h3
                className={`uppercase ${FontSpaceMono.className} text-base font-bold text-gray-500 sm:text-lg md:text-sm xl:text-base`}
              >
                HUMAN TASKS COMPLETED
              </h3>
              <h3
                className={`uppercase ${FontManrope.className} text-2xl font-extrabold sm:text-[32px] md:text-xl xl:text-3xl`}
              >
                {numCompletedTasks ? <CountUp start={0} end={numCompletedTasks} duration={3} startOnMount /> : '---'}
              </h3>
            </div>
            <div>
              <h3
                className={`uppercase ${FontSpaceMono.className} text-base font-bold text-gray-500 sm:text-lg md:text-sm xl:text-base`}
              >
                NO.OF HUMAN PARTICIPANTS
              </h3>
              <h3
                className={`uppercase ${FontManrope.className} text-2xl font-extrabold sm:text-[32px] md:text-xl xl:text-3xl`}
              >
                {numDojoWorkers ? <CountUp start={0} end={numDojoWorkers} duration={3} startOnMount /> : '---'}
              </h3>
            </div>
          </div>
        </div>
        <div className="relative mb-8 flex w-full items-center justify-center md:mb-0 md:w-5/12">
          <div className="static left-4 flex w-full items-center self-center p-0 md:absolute md:w-[70vw] lg:w-[50vw] lg:min-w-[500px] lg:max-w-[900px]">
            <Image
              alt="DeAI user interface example"
              src="/hero-banner-img.gif"
              width={1742}
              height={1236}
              className="w-full rounded-xl border-2 border-solid border-black shadow-brut-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCardSection;
