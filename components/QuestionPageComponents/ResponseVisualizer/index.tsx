import CodegenViewer from '@/components/CodegenViewer';
import GaussianSplatViewer from '@/components/GaussianSplatViewer';
import { ResponseVisualizerProps, TaskResponses } from '@/types/QuestionPageTypes';
import { TaskType } from '@/utils/states';
import { cn } from '@/utils/tw';
import { FontSpaceMono } from '@/utils/typography';
import React from 'react';
import Slider from '../Slider';

const ResponseVisualizer: React.FC<ResponseVisualizerProps> = ({
  task,
  minValSlider,
  maxValSlider,
  ratings,
  multiScoreOptions,
  isMultiScore,
  handleRatingChange,
}) => {
  const renderVisualizer = (taskT: TaskType, plot: TaskResponses, index: number) => {
    let ttiUrl = '';
    switch (taskT) {
      case 'CODE_GENERATION':
        return <CodegenViewer encodedHtml={plot.completion.combined_html} />;
      case '3D_MODEL':
      case 'TEXT_TO_THREE_D':
        if (plot.completion.url === undefined) return;
        return (
          <GaussianSplatViewer
            className={cn('max-h-[700px] h-full w-auto max-w-full aspect-square')}
            url={plot.completion.url}
          ></GaussianSplatViewer>
        );
      case 'TEXT_TO_IMAGE':
        if (plot.completion.url === undefined) return;
        ttiUrl = (plot.completion.url as string).startsWith('http')
          ? plot.completion.url
          : `https://${plot.completion.url}`;
        return <img alt="image" src={ttiUrl} />;
      default:
        return;
    }
  };

  return (
    <div className="flex w-full justify-center px-4">
      <div className="grid w-full max-w-full grid-cols-1 gap-x-5 gap-y-10 xl:grid-cols-2">
        {task.taskData.responses.map((plot, index) => (
          <div key={`${task.type}_${index}`} className="flex w-full flex-col justify-center ">
            <div
              className={`flex h-fit w-full flex-col rounded-sm  ${isMultiScore && 'border-2 border-black bg-ecru-white shadow-brut-sm'} `}
            >
              {renderVisualizer(task.type, plot, index)}
              {isMultiScore && (
                <>
                  <div
                    className={` w-full justify-between px-4 text-base ${FontSpaceMono.className} border-t-2 border-black py-2  font-bold uppercase`}
                  >
                    response quality
                  </div>
                  <div className={`px-4`}>
                    <Slider
                      min={minValSlider}
                      max={maxValSlider}
                      step={1}
                      initialValue={ratings[multiScoreOptions[index]]}
                      onChange={(rating) => {
                        handleRatingChange(multiScoreOptions[index], rating);
                      }}
                      showSections
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponseVisualizer;
