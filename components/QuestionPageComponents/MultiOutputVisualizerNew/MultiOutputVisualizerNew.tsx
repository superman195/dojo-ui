import CodegenViewer from '@/components/CodegenViewer';
import Tooltip from '@/components/Common/Tooltip';
import GaussianSplatViewer from '@/components/GaussianSplatViewer';
import { useSubmit } from '@/providers/submitContext';
import { TaskResponses } from '@/types/QuestionPageTypes';
import { TaskPayloadNew, TaskType } from '@/utils/states';
import { cn } from '@/utils/tw';
import { FontSpaceMono } from '@/utils/typography';
import { IconLayoutGrid, IconLayoutList } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import Slider from '../Slider';
import TaskPrompt from '../TaskPrompt';

export interface TaskVisualizerPropsNew extends React.HTMLProps<HTMLDivElement> {
  task: TaskPayloadNew;
  containerClassName?: string;
  visualizerClassName?: string;
  labelsClassName?: string;
}

interface MinerData {
  address: string;
  percentage: number;
}

interface LeaderboardProps {
  miners: MinerData[];
}

const Leaderboard = ({ miners }: LeaderboardProps) => {
  return (
    <div className="flex flex-col py-2">
      {miners.map((miner, index) => (
        <div
          key={index}
          className={`flex items-center justify-between rounded px-2 ${FontSpaceMono.className} font-bold`}
        >
          <div className="truncate font-mono text-sm">{miner.address}</div>
          <div className="font-mono font-bold">{miner.percentage}%</div>
        </div>
      ))}
    </div>
  );
};

const leaderboardData = [
  {
    address: '5CCefwu4fFXkBorK4ETJpaiJXTG3LD5J2kBb7U5qEP4eABny',
    percentage: 80,
  },
  {
    address: '5ERG2E7U5E5WS67zFFGHfqGqPXgLtmT8tsp21VoPdYToHSY',
    percentage: 70,
  },
  {
    address: '5CCefwu4fFXkBorK4ETJpaiJXTG3LD5J2kBb7U5qEP4eABny',
    percentage: 80,
  },
  {
    address: '5ERG2E7U5E5WS67zFFGHfqGqPXgLtmT8tsp21VoPdYToHSY',
    percentage: 70,
  },
];

const MultiOutputVisualizerNew = ({ task, className, ...props }: TaskVisualizerPropsNew) => {
  const { addCriterionForResponse, getCriterionForResponse } = useSubmit();
  const [isGrid, setIsGrid] = useState(true);
  const searchParams = useSearchParams();

  const showLeaderboard = searchParams.get('showIndividualMinerLeadersboard') === 'true';
  const renderVisualizer = useCallback((taskT: TaskType, response: TaskResponses, index: number) => {
    let ttiUrl = '';
    switch (taskT) {
      case 'CODE_GENERATION':
        return <CodegenViewer encodedHtml={response.completion.combined_html} />;
      case '3D_MODEL':
      case 'TEXT_TO_THREE_D':
        if (response.completion.url === undefined) return;
        return (
          <GaussianSplatViewer
            className={cn('max-h-[700px] h-full w-auto max-w-full aspect-square')}
            url={response.completion.url}
          ></GaussianSplatViewer>
        );
      case 'TEXT_TO_IMAGE':
        if (response.completion.url === undefined) return;
        ttiUrl = (response.completion.url as string).startsWith('http')
          ? response.completion.url
          : `https://${response.completion.url}`;
        return <img alt="image" src={ttiUrl} />;
      default:
        return;
    }
  }, []);

  return (
    <div className={cn('flex w-full flex-col gap-[30px] items-stretch', props.containerClassName)}>
      {/* Headers */}
      <div className="flex w-full justify-center px-4">
        <div className="w-full max-w-[1075px]">
          {task && <TaskPrompt title={task?.title} taskType={task.type} formattedPrompt={task.taskData.prompt} />}
        </div>
      </div>
      <div className="flex h-px w-full justify-center">
        <div className="hidden max-w-[1075px] grow items-center justify-end gap-[4px] xl:flex">
          <Tooltip tooltipContent={<div>Grid View</div>}>
            <IconLayoutGrid
              strokeWidth={2}
              size={28}
              onClick={() => setIsGrid(true)}
              className="cursor-pointer rounded-md border border-slate-200 bg-background-accent p-px text-slate-500 hover:bg-slate-200"
            />
          </Tooltip>
          <Tooltip
            tooltipContent={
              <div>
                List View
                <p className="max-w-[140px] text-font-secondary/70">
                  In case some outputs are not displaying correctly due to size constraints
                </p>
              </div>
            }
          >
            <IconLayoutList
              strokeWidth={2}
              size={28}
              onClick={() => setIsGrid(false)}
              className="cursor-pointer rounded-md border border-slate-200 bg-background-accent p-px text-slate-500 hover:bg-slate-200"
            />
          </Tooltip>
        </div>
      </div>
      <hr className="border-2 border-t-0 border-black"></hr>
      <div className="px-4">
        <div className="flex flex-col items-center gap-[10px]">
          <div className={cn('max-w-[1075px] w-full font-bold')}>
            Please score the below responses on the quality (
            {task.taskData.responses[0].criteria.find((c) => c.type === 'multi-score')?.min ?? 1} - highest,{' '}
            {task.taskData.responses[0].criteria.find((c) => c.type === 'multi-score')?.max ?? 10} - lowest)
          </div>
          <div
            className={cn(
              'grid w-full max-w-full gap-x-5 gap-y-10 grid-cols-1',
              isGrid ? 'xl:grid-cols-2' : 'xl:grid-cols-1'
            )}
          >
            {task.taskData.responses.map((response, responseIdx) => {
              return (
                <>
                  <div className="flex w-full flex-col justify-center">
                    <div
                      className={`flex h-fit w-full flex-col overflow-hidden rounded-sm border-2 border-black bg-ecru-white shadow-brut-sm`}
                    >
                      {renderVisualizer(task.type as TaskType, response, responseIdx)}
                      {!showLeaderboard && (
                        <div className="w-full border-t-2 border-black px-4 py-2 text-base font-bold uppercase">
                          response quality
                        </div>
                      )}
                      <div className="px-4">
                        <>
                          {showLeaderboard ? (
                            <Leaderboard miners={leaderboardData} />
                          ) : (
                            <>
                              {response.criteria.find((c) => c.type === 'multi-score') && (
                                <Slider
                                  min={1}
                                  max={10}
                                  step={1}
                                  initialValue={response.criteria.find((c) => c.type === 'multi-score')?.min ?? 1}
                                  onChange={(rating) => {
                                    addCriterionForResponse(
                                      `${response.criteria.find((c) => c.type === 'multi-score')?.type}::${response.model}`,
                                      rating.toString()
                                    );
                                  }}
                                  showSections
                                />
                              )}
                            </>
                          )}
                        </>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiOutputVisualizerNew;
