import Image from 'next/image';
import React from 'react';

const AnimatedFlowChart: React.FC = () => {
  return (
    <div className="relative flex h-screen min-h-fit items-center overflow-hidden border-y-4 border-black">
      <div className="absolute inset-0"></div>
      <Image src="/grid.svg" alt="Example Icon" width={100} height={200} className="absolute w-full opacity-[0.03]" />

      <object type="image/svg+xml" data="/flow-chart-animation.svg" className="relative mx-auto w-full xl:w-4/5">
        svg-animation
      </object>
    </div>
  );
};

export default AnimatedFlowChart;
