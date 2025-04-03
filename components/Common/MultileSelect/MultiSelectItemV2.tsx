import { MultiSelectItemProps } from '@/types/CommonTypes';
import { cn } from '@/utils/tw';
import React from 'react';

const MultiSelectItemV2: React.FC<MultiSelectItemProps> = ({ option, isSelected, onSelectionChange, singleSelect }) => {
  const selectedStyles = isSelected
    ? 'border-[4px] border-black bg-secondary opacity-[14]'
    : 'border-2 border-gray-300 bg-ecru-white opacity-[14]';
  const ss = singleSelect ?? false;
  return (
    <div className={cn('w-full flex flex-col', !ss && 'w-fit shrink-0')}>
      <label
        className={cn(
          `flex w-full cursor-pointer items-center space-x-2 border-[2px] border-black/10 rounded-md bg-ecru-white hover:border-black/50 hover:bg-secondary px-[8px] py-[4px]`,
          !ss && 'space-x-0',
          isSelected && 'bg-primary hover:bg-primary text-white  border-black'
        )}
      >
        <span className="relative">
          <input
            type="checkbox"
            value={option}
            checked={isSelected}
            onChange={() => onSelectionChange(option)}
            className="sr-only" // Hide the default checkbox
          />
          {ss && <span className={`block size-4 rounded-full border border-black/30 bg-white`}></span>}
          {isSelected && ss && (
            <div
              className="absolute left-1/2 top-1/2 block rounded-full"
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <div className="size-[10px] rounded-full bg-primary text-lg " />
            </div>
          )}
        </span>
        <span className="select-none text-sm">{option}</span>
      </label>
    </div>
  );
};

export default MultiSelectItemV2;
