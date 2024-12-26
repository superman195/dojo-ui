import { DropdownContainerProps } from '@/types/CommonTypes';
import { cn } from '@/utils/tw';
import React from 'react';
import { DropDownButton } from './DropDownButton';

export const DropdownContainer: React.FC<DropdownContainerProps> = ({
  buttonText,
  imgSrc,
  children,
  containerClassName,
  dropdownClassName,
  count,
  isOpen,
  onToggle,
}) => {
  return (
    <div className={cn(containerClassName, 'relative')}>
      <DropDownButton
        className={cn(isOpen && 'bg-secondary border-primary', dropdownClassName)}
        buttonText={buttonText}
        imgSrc={imgSrc ? imgSrc : ''}
        onClick={onToggle}
        count={count}
      />
      {isOpen && children}
    </div>
  );
};
