import { cn } from '@/utils/tw';
import { FontManrope } from '@/utils/typography';
import ModalContainer from './Modal/ModalContainer';

interface ModalContainerProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  content?: React.ReactNode;
  headerTitle?: string;
  buttonMeta?: {
    buttonFail?: React.ReactNode;
    buttonFailFn?: () => void;
    buttonSuccess?: React.ReactNode;
    buttonSuccessFn?: () => void;
    buttonGroupClassName?: string;
    buttonFailClassName?: string;
    buttonSuccessClassName?: string;
  };
}
const InformationalModal = ({ buttonMeta, headerTitle, content, ...modalProps }: ModalContainerProps) => {
  return (
    <ModalContainer
      className={cn('sm:min-w-[300px] rounded-md')}
      headerClassName={'pl-2'}
      bodyClassName="p-0"
      header={headerTitle || <div className="flex gap-[10px]">Info</div>}
      {...modalProps}
      {...buttonMeta}
    >
      <div
        className={cn(
          `${FontManrope.className} gap-[10px] py-4 px-2  text-[16px] min-h-[50px] leading-[120%] h-fit flex justify-center items-center font-bold`
        )}
      >
        {/* <div className="flex w-2/12 justify-center">
          <IconX className=" size-8 rounded-full bg-red-400 p-[2px] text-white" />
        </div> */}
        <div className="flex grow">{content}</div>
      </div>
    </ModalContainer>
  );
};

export default InformationalModal;
