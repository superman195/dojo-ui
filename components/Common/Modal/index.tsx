import { ModalProps } from '@/types/CommonTypes';
import { FontSpaceMono } from '@/utils/typography';
import { IconX } from '@tabler/icons-react';

function Modal({ title, showModal, setShowModal, btnText, className, children }: ModalProps) {
  const handleCloseModal = () => {
    console.log(showModal);
    setShowModal(!showModal);
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto overflow-x-hidden text-black outline-none backdrop-blur-sm backdrop-brightness-50 focus:outline-none">
      <div className="relative px-4">
        <div className="border-1 relative top-0 m-2 flex min-w-[300px] border-collapse flex-col border border-neutral-950 bg-card-background shadow-brut-sm outline-none focus:outline-none md:m-0 lg:w-[900px]">
          <div className="flex items-start justify-between border border-solid border-gray-900">
            <div className="flex h-[46px] items-center pl-[22px]">
              <h1 className={`${FontSpaceMono.className} text-base font-bold`}>{title}</h1>
            </div>
            <div
              className="flex h-[46px] cursor-pointer items-center  justify-center border-l-2  border-black px-4 py-1 hover:opacity-60"
              onClick={handleCloseModal}
            >
              <IconX className="size-6"></IconX>
            </div>
          </div>
          <div className="flex flex-col items-center justify-end border  border-gray-900 bg-card-background">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
