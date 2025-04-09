import { useResizeObserver } from '@/hooks/useResizeObserver';
import { cn } from '@/utils/tw';
import { IconChevronDown } from '@tabler/icons-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  collapsedClassName?: string;
  isCollapsibleClassName?: string;
  collapsableBtnClassName?: string;
  bottomFadeDivClassName?: string;
  autoHideHeightThreshold?: number;
}

const FormattedPrompt = ({
  children,
  className,
  collapsedClassName,
  isCollapsibleClassName,
  collapsableBtnClassName,
  bottomFadeDivClassName,
  autoHideHeightThreshold,
  ...props
}: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);
  const resizeCB = useCallback((e: ResizeObserverEntry) => {
    // console.log('resizing', e.contentRect.height);
  }, []);
  const reObRef = useResizeObserver(resizeCB);
  const aht = autoHideHeightThreshold ?? 75;
  useEffect(() => {
    if (divRef.current && divRef.current.clientHeight > aht) {
      setIsCollapsible(true);
      // setIsCollapsed(true);
    } else {
      setIsCollapsible(false);
      setIsCollapsed(false);
    }
  }, [divRef, children]);

  const toggleCollapse = () => {
    if (isCollapsible) {
      setIsCollapsed((prev) => !prev);
    }
  };

  return (
    <div
      ref={(e) => {
        divRef.current = e;
        reObRef.current = e;
      }}
      className={cn(
        'transition-all duration-300 flex relative h-full items-start whitespace-pre-wrap p-2 pl-0 pr-6 text-font-primary/70',
        isCollapsible && 'cursor-pointer pr-[48px]',
        isCollapsible && isCollapsibleClassName,
        !isCollapsed && 'items-center',
        className,
        isCollapsed && 'overflow-hidden h-[40px] cursor-pointer',
        isCollapsed && collapsedClassName
      )}
      onClick={toggleCollapse}
      {...props}
    >
      {children}
      {isCollapsible && (
        <>
          {isCollapsed && (
            <div
              className={cn(
                'absolute bottom-0 h-[15px] w-full bg-gradient-to-t from-background to-background/10 ',
                bottomFadeDivClassName
              )}
            ></div>
          )}

          <IconChevronDown
            className={cn(
              'animate-bounce absolute right-1 top-1 size-4 rounded-md bg-font-primary/10 text-font-primary opacity-30 hover:opacity-80',
              collapsableBtnClassName
            )}
          />
        </>
      )}
    </div>
  );
};

const CollapsiblePrompt = ({ className, children, ...props }: Props) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [lineClampActive, setLineClampActive] = useState(false);
  const toggleCollapse = () => {
    if (divRef.current && divRef.current.clientHeight > 160) {
      setLineClampActive(true);
    } else {
      setLineClampActive(false);
    }
  };
  useEffect(() => {
    if (divRef.current && divRef.current.clientHeight > 160) {
      setLineClampActive(true);
    }
  }, [divRef]);
  return (
    <div
      onClick={toggleCollapse}
      ref={divRef}
      className={cn(
        'relative cursor-pointer whitespace-pre-wrap text-text-primary',
        lineClampActive && 'line-clamp-4 text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
      {lineClampActive && (
        <div className="absolute bottom-0 left-0 flex h-[35px] w-full items-end justify-center bg-gradient-to-t from-background to-background/10">
          <div className="animate-bounce rounded-full border border-muted-foreground bg-background px-3 py-[2px] text-font-primary">
            See more
          </div>
        </div>
      )}
    </div>
  );
};

export { CollapsiblePrompt, FormattedPrompt };
