import CodegenViewer from '@/components/CodegenViewer';
import Tooltip from '@/components/Common/Tooltip';
import GaussianSplatViewer from '@/components/GaussianSplatViewer';
import { useSubmit } from '@/providers/submitContext';
import { Criterion, Task, TaskResponses } from '@/types/QuestionPageTypes';
import { TaskType } from '@/utils/states';
import { cn } from '@/utils/tw';
import { FontSpaceMono } from '@/utils/typography';
import { IconLayoutGrid, IconLayoutList } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { TaskVisualizerProps } from '../SingleOutputTask/SingleOutputTaskVisualizer';
import Slider from '../Slider';
import TaskPrompt from '../TaskPrompt';

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

const MultiOutputVisualizer = ({ task, className, ...props }: TaskVisualizerProps) => {
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

  const renderCriteria = useCallback(
    (task: Task, criteria: Criterion, index: number) => {
      switch (criteria.type.toLowerCase()) {
        case 'score':
          return (
            <>
              <div className={cn('max-w-[1075px] w-full', FontSpaceMono.className, 'font-bold')}>
                {index + 1}.{' '}
                {criteria.text ?? 'Please score the below responses on the quality (10 - highest, 1 - lowest)'}
              </div>
              <div
                className={cn(
                  'grid w-full max-w-full gap-x-5 gap-y-10 grid-cols-1',
                  isGrid ? 'xl:grid-cols-2' : 'xl:grid-cols-1'
                )}
              >
                {task.taskData.responses.map((response, index) => (
                  <div key={`${task.type}_${index}`} className="flex w-full flex-col justify-center ">
                    <div
                      className={`flex h-fit w-full flex-col overflow-hidden rounded-sm border-2 border-black bg-ecru-white shadow-brut-sm`}
                    >
                      {renderVisualizer(task.type, response, index)}
                      <>
                        {showLeaderboard ? (
                          <Leaderboard miners={leaderboardData} />
                        ) : (
                          <>
                            <div
                              className={` w-full justify-between px-4 text-base ${FontSpaceMono.className} border-t-2 border-black py-2  font-bold uppercase`}
                            >
                              response quality
                            </div>
                            <div className={`px-4`}>
                              <Slider
                                min={1}
                                max={10}
                                step={1}
                                initialValue={1}
                                onChange={(rating) => {
                                  // addCriterionForResponse(`${criteria.text}::${response.model}`, rating.toString());
                                }}
                                showSections
                              />
                            </div>
                          </>
                        )}
                      </>
                    </div>
                  </div>
                ))}
              </div>
            </>
          );
        default:
          return <></>;
      }
    },
    [isGrid]
  );

  const renderNewCriteria = useCallback((response: TaskResponses, criteria: Criterion, index: number) => {
    switch (criteria.type.toLowerCase()) {
      case 'score':
        return (
          <React.Fragment key={`${response.model}_${criteria.type}_${index}`}>
            <div
              className={` w-full justify-between px-4 text-base ${FontSpaceMono.className} border-t-2 border-black py-2  font-bold uppercase`}
            >
              response quality
            </div>
            <div className={`px-4`}>
              <Slider
                min={1}
                max={10}
                step={1}
                initialValue={1}
                onChange={(rating) => {
                  addCriterionForResponse(response.model, criteria, rating);
                }}
                showSections
              />
            </div>
          </React.Fragment>
        );
      default:
        return <>{criteria.type}</>;
    }
  }, []);

  const renderResponses = useCallback(
    (response: TaskResponses, index: number) => {
      return (
        <>
          <div className={cn('max-w-[1075px] w-full', FontSpaceMono.className, 'font-bold')}>
            {index + 1}. {response.model}
          </div>
          <div className="flex w-full flex-col rounded-sm border-2 border-black">
            {renderVisualizer(task.type, response, index)}
            {response.criteria.map((criteria, index2) => renderNewCriteria(response, criteria, index2))}
          </div>
        </>
      );
    },
    [task, renderVisualizer, renderNewCriteria]
  );
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
      <div
        className={cn(
          'px-4 grid w-full max-w-full gap-x-5 gap-y-10 grid-cols-1',
          isGrid ? 'xl:grid-cols-2' : 'xl:grid-cols-1'
        )}
      >
        {task.taskData.responses.map((response, index) => {
          return (
            <div className="flex flex-col items-center gap-[10px]" key={`${task.type}_${response.model}_${index}`}>
              {renderResponses(response, index)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiOutputVisualizer;
