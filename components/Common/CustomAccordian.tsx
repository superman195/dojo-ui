import { HTMLAttributes, ReactNode, useRef, useState } from 'react';

import { cn } from '@/utils/tw';
import { FontManrope } from '@/utils/typography';
import { IconChevronUp } from '@tabler/icons-react';
interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const yPadding = 8;
const borderWidth = 2;
const CustomAccordion = ({ className, title, children, ...props }: Props) => {
  const childRef = useRef<HTMLDivElement | null>(null);
  const [childHeight, setChildHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(28);
  const [isOpen, setIsOpen] = useState(false);

  const updateHeaderHeight = (node: HTMLDivElement) => {
    if (node == null) return;
    console.log('header height', node.getBoundingClientRect().height);
    setHeaderHeight(node.getBoundingClientRect().height);
  };

  const updateChildHeight = (node: HTMLDivElement) => {
    if (node == null) return;
    setChildHeight(node.getBoundingClientRect().height);
  };
  return (
    <div
      style={{
        height: `${(isOpen ? headerHeight + childHeight : headerHeight) + 2 * yPadding}px`,
      }}
      className={cn(
        FontManrope.className,
        'relative overflow-hidden transition-all duration-300 py-[8px] px-[16px]',
        className
      )}
    >
      <div ref={updateHeaderHeight} className={cn('flex justify-between items-center font-bold text-sm md:text-lg')}>
        <h1 className="truncate">{title}</h1>
        <button
          className={cn(
            isOpen ? 'scale-y-[1]' : 'scale-y-[-1]',
            'duration-300 transition-all bg-primary border-[2px] border-font-primary'
          )}
          onClick={(e) => setIsOpen((prev) => !prev)}
        >
          <IconChevronUp color={'white'}></IconChevronUp>
        </button>
      </div>

      {/* Children/Content */}
      <div
        className="py-[12px]"
        ref={(node) => {
          if (node == null) return;
          childRef.current = node;
          updateChildHeight(node);
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CustomAccordion;
