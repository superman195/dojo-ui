import { TaskModality } from '@/types/QuestionPageTypes';
import { TASKTYPE_COLOR_MAP, TaskTypeMappingDisplay } from '@/utils/states';
import { cn } from '@/utils/tw';
import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  taskModality: TaskModality;
}
export const getTaskTypeMappingDisplay = (type: TaskModality) => {
  return TaskTypeMappingDisplay[type];
};

const TasktypePill = ({ taskModality, className, ...props }: Props) => {
  const pillColor = TASKTYPE_COLOR_MAP[taskModality.toUpperCase().replaceAll(' ', '_')];
  const content = getTaskTypeMappingDisplay(taskModality);
  return (
    <div
      className={cn(
        'w-fit flex items-center gap-[6px] rounded-full px-2 py-1 border border-black/30 text-xs font-bold  text-black/80',
        className
      )}
    >
      <div className={cn('size-[10px] rounded-full', pillColor)}></div>
      {content}
    </div>
  );
};

export default TasktypePill;
