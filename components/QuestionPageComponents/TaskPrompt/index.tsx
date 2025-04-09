import useQueryFunc from '@/hooks/useQueryFuncs';
import { TaskPromptProps } from '@/types/QuestionPageTypes';
import { FontManrope } from '@/utils/typography';
import { IconSparkles } from '@tabler/icons-react';
import React from 'react';
import { CollapsiblePrompt } from '../FormattedPrompt';
import TasktypePill from './tasktype-pill';

const TaskPrompt: React.FC<TaskPromptProps> = ({ title, taskModality, formattedPrompt }) => {
  const { updateQueryString } = useQueryFunc();
  return (
    <div className="flex max-w-[1075px] flex-col justify-center gap-[15px] md:py-2">
      <div className={`flex flex-wrap items-center text-start ${FontManrope.className} gap-2 text-2xl font-bold`}>
        <span className="">{title}</span>
        {`  `}
        <TasktypePill taskModality={taskModality} />
      </div>
      <div
        className={`${FontManrope.className} flex min-h-[48px] w-fit overflow-hidden
           rounded-xl border-2 border-black py-2 pr-2`}
      >
        <div className="size-fit animate-pulse pl-2">
          <IconSparkles className="size-[24px] shrink-0 rounded-full p-[2px]" />
        </div>
        <CollapsiblePrompt>{formattedPrompt}</CollapsiblePrompt>
      </div>
    </div>
  );
};

export default TaskPrompt;
