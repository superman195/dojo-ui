/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { cn } from '@/utils/tw';
import { FontManrope, FontSpaceMono } from '@/utils/typography';
import { IconX } from '@tabler/icons-react';
import React, { HTMLAttributes } from 'react';
import { ButtonNew } from '../../Button/ButtonNew';
import { BrutCard } from '../../CustomComponents/brut-card';
interface Props extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
  header?: React.ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
  modalMode?: boolean;
  buttonFail?: React.ReactNode;
  buttonFailFn?: () => void;
  buttonSuccess?: React.ReactNode;
  buttonSuccessFn?: () => void;
  buttonGroupClassName?: string;
  buttonFailClassName?: string;
  buttonSuccessClassName?: string;
}
const ModalContainer = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      headerClassName,
      bodyClassName,
      open,
      onClose,
      header,
      children,
      modalMode,
      buttonFail,
      buttonFailFn,
      buttonSuccess,
      buttonSuccessFn,
      buttonGroupClassName,
      buttonFailClassName,
      buttonSuccessClassName,
      ...props
    },
    ref
  ) => {
    const isModal = modalMode ?? true;
    return (
      <>
        {open && (
          <div
            className={cn(isModal && 'fixed w-[100vw] h-[100vh] top-0 left-0 z-20 flex items-center justify-center ')}
          >
            <div
              onClick={(e) => onClose()}
              className={cn(
                'fixed z-30 w-[10000px] h-[10000px] top-0 left-0',
                isModal && 'bg-black/40 backdrop-blur-sm'
              )}
            ></div>
            <BrutCard className={cn('p-0 z-30', isModal ? 'max-w-[80%] sm:max-w-[600px]' : 'absolute', className, '')}>
              <div className="flex flex-col">
                {/* header */}
                <div className={cn('flex items-stretch justify-center border-b-[2px] border-b-black')}>
                  <span
                    className={cn(
                      FontSpaceMono.className,
                      'p-2 flex grow items-center justify-start font-bold',
                      headerClassName
                    )}
                  >
                    {header}
                  </span>
                  <div
                    onClick={(e) => onClose()}
                    className="flex aspect-square w-[40px] items-center justify-center border-l-2 border-black p-1 hover:cursor-pointer"
                  >
                    <IconX className="size-4"></IconX>
                  </div>
                </div>
                <div className={cn(FontManrope.className, 'p-2', bodyClassName)}>{children}</div>
              </div>
              {(buttonFail || buttonSuccess) && (
                <div
                  className={cn(
                    FontManrope.className,
                    'w-full flex items-center justify-end gap-[20px] p-2 mt-1',
                    buttonGroupClassName
                  )}
                >
                  {buttonFail && (
                    <ButtonNew
                      onClick={(e) => {
                        onClose();
                        buttonFailFn?.();
                      }}
                      variant="secondary"
                      className={cn('w-3/12 h-fit bg-transaparent', buttonFailClassName)}
                    >
                      {buttonFail}
                    </ButtonNew>
                  )}
                  {buttonSuccess && (
                    <ButtonNew
                      onClick={(e) => {
                        onClose();
                        buttonSuccessFn?.();
                      }}
                      className={cn('w-3/12 h-fit', buttonSuccessClassName)}
                    >
                      {buttonSuccess}
                    </ButtonNew>
                  )}
                </div>
              )}
            </BrutCard>
          </div>
        )}
      </>
    );
  }
);

ModalContainer.displayName = 'ModalContainer';

export default ModalContainer;
