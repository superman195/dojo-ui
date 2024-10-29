import { SliderProps } from '@/types/QuestionPageTypes';
import { cn } from '@/utils/tw';
import { FontManrope } from '@/utils/typography';
import React, { useEffect, useState } from 'react';

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step,
  initialValue,
  onChange,
  minLabel,
  maxLabel,
  showSections,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const percentage = value !== undefined ? ((value - min) / (max - min)) * 100 : 0;
  const numberOfSteps = Math.floor((max - min) / step) + 1;

  const stepsArray = Array.from({ length: numberOfSteps }, (_, i) => min + i * step);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    setValue(newValue);
    onChange(newValue);
  };

  const sliderStyle = {
    background: `linear-gradient(to right, #00B6A6 0%, #00B6A6 ${percentage}%, #ccc ${percentage}%, #ccc ${percentage}%)`,
  };
  return (
    <div className={cn('relative mb-6', props.className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSliderChange}
        className={`border-end h-1.5 w-full cursor-pointer appearance-none border border-e border-black bg-transparent focus:outline-none disabled:pointer-events-none
        disabled:opacity-50
        [&::-webkit-slider-thumb]:z-[9999]
        [&::-webkit-slider-thumb]:size-[14px]
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-muted
        [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_rgba(0,0,0,1)]
        [&::-webkit-slider-thumb]:transition-all
        [&::-webkit-slider-thumb]:duration-150
        [&::-webkit-slider-thumb]:ease-in-out
       `}
        style={sliderStyle}
      />
      {showSections && (
        <div className="pointer-events-none absolute inset-x-0 top-[9px] flex justify-between">
          {stepsArray.map((stepValue, index) => (
            <div key={index} className={`flex flex-col ${index === 0 ? 'items-start' : 'items-end'} justify-center`}>
              <span
                className={`bg-primary ${
                  stepValue === value ? 'bg-transparent opacity-0' : ''
                } block h-[11px] w-[5px] rounded-md border border-black dark:text-gray-400`}
              />
              <p className={`${FontManrope.className} mr-[-0.75px] mt-1 text-xs font-semibold`}>{stepValue}</p>
            </div>
          ))}
        </div>
      )}
      {minLabel && (
        <span className="absolute -bottom-6 start-0 text-sm text-gray-500 dark:text-gray-400">{minLabel}</span>
      )}
      {maxLabel && (
        <span className="absolute -bottom-6 end-0 text-sm text-gray-500 dark:text-gray-400">{maxLabel}</span>
      )}
    </div>
  );
};

export default Slider;
