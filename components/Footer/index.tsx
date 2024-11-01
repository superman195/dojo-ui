import useGetNextInProgressTask, { NextTaskResponse } from '@/hooks/useGetNextTask';
import { useSubmit } from '@/providers/submitContext';
import { useRouter } from 'next/router';
import React from 'react';
import { Button } from '../Button';

const Footer: React.FC = () => {
  const router = useRouter();
  const { taskId } = router.query;
  const { handleSubmit } = useSubmit();
  const { fetchNextInProgressTask } = useGetNextInProgressTask();

  const handleSkip = async () => {
    if (!router.isReady) return;
    let nextTaskResponse: NextTaskResponse | null;

    if (!taskId || typeof taskId !== 'string') return;

    nextTaskResponse = await fetchNextInProgressTask(taskId);

    // If there is no next task, redirect to home page
    if (!nextTaskResponse || !nextTaskResponse.nextInProgressTaskId) {
      console.info('No next task found');
      router.push('/');
      return;
    }
    router.push(`/Questions?taskId=${nextTaskResponse.nextInProgressTaskId}`);
  };

  return (
    <div className="mx-auto max-w-[1075px] p-4">
      <div className="flex justify-between">
        <div className=" flex">
          <div className="flex w-[250px] flex-col" />
        </div>
        <div className="flex items-center justify-end space-x-[11px]">
          <Button
            buttonText={'SKIP'}
            className="bg-[#E4E4E4] px-[37px] py-[15px] text-black hover:shadow-brut-sm"
            onClick={async () => handleSkip()}
          />
          <Button
            buttonText={'PROCEED'}
            className="bg-[#00B6A6] px-[37px] py-[15px] text-white hover:shadow-brut-sm"
            onClick={() => handleSubmit()}
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
