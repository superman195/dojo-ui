import { cn } from '@/utils/tw';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  tooltipContent: React.ReactNode;
  tooltipContentClassname?: string;
  showCondition?: boolean;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  className,
  children,
  tooltipContent,
  tooltipContentClassname,
  showCondition = true,
  delay = 150,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const targetRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  let timeoutId: NodeJS.Timeout;

  const updatePosition = useCallback(() => {
    if (targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Calculate the center position
      let top = targetRect.bottom + 5; // Add a small gap
      let left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;

      // Adjust vertical position if tooltip would go off-screen
      if (top + tooltipRect.height > viewportHeight) {
        top = targetRect.top - tooltipRect.height - 5; // Place above with a small gap
      }

      // Adjust horizontal position if tooltip would go off-screen
      if (left < 0) {
        left = 0;
      } else if (left + tooltipRect.width > viewportWidth) {
        left = viewportWidth - tooltipRect.width;
      }

      setPosition({ top, left });
    }
  }, [targetRef, tooltipRef]);

  const debouncedSetIsVisible = React.useRef(
    debounce((value: boolean) => {
      setIsVisible(value);
      if (value) updatePosition();
    }, delay)
  ).current;
  const showTooltip = () => {
    debouncedSetIsVisible(true);
  };

  const hideTooltip = () => {
    debouncedSetIsVisible(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isVisible) {
        updatePosition();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      debouncedSetIsVisible.cancel(); // Cancel any pending debounced calls
    };
  }, [isVisible, debouncedSetIsVisible, updatePosition]);
  if (showCondition === false) return <>{children}</>;

  return (
    <>
      <div className={cn('flex', className)} ref={targetRef} onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
        {children}
      </div>
      {tooltipContent && (
        <div
          ref={tooltipRef}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            opacity: isVisible ? 1 : 0,
            pointerEvents: isVisible ? 'auto' : 'none',
            transition: 'opacity 0.2s ease-in-out',
          }}
          className={cn(
            'fixed z-50 rounded font-semibold bg-gray-800 p-2 text-xs text-font-secondary shadow-lg',
            tooltipContentClassname
          )}
        >
          {tooltipContent}
        </div>
      )}
    </>
  );
};

export default Tooltip;
