import { Button } from '@/components/Common/Button';
import ModalContainer from '@/components/Common/Modal/ModalContainer';
import { ErrorModalProps } from '@/types/QuestionPageTypes';
import { cn } from '@/utils/tw';
import { FontManrope } from '@/utils/typography';
import { IconX } from '@tabler/icons-react';
import React from 'react';

const ErrorModal: React.FC<ErrorModalProps> = ({ open, onClose, errorMessage, className, headerTitle, showButton }) => {
  showButton = showButton === undefined ? true : showButton;
  return (
    <ModalContainer
      className={cn(' min-w-[300px] rounded-md', className)}
      headerClassName={'pl-2'}
      bodyClassName="p-0"
      header={headerTitle || <div className="flex gap-[10px]">Error</div>}
      open={open}
      onClose={onClose}
      onSave={onClose}
    >
      <div
        className={cn(
          `${FontManrope.className} gap-[10px] py-4 px-4  text-[16px] min-h-[100px] leading-[120%] h-fit flex justify-center items-center font-bold`
        )}
      >
        <div className="flex w-2/12 justify-center">
          <IconX className=" size-8 rounded-full bg-red-400 p-[2px] text-white" />
        </div>
        <div className="flex grow">{errorMessage}</div>
      </div>
      {showButton && (
        <div className={'py- size-full border-t-2 border-black px-4 py-2 text-right'}>
          <Button
            className={cn('w-[85px] h-[39px] hover:shadow-brut-sm text-[16px] text-white')}
            buttonText={'CLOSE'}
            onClick={onClose}
          />
        </div>
      )}
    </ModalContainer>
  );
};

export default ErrorModal;
