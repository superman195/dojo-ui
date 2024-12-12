import { CustomButton } from '@/components/Common/CustomComponents/button';
import { IconExternalLink } from '@tabler/icons-react';
import { useState } from 'react';

interface MobileTableCardProps<T> {
  data: T;
  position: number;
  renderMainInfo: (data: T) => React.ReactNode;
  renderStats: (data: T) => React.ReactNode;
  renderExpandedInfo?: (data: T) => React.ReactNode;
  onClickAction?: (data: T) => void;
  actionPath?: string;
  actionLabel?: string;
}

const MobileTableCard = <T extends {}>({
  data,
  position,
  renderMainInfo,
  renderStats,
  renderExpandedInfo,
  onClickAction,
  actionPath,
  actionLabel,
}: MobileTableCardProps<T>) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="mb-3 cursor-pointer select-none rounded-sm border bg-white p-4 transition-colors hover:border-primary hover:bg-secondary"
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-2 sm:items-center">
          <span className="shrink-0 text-2xl font-bold text-neutral-400">#{position}</span>
          <div className="flex flex-col">
            {renderMainInfo(data)}
            {actionPath && (
              <CustomButton
                onClick={(e) => {
                  e.stopPropagation();
                  onClickAction ? onClickAction(data) : window.open(actionPath, '_blank');
                }}
                className="h-fit p-0 font-bold text-darkGreen"
                variant={'link'}
              >
                <span className="mr-[3px] text-xs underline underline-offset-2">{actionLabel}</span>
                <IconExternalLink className="size-4" />
              </CustomButton>
            )}
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-6 sm:w-auto sm:justify-end">
          {renderStats(data)}
        </div>
      </div>

      {isExpanded && renderExpandedInfo && (
        <div className="mt-4 border-t border-neutral-800 pt-4">{renderExpandedInfo(data)}</div>
      )}
    </div>
  );
};

export default MobileTableCard;
