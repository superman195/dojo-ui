import { FontManrope } from '@/utils/typography';
import { IconBulbFilled } from '@tabler/icons-react';
import { useState } from 'react';

const ExampleCard = () => {
  const [isExampleVisible, setIsExampleVisible] = useState(false);
  const cardStyles = 'hover:bg-primary-100 rounded-xl border border-neutral-700 p-4 transition-colors';
  const headerStyles = 'flex cursor-pointer flex-col items-start justify-between gap-4 sm:flex-row sm:items-center';
  const textStyles = 'text-xs text-neutral-500';

  return (
    <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-100">
      <div
        className="flex cursor-pointer items-center justify-between p-2 text-sm font-medium"
        onClick={() => setIsExampleVisible(!isExampleVisible)}
      >
        <span className={`${FontManrope.className} flex items-center font-semibold text-gray-500`}>
          <IconBulbFilled className="mr-2" /> Tip: Click to see an example of data structure displayed in the
          leaderboard.
        </span>
        <span className="text-xs">{isExampleVisible ? '▼' : '▲'}</span>
      </div>

      {isExampleVisible && (
        <div className="rounded-b-lg border-t border-yellow-300 bg-yellow-50 p-4">
          <div className={cardStyles}>
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
                  <div className="text-sm font-medium">mTrust</div>
                  <div className={textStyles}>daily emission</div>
                </div>
                <div className="flex items-center">
                  <div className="h-[35px] w-[120px] bg-neutral-800/50"></div>
                  <div className="ml-2 text-xs text-[#00C7B0]">▲</div>
                </div>
              </div>
            </div>

            {/* Expandable Section */}
            <div className="mt-4 border-t border-neutral-800 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="mb-1 text-neutral-500">Cold Key</div>
                  <div className="font-medium">XXX...XXX</div>
                </div>
                <div>
                  <div className="mb-1 text-neutral-500">Stake</div>
                  <div className="font-medium">X.XXXXX</div>
                </div>
                <div>
                  <div className="mb-1 text-neutral-500">Lifetime Emission</div>
                  <div className="font-medium">X.XXXXX τ</div>
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
