import { cn } from '@/utils/tw';
import { FontManrope } from '@/utils/typography';
import { IconBulbFilled } from '@tabler/icons-react';
import { useState } from 'react';

const cardStyles = 'hover:bg-primary-100 rounded-xl border border-neutral-700 p-4 transition-colors';
const headerStyles = 'flex cursor-pointer flex-col items-start justify-between gap-4 sm:flex-row sm:items-center';
const textStyles = 'text-xs text-neutral-500';
const ExampleCard = ({ isValidator = false }: { isValidator: boolean }) => {
  const [isExampleVisible, setIsExampleVisible] = useState(false);

  return (
    <div className="mb-4 rounded-sm border border-primary/30 ">
      <div
        className="flex cursor-pointer items-center justify-between bg-primary/20 p-2 text-sm font-medium"
        onClick={() => setIsExampleVisible(!isExampleVisible)}
      >
        <span className={`${FontManrope.className} flex items-center font-normal text-font-primary`}>
          <IconBulbFilled size={16} className="mr-2 shrink-0" /> Tip: Click to see an example of data structure
          displayed in the leaderboard.
        </span>
        <span className="mr-2 text-xs text-muted-foreground">{isExampleVisible ? '▼' : '▲'}</span>
      </div>

      {isExampleVisible && (
        <div className="rounded-b-sm border-t border-primary/30 bg-primary/0 p-1">
          <div className={cn(cardStyles, 'border-none')}>
            <div className={headerStyles}>
              {/* Left side - Rank and ID */}
              <div className="flex items-start gap-2 sm:items-center">
                <span className="shrink-0 text-2xl font-bold text-neutral-400">#RANK</span>
                <div className="flex flex-col">
                  <div className={textStyles}>Unique ID</div>
                  <div className="text-sm font-medium">
                    <span className="mr-[3px] underline-offset-2">Hotkey</span>
                  </div>
                </div>
              </div>

              {/* Right side - Stats and Chart */}
              <div className="flex w-full items-center justify-between gap-6 sm:w-auto sm:justify-end">
                <div className="text-left">
                  <div className="text-sm font-medium">{isValidator ? 'vTrust' : 'mTrust'}</div>
                  <div className={textStyles}>daily emission</div>
                </div>
                <div className="flex items-center">
                  <div className="h-[35px] w-[120px] bg-gradient-to-r from-primary/20 to-neutral-100"></div>
                </div>
              </div>
            </div>

            {/* Expandable Section */}
            <div className="mt-4 border-t border-neutral-800 pt-4">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between">
                  <span>Cold key</span>
                  <span>XXXXXX...</span>
                </div>
                <div className="flex flex-wrap items-center justify-between">
                  <span>Stake</span>
                  <span>X.XXXXX τ</span>
                </div>
                <div className="flex flex-wrap items-center justify-between">
                  <span>Lifetime Emission</span>
                  <span>X.XXXXX τ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExampleCard;
