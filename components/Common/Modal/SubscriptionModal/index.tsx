import LabelledInput from '@/components/Common/LabelledInput';
import Modal from '@/components/Common/Modal';
import { ErrorModal } from '@/components/QuestionPageComponents';
import { useCreateSubscriptionKey } from '@/hooks/useCreateSubscriptionKey';
import useDisableMinerByWorker from '@/hooks/useDisableMinerByWorker';
import { useModal } from '@/hooks/useModal';
import { usePartnerList } from '@/hooks/usePartnerList';
import useUpdateWorkerPartner from '@/hooks/useUpdateWorkerPartner';
import { useSubmit } from '@/providers/submitContext';
import { SubscriptionData, SubscriptionModalProps } from '@/types/CommonTypes';
import { MODAL } from '@/types/ProvidersTypes';
import { getFirstAndLastCharacters } from '@/utils/math_helpers';
import { FontManrope, FontSpaceMono } from '@/utils/typography';
import { IconCheck, IconEdit, IconLoader, IconTrash, IconX } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isModalVisible, setIsModalVisible }) => {
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [refetchTrigger, setRefetchTrigger] = useState(0); // Trigger for refetch
  const { createSubscriptionKey, response, error } = useCreateSubscriptionKey();
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editableData, setEditableData] = useState<SubscriptionData | null>(null);
  const { updateWorkerPartner, response: resUpdateWorker, error: resUpdateError } = useUpdateWorkerPartner();
  const { disableMinerByWorker, response: resMinerDisable, error: resMinerDisableError } = useDisableMinerByWorker();
  const { partners } = usePartnerList(refetchTrigger);
  const [errorMsg, setErrorMsg] = useState('');
  const { isSubscriptionModalLoading, setIsSubscriptionModalLoading, setPartnerCount } = useSubmit();
  const handleInputChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue1(e.target.value);
    setErrorMsg('');
  };

  const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue2(e.target.value);
    setErrorMsg('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    setIsSubscriptionModalLoading(true);
    if (inputValue1 && inputValue2) {
      await createSubscriptionKey({ name: inputValue1, minerSubscriptionKey: inputValue2 });
      setIsSubscriptionModalLoading(false);
      setInputValue1('');
      setInputValue2('');
      setRefetchTrigger((prev) => prev + 1);
      if (response?.success) {
        // openInfoModal({
        //   headerTitle: 'Success',
        //   content: response.body || 'Subscription Key Created Successfully',
        //   buttonMeta: {
        //     buttonSuccess: 'Close',
        //   },
        // });
        setModalHeaderTitle('Success');
        setModalMsg(response.body || 'Subscription Key Created Successfully');
      } else {
        setModalHeaderTitle('Error');
        setModalMsg(response?.error || 'An error occurred');
      }
    } else {
      setErrorMsg(!inputValue1 ? 'Name field is empty' : 'Subscription Key is Required');
      setIsSubscriptionModalLoading(false);
    }
  };
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [modalHeaderTitle, setModalHeaderTitle] = useState('');
  const { openModal: openInfoModal } = useModal(MODAL.informational);

  useEffect(() => {
    if (error) {
      openInfoModal({
        headerTitle: 'Error',
        content: (
          <div className="flex w-full gap-[10px]">
            {' '}
            <div className="flex w-2/12 justify-center">
              <IconX className=" size-8 rounded-full bg-red-400 p-[2px] text-white" />
            </div>
            <div className="flex grow items-center">{error || 'An error occurred'}</div>
          </div>
        ),
        buttonMeta: {
          buttonSuccess: 'Close',
          buttonGroupClassName: 'flex justify-center',
        },
      });
    }
    if (response) {
      openInfoModal({
        headerTitle: 'Success',
        content: (
          <div className="flex w-full gap-[10px]">
            {' '}
            <div className="flex w-2/12 justify-center">
              <IconCheck className=" size-8 rounded-full bg-primary p-[2px] text-white" />
            </div>
            <div className="flex grow">{response.body}</div>
          </div>
        ),
        buttonMeta: {
          buttonSuccess: 'Close',
          buttonGroupClassName: 'flex justify-center',
        },
      });
    }
  }, [response, error]);

  const handleEdit = (item: SubscriptionData) => {
    setIsSubscriptionModalLoading(true);
    setEditRowId(item.id);
    setEditableData({ ...item });
    editableData?.subscriptionKey &&
      updateWorkerPartner(item.subscriptionKey, editableData!.subscriptionKey, editableData!.name);
    setRefetchTrigger((prev) => prev + 1);
  };
  const handleCancel = () => {
    setEditRowId(null);
    setEditableData(null);
  };

  const handleSave = async () => {
    setIsSubscriptionModalLoading(true);
    const response = await updateWorkerPartner(
      editableData!.subscriptionKey,
      editableData!.subscriptionKey,
      editableData!.name
    );

    if (response?.success) {
      openInfoModal({
        headerTitle: 'Success',
        content: (
          <div className="flex gap-[10px]">
            {' '}
            <div className="flex w-2/12 justify-center">
              <IconCheck className=" size-8 rounded-full bg-primary p-[2px] text-white" />
            </div>
            Subscription key updated successfully.
          </div>
        ),
        buttonMeta: {
          buttonSuccess: 'Close',
          buttonGroupClassName: 'flex justify-center',
        },
      });
    } else {
      setIsFeedbackModalOpen(true);
      setModalHeaderTitle('Error');
      setModalMsg(response?.error || "Couldn't update Subscription Key. Please try again");
    }
    setEditRowId(null);
    setRefetchTrigger((prev) => prev + 1);
    setIsSubscriptionModalLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof SubscriptionData) => {
    setEditableData((prev) => ({ ...prev!, [field]: e.target.value }));
  };
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDelete = async (item: SubscriptionData) => {
    setIsSubscriptionModalLoading(true);
    const response = await disableMinerByWorker(item.subscriptionKey, true);
    if (response?.success) {
      openInfoModal({
        headerTitle: 'Success',
        content: (
          <div className="flex w-full gap-[10px]">
            {' '}
            <div className="flex w-2/12 justify-center">
              <IconCheck className=" size-8 rounded-full bg-primary p-[2px] text-white" />
            </div>
            <div className="flex grow items-center">{response.body.message}</div>
          </div>
        ),
        buttonMeta: {
          buttonSuccess: 'Close',
          buttonGroupClassName: 'flex justify-center',
        },
      });
    } else {
      openInfoModal({
        headerTitle: 'Error',
        content: (
          <div className="flex w-full gap-[10px]">
            {' '}
            <div className="flex w-2/12 justify-center">
              <IconX className=" size-8 rounded-full bg-red-400 p-[2px] text-white" />
            </div>
            <div className="flex grow items-center">{response?.error || 'An error occurred'}</div>
          </div>
        ),
        buttonMeta: {
          buttonSuccess: 'Close',
          buttonGroupClassName: 'flex justify-center',
        },
      });
    }
    setRefetchTrigger((prev) => prev + 1);
    setIsSubscriptionModalLoading(false);
  };

  useEffect(() => {
    setIsSubscriptionModalLoading(false);
    setPartnerCount(partners.length);
  }, [partners, setPartnerCount]);

  useEffect(() => {
    setIsSubscriptionModalLoading(true);
  }, [!partners]);

  const modalCloseHandler = () => {
    setIsFeedbackModalOpen(false);
    setModalMsg('');
    setModalHeaderTitle('');
  };
  return (
    <>
      {isFeedbackModalOpen && (
        <div className="error-modal">
          <ErrorModal
            open={isFeedbackModalOpen}
            onClose={modalCloseHandler}
            errorMessage={modalMsg}
            headerTitle={modalHeaderTitle}
            // className={'error-modal'}
          />
        </div>
      )}
      <Modal showModal={isModalVisible} setShowModal={setIsModalVisible} title="SUBSCRIPTION KEYS" btnText="Close">
        <div className="w-full bg-secondary px-[22px] py-[15px] text-black">
          <div className="pb-[15px]">
            <h1 className={`${FontSpaceMono.className} text-base font-bold`}>ENTER SUBSCRIPTION KEY</h1>
            <h2 className={`${FontManrope.className} text-base font-medium opacity-60`}>
              Obtain subscription key from miners
            </h2>
          </div>
          <div className={`flex-row`}>
            <div className="flex flex-row justify-between">
              <div className="mr-2 flex">
                <LabelledInput
                  id="name"
                  label="Name"
                  type="text"
                  placeholder="Name"
                  value={inputValue1}
                  onChange={handleInputChange1}
                />
              </div>
              <div className="ml-2 flex-1">
                <LabelledInput
                  id="subscriptionKey"
                  label="SUBSCRIPTION KEY"
                  type="text"
                  placeholder="Enter Subscription Key Here"
                  value={inputValue2}
                  onChange={handleInputChange2}
                />
                {errorMsg && <p className={` text-red-500 ${FontManrope.className} text-sm font-bold`}>{errorMsg}</p>}

                {/* <p className=' text-red-500'>Invalid Subscription Key Please Retry</p> */}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className=" font-spacemono h-auto cursor-pointer border-2 border-black bg-primary px-[18px] py-[10px] text-base font-bold uppercase text-white hover:bg-primary/80 hover:shadow-brut-sm active:border-b-2"
                onClick={handleSubmit}
              >
                Create
              </button>
            </div>
          </div>
        </div>
        {/* <SubscriptionTable/> */}
        <table className="w-full table-fixed leading-normal text-black">
          <thead>
            <tr className={`${FontSpaceMono.className}`}>
              <th className="border-b-2 px-5 py-3  text-left text-sm font-bold uppercase tracking-wider opacity-75">
                Name
              </th>
              <th className="w-1/2 border-b-2 px-5  py-3 text-left text-sm font-bold uppercase tracking-wider opacity-75">
                Subscription Key
              </th>
              <th className="border-b-2 px-5 py-3 text-left text-sm font-bold uppercase tracking-wider opacity-75">
                Created
              </th>
              <th className="border-b-2 px-5 py-3 text-right text-sm font-bold uppercase tracking-wider opacity-75">
                Operations
              </th>
            </tr>
          </thead>
          <tbody className={`${FontManrope.className} text-opacity-60`}>
            {!isSubscriptionModalLoading ? (
              partners.length === 0 ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={4} className="px-5 py-3 text-center">
                        {i === 2 && (
                          <div className={`${FontManrope.className} text-lg font-bold text-black opacity-60`}>
                            No Data Available
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                partners.map((item) => (
                  <tr key={item.id} className="font-medium opacity-60">
                    <td className="px-5 py-3">
                      {editRowId === item.id ? (
                        <input
                          className="block w-full border-2 border-black p-2"
                          type="text"
                          value={editableData?.name}
                          onChange={(e) => handleChange(e, 'name')}
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {editRowId === item.id ? (
                        <input
                          className="block w-full border-2 border-black p-2"
                          type="text"
                          value={editableData?.subscriptionKey}
                          onChange={(e) => handleChange(e, 'subscriptionKey')}
                        />
                      ) : (
                        getFirstAndLastCharacters(item.subscriptionKey, 10)
                      )}
                    </td>
                    <td className="px-5 py-3">{formatDate(item.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex size-full items-center justify-end">
                        {editRowId === item.id ? (
                          <>
                            <button onClick={handleSave}>
                              <IconCheck />
                            </button>
                            <button className="ml-4" onClick={handleCancel}>
                              <IconX />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(item)}>
                              <IconEdit />
                            </button>
                            <button className="ml-4" onClick={() => handleDelete(item)}>
                              <IconTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan={4} className="py-5 text-center">
                  <div className="flex justify-center">
                    <span className="animate-spin ">
                      <IconLoader />
                    </span>
                    Loading...
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Modal>
    </>
  );
};

export default SubscriptionModal;
