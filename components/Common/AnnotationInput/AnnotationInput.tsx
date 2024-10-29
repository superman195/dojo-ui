import { Annotation } from '@/components/QuestionPageComponents/SingleOutputTask/SingleOutputTaskVisualizer';
import { RHF_MAX_CHAR } from '@/utils/states';
import { cn } from '@/utils/tw';
import { FontManrope } from '@/utils/typography';
import { IconArrowUp, IconX } from '@tabler/icons-react';
import React, { useCallback, useEffect, useRef } from 'react';

interface AnnotationInputProps {
  creatingAnnotation: Annotation;
  imageRef: React.RefObject<HTMLImageElement>;
  onClose: () => void;
  onLabelChange: (value: string) => void;
  onSubmit: () => void;
}

const annotationRectBaseWidth = 320;
const annotationRectBaseHeight = 175;
const annotationRectBaseWidthMobile = 320;
const annotationRectBaseHeightMobile = 40;

const AnnotationInput: React.FC<AnnotationInputProps> = ({
  creatingAnnotation,
  imageRef,
  onClose,
  onLabelChange,
  onSubmit,
}) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        imageRef.current &&
        !imageRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, imageRef]);

  const autoResizeTextArea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset the height to auto
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'; // Set the height to match the content
    }
  }, [textareaRef]);

  useEffect(() => {
    const updatePosition = () => {
      if (inputRef.current && imageRef.current) {
        const baseAnnotationRectWidth =
          window.innerWidth > 768 ? annotationRectBaseWidth : annotationRectBaseWidthMobile;
        const baseAnnotationRectHeight =
          window.innerWidth > 768 ? annotationRectBaseHeight : annotationRectBaseHeightMobile;
        inputRef.current.style.position = 'absolute';
        const imageRect = imageRef.current.getBoundingClientRect();
        let relativeTop = (creatingAnnotation.y / 100) * imageRect.height + 20;
        let relativeLeft = (creatingAnnotation.x / 100) * imageRect.width + 10;

        // Adjust position to keep within viewport
        if (relativeLeft + imageRect.left + baseAnnotationRectWidth > window.innerWidth) {
          const tmpOverFlow = relativeLeft + imageRect.left + baseAnnotationRectWidth - window.innerWidth;
          relativeLeft = relativeLeft - Math.abs(tmpOverFlow) - 10;
        }
        if (relativeTop + imageRect.top + baseAnnotationRectHeight > window.innerHeight) {
          relativeTop = relativeTop - baseAnnotationRectHeight - 40;
        }

        inputRef.current.style.top = `${relativeTop}px`;
        inputRef.current.style.left = `${relativeLeft}px`;
      } else {
        console.log('something not loaded');
      }
    };

    // Initial position update
    updatePosition();

    // Auto focus the text area everything coordinates change
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    // Update position on window resize
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [creatingAnnotation.x, creatingAnnotation.y, imageRef]);

  return (
    // I start the element with a fixed div but in the useEffect above,
    // I change it to absolute.
    // This is because browser keeps trying to scroll the initially added
    // element into view. But fixing it to 50% top of browser will ensure it starts in view,
    // then the useEffect will adjust it to the correct position.
    <>
      <div
        ref={inputRef}
        className="fixed z-10  min-w-[320px] rounded-sm border-2 border-black bg-[#FFFFF4] shadow-brut-sm"
        style={{
          top: '50%',
          overflowY: 'auto',
        }}
      >
        <div className="hidden items-center justify-between px-3 pt-2 md:flex">
          <div className="">
            <div className={`${FontManrope.className} text-sm font-bold normal-case`}>
              What&apos;s inaccurate/missing?
            </div>
          </div>
          <button onClick={onClose} className="hidden self-start text-gray-500 hover:text-gray-700 md:flex">
            <IconX className="size-4 font-bold" />
          </button>
        </div>
        <div className="flex flex-col gap-[14px] pr-[28px] md:p-3 ">
          <div className="overflow-hidden rounded-sm border-black md:border-2">
            <textarea
              ref={textareaRef}
              value={creatingAnnotation.text}
              onChange={(e) => {
                onLabelChange(e.target.value);
                autoResizeTextArea();
              }}
              maxLength={RHF_MAX_CHAR}
              className={`${FontManrope.className} block w-full resize-none overflow-hidden rounded-sm border-black bg-white px-3 py-2 text-sm font-semibold text-black placeholder:text-sm focus:outline-none`}
              placeholder="Incorrect shadow / representation etc."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              rows={1}
              autoFocus
            />
          </div>
          <button
            onClick={onSubmit}
            className={cn(
              FontManrope.className,
              'absolute right-2 top-[50%] flex  aspect-square size-fit -translate-y-1/2 items-center justify-center rounded-sm border-2 border-black bg-teal-500 text-sm font-bold text-white hover:bg-teal-800 md:relative md:right-auto  md:top-auto md:aspect-auto md:w-full md:translate-y-0 md:py-[6px]'
            )}
          >
            <span className="hidden md:flex">Submit</span>
            <IconArrowUp className="md:hidden" />
          </button>
        </div>
      </div>
    </>
  );
};

export default AnnotationInput;
