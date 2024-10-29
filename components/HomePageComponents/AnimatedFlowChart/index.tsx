import React from 'react';

const AnimatedFlowChart: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0">
        <svg className="size-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="dotted-pattern" patternUnits="userSpaceOnUse" width="4" height="4">
              <circle cx="0.3" cy="0.3" r="0.15" fill="black" opacity={0.15} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotted-pattern)" />
        </svg>
      </div>
      <object type="image/svg+xml" data="/flow-chart-animation.svg" className="relative mx-auto w-full xl:w-4/5">
        svg-animation
      </object>
    </div>
  );
};

export default AnimatedFlowChart;
