import { DropdownButtonProps } from '@/types/CommonTypes';
import { cn } from '@/utils/tw';
import { FontManrope } from '@/utils/typography';
import React from 'react';

export const DropDownButton: React.FC<DropdownButtonProps> = ({ buttonText, imgSrc, onClick, count, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        `flex size-fit justify-between rounded-full px-[11px] py-[5px] ${FontManrope.className} inline-flex items-center justify-center gap-[6px] border border-black/10 bg-card-background text-font-primary/80 hover:border-primary hover:bg-secondary`,
        className
      )}
    >
      <p>{buttonText}</p>
      {imgSrc && <img src={imgSrc} className="inline-block size-6" />}
      {count && <div className="bg-primary pl-0.5 pr-1 text-white">{count}</div>}
    </button>
  );
};
