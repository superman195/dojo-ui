import CodegenViewer from '@/components/CodegenViewer';
import AnnotationInput from '@/components/Common/AnnotationInput/AnnotationInput';
import CopyBtn from '@/components/Common/CopyButton/CopyBtn';
import { BrutCard } from '@/components/Common/CustomComponents/brut-card';
import Shimmers from '@/components/Common/CustomComponents/shimmers';
import MultiSelectV2 from '@/components/Common/MultileSelect/MultiSelectV2';
import GaussianSplatViewer from '@/components/GaussianSplatViewer';
import { useSubmit } from '@/providers/submitContext';
import { Criterion, Task } from '@/types/QuestionPageTypes';
import { RHF_MAX_CHAR } from '@/utils/states';
import { cn } from '@/utils/tw';
import { FontManrope, FontSpaceMono } from '@/utils/typography';
import { IconCheck, IconProgress, IconSparkles, IconTrash } from '@tabler/icons-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { generateNonce } from 'siwe';
import FormattedPrompt from '../FormattedPrompt';
import Slider from '../Slider';

export interface Annotation {
  x: number;
  y: number;
  text: string;
}

export interface TaskVisualizerProps extends React.HTMLProps<HTMLDivElement> {
  task: Task;
  containerClassName?: string;
  visualizerClassName?: string;
  labelsClassName?: string;
}
interface VisualizerContentBoxProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  key?: string;
}
const VisualizerContentBox: React.FC<VisualizerContentBoxProps> = ({
  children,
  className,
  ...props
}: VisualizerContentBoxProps) => (
  <div
    className={cn(
      'flex w-full flex-wrap items-start gap-[5px] rounded-md border-0 border-font-primary/10 bg-background p-3',
      className
    )}
  >
    {children}
  </div>
);

const CriterionContentBox: React.FC<VisualizerContentBoxProps> = ({
  children,
  className,
  ...props
}: VisualizerContentBoxProps) => (
  <div
    className={cn(
      'flex w-full flex-wrap items-start gap-[5px] rounded-md border-font-primary/10 bg-background border-[0px] ',
      className
    )}
  >
    {children}
  </div>
);
/**
 * This single out visualizer only can visualize scores and multi select, single-select, RHF for now.
 * The reason why RHF is not in a component because the image and annotation is tightly coupled.
s */
const SingleOutputTaskVisualizer = ({ task, className, ...props }: TaskVisualizerProps) => {
  const {
    getCriterionForResponse: criterionForResponse,
    addCriterionForResponse,
    resetCriterionForResponse,
  } = useSubmit();
  // const [criterionForResponse, setCriterionForResponse] = useState<CriterionWithResponses[]>([]);
  const idRef = useRef<string>(generateNonce());
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const rhfImageRef = useRef<HTMLImageElement>(null);
  const [rhfCreatingAnnotation, setRhfCreatingAnnotation] = useState<Annotation | null>(null); //Save temp annotation while creating but not submitted
  const rhfLabelContainerRef = useRef<HTMLDivElement>(null); //Actually unused yet
  const [selectedAnnotation, setSelectedAnnotation] = useState(-1); //index for the selected one, negative to show none
  const annotationRefs = useRef<(HTMLDivElement | null)[]>([]); //keep track of refs that has been added
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  const handleLabelChange = (index: number, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnnotations((prev) =>
      prev.map((annotation, i) => (i === index ? { ...annotation, text: e.target.value } : annotation))
    );
  };

  const handleDelete = (index: number) => {
    setAnnotations((prev) => {
      const updatedAnnotations = prev.filter((_, i) => i !== index);
      //  onAnnotationsChange(updatedAnnotations);
      return updatedAnnotations;
    });
  };

  const handleAnnotationSelect = (index: number, scrollIntoView?: boolean) => {
    console.log('Selected annotation: ' + index);
    setSelectedAnnotation(index);
    scrollIntoView &&
      annotationRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    const annotationDiv = annotationRefs.current[index];
    if (annotationDiv) {
      const textarea = annotationDiv.querySelector('textarea');
      if (textarea instanceof HTMLTextAreaElement) {
        textarea.focus();
      }
    }
  };

  const handleRHFAnnotationSave = useCallback((a: Annotation) => {
    if (a.text) {
      setAnnotations((prev) => [...prev, a]);
    }
    setRhfCreatingAnnotation(null);
  }, []);
  //Renderers
  const renderVisualizer = useCallback(
    (task: Task) => {
      const handleRHFImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (annotations.length >= 10) return;
        const imageRect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - imageRect.left) / imageRect.width) * 100;
        const y = ((e.clientY - imageRect.top) / imageRect.height) * 100;
        setRhfCreatingAnnotation({ x, y, text: '' });
      };

      let ttiUrl = '';
      const taskResponse = task.taskData.responses[0];
      console.log('taskResponse', taskResponse);
      switch (task.type) {
        case 'CODE_GENERATION':
          return <CodegenViewer encodedHtml={taskResponse.completion.combined_html} />;
        case '3D_MODEL':
          if (taskResponse.completion.url === undefined) return;
          return (
            <GaussianSplatViewer
              className={cn('max-h-[700px] h-full w-auto max-w-full aspect-square')}
              url={taskResponse.completion.url}
            ></GaussianSplatViewer>
          );
        case 'TEXT_TO_IMAGE':
          if (taskResponse.completion.url === undefined) return;
          ttiUrl = (taskResponse.completion.url as string).startsWith('http')
            ? taskResponse.completion.url
            : `https://${taskResponse.completion.url}`;
          return (
            <>
              <img
                ref={rhfImageRef}
                draggable={false}
                onClick={(e) => {
                  if (task.taskData.responses.find((c) => c.criteria.find((c) => c.type === 'rich-human-feedback'))) {
                    handleRHFImageClick(e);
                  }
                }}
                alt="image"
                width={300}
                height={300}
                src={taskResponse.completion.url}
                className="w-full"
              />
              {rhfCreatingAnnotation && (
                <AnnotationInput
                  onLabelChange={(e) =>
                    setRhfCreatingAnnotation((prev) => {
                      if (prev) {
                        return { ...prev, text: e };
                      }
                      return prev;
                    })
                  }
                  onSubmit={() => {
                    handleRHFAnnotationSave(rhfCreatingAnnotation);
                  }}
                  onClose={() => {
                    setRhfCreatingAnnotation(null);
                  }}
                  imageRef={rhfImageRef}
                  creatingAnnotation={rhfCreatingAnnotation}
                />
              )}
              {rhfCreatingAnnotation && (
                <div
                  className="absolute"
                  style={{ top: `${rhfCreatingAnnotation.y}%`, left: `${rhfCreatingAnnotation.x}%` }}
                >
                  <div className="flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary font-bold text-white">
                    {annotations.length + 1}
                  </div>
                </div>
              )}
              {annotations.map((annotation, index) => (
                <div
                  onClick={() => {
                    handleAnnotationSelect(index, true);
                  }}
                  key={index}
                  className="absolute"
                  style={{ top: `${annotation.y}%`, left: `${annotation.x}%` }}
                >
                  <div
                    className={cn(
                      'flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 font-bold text-white',
                      selectedAnnotation == index && 'bg-primary outline outline-2 outline-offset-1 outline-white'
                    )}
                  >
                    {index + 1}
                  </div>
                </div>
              ))}
            </>
          );
        default:
          return;
      }
    },
    [annotations, handleRHFAnnotationSave, rhfCreatingAnnotation, selectedAnnotation]
  );

  const renderLabelQuestion = useCallback(
    (crit: Criterion, onchangeHandler: (idx: string, value: string) => void): React.ReactNode => {
      switch (crit.type) {
        case 'score':
          let min = crit.min ?? 1;
          let max = crit.max ?? 10;
          let initialVal = Math.floor((max - min) / 2);
          return (
            <Slider
              className="w-full"
              showSections={true}
              min={1}
              max={10}
              step={1}
              initialValue={initialVal}
              onChange={(e) => onchangeHandler(crit.text ?? '', e.toString())}
            />
          );

        case 'single-select':
          return (
            <MultiSelectV2
              singleSelect={true}
              options={crit.options ?? []}
              selectedValues={
                // criterionForResponse()?.find((c) => c.text === crit.text && c.type === 'single-select')?.responses ?? ''
                ''
              }
              onSelectionChange={(e) => {
                onchangeHandler(crit.text ?? '', e);
              }}
            />
          );
        case 'multi-select':
          return (
            <MultiSelectV2
              singleSelect={false}
              options={crit.options ?? []}
              selectedValues={
                // criterionForResponse()?.find((c) => c.text === crit.text)?.responses ?? []
                ['']
              }
              onSelectionChange={(e) => {
                onchangeHandler(crit.text ?? '', e);
              }}
            />
          );
        case 'rich-human-feedback':
          return (
            <div
              ref={rhfLabelContainerRef}
              className={cn(
                'flex h-fit min-h-[250px] w-full flex-col gap-[10px] rounded-md border border-black/10 pb-5',
                annotations.length == 0 && 'max-h-[250px] pb-0'
              )}
            >
              {annotations.length > 0 ? (
                annotations.map((annotation, index) => (
                  <div
                    ref={(r) => {
                      annotationRefs.current[index] = r;
                    }}
                    key={index}
                    className="relative px-4 py-2"
                  >
                    <div className={`flex flex-col  text-black`}>
                      <div className="flex w-full items-center justify-between">
                        <h1 className={`${FontSpaceMono.className} text-base font-bold`}># {index + 1}</h1>
                        <button
                          onClick={() => handleDelete(index)}
                          className="cursor-pointer border-none bg-transparent text-lg text-black hover:text-red-500"
                          title="Delete"
                        >
                          <IconTrash className="size-5" />
                        </button>
                      </div>
                      <p
                        className={`${FontManrope.className} pb-2 text-xs font-semibold normal-case text-black text-opacity-60`}
                      >
                        What is the error and how should it be improved?
                      </p>
                    </div>

                    <div
                      className={cn(
                        'overflow-hidden rounded-sm border-2 border-black',
                        selectedAnnotation === index && 'shadow-brut-sm'
                      )}
                    >
                      <textarea
                        ref={(r) => {
                          textareaRefs.current[index] = r;
                        }}
                        value={annotation.text}
                        onChange={(e) => {
                          handleLabelChange(index, e);
                        }}
                        onFocus={() => handleAnnotationSelect(index)}
                        onBlur={() => handleAnnotationSelect(-1)}
                        rows={1}
                        maxLength={RHF_MAX_CHAR}
                        style={{}}
                        className={cn(
                          `${FontManrope.className} block w-full resize-none overflow-hidden rounded-sm border-black bg-background px-3 py-2 text-sm font-semibold text-black placeholder:text-sm focus:bg-white focus:outline-none md:border-0`
                        )}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="relative flex size-full flex-col  overflow-hidden px-4 py-2 text-lg font-bold text-font-primary">
                  {/* Skeleton */}
                  {[...Array(2)].map((val, index) => (
                    <div key={index} className="relative">
                      <div className={`flex items-center justify-between  text-black`}>
                        <div className="flex w-full flex-col">
                          <h1 className={`${FontSpaceMono.className} text-base font-bold`}># {index + 1}</h1>
                          <Shimmers className="w-full max-w-[200px]" />
                        </div>
                      </div>

                      <Shimmers className="mt-[10px] h-[50px] w-full max-w-[300px]" />
                    </div>
                  ))}

                  {/* Overlay */}
                  <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center rounded-md bg-gradient-to-t from-background from-10% to-background/80 to-100% text-font-primary/70">
                    <div className="max-w-[80%] text-center">
                      Click on specific points of the output image to annotate the flaws / inaccuracies.
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        default:
          return '';
      }
    },
    [criterionForResponse, annotations, selectedAnnotation]
  );

  // Change handlers
  // Current impl: index is just the criterion label since each label has to be unique.
  // Everything will be added into response field as list of string
  const handleChange = useCallback((modelId: string, criteria: Criterion, value: string) => {
    addCriterionForResponse(modelId, criteria, value);
  }, []);
  useEffect(() => {
    setAnnotations([]); //Reset if go next TTI or task
  }, [task]);
  useEffect(() => {
    const adjustHeight = (textarea: HTMLTextAreaElement) => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    textareaRefs.current.forEach((textarea) => {
      if (textarea) {
        adjustHeight(textarea);
        textarea.addEventListener('input', () => adjustHeight(textarea));
      }
    });

    return () => {
      textareaRefs.current.forEach((textarea) => {
        if (textarea) {
          textarea.removeEventListener('input', () => adjustHeight(textarea));
        }
      });
    };
  }, [annotations]);
  return (
    <div className={cn('flex w-full flex-col gap-[30px] md:flex-row items-stretch', props.containerClassName)}>
      <div className="flex h-fit w-full flex-col items-center justify-start gap-[10px] rounded-lg border border-font-primary/10 bg-background-accent p-3 md:w-1/2">
        {/* LEFT SIDE VISUALIZER BOX */}
        <div className="flex w-full justify-between text-xs">
          <div className="flex flex-col lowercase">
            <div className={cn('flex items-center gap-[5px]', FontSpaceMono.className)}>
              <span className="w-fit max-w-[150px] truncate">
                id: {idRef.current}_{task.taskId}
              </span>
              <CopyBtn copyString={task.taskId} className="size-[14px]" />
            </div>
            type: {task.type.replaceAll('_', ' ')}
          </div>
          <span>
            {!task.isCompletedByWorker ? (
              <div className="flex gap-[3px]">
                In Progress
                <IconProgress size={16} />
              </div>
            ) : (
              <div className="flex gap-[3px]">
                Completed
                <IconCheck
                  size={16}
                  className="rounded-full border border-black/10 bg-green-300 p-[2px] text-font-primary"
                />
              </div>
            )}
          </span>
        </div>
        <VisualizerContentBox>
          <div className="flex gap-[5px]">
            <IconSparkles className="my-[2px] size-[20px] shrink-0 animate-pulse"></IconSparkles>
            <FormattedPrompt
              // collapsedClassName="h-[70px]"
              // autoHideHeightThreshold={75}
              isCollapsibleClassName="pr-4"
              className="h-fit min-h-fit py-0 pl-0"
            >
              {task.taskData.prompt}
            </FormattedPrompt>
          </div>
        </VisualizerContentBox>
        <VisualizerContentBox className="flex flex-col items-stretch gap-[10px]">
          <>
            <div className="w-full">Response:</div>
            {/* {task.taskData.responses[0].type === 'rich-human-feedback' && (
              <span className="mt-[-10px] text-xs text-font-primary/60 md:hidden">
                Click anywhere to annotate flaws or inaccuracies.
              </span>
            )} */}
            <BrutCard className={cn('relative p-0 flex aspect-auto w-full rounded-sm', props.visualizerClassName)}>
              {renderVisualizer(task)}
            </BrutCard>
          </>
        </VisualizerContentBox>
      </div>

      {/* RIGHT SIDE QUESTIONS BOX */}
      <div className={cn('flex flex-col items-stretch w-full md:w-1/2 gap-[24px] p-0', props.labelsClassName)}>
        {task.taskData.responses.map((response, index) =>
          response.criteria.map((criteria, cIndex) => (
            <CriterionContentBox key={`sotv_visualizer_${index}`} className={cn('flex w-full flex-col bg-transparent')}>
              <span className={cn(FontSpaceMono.className, 'font-bold')}>
                {index + 1}. {criteria.text}
              </span>
              {renderLabelQuestion(criteria, (idx: string, value: string) => {
                handleChange(response.model, criteria, value);
              })}
            </CriterionContentBox>
          ))
        )}
      </div>
    </div>
  );
};

export default SingleOutputTaskVisualizer;
