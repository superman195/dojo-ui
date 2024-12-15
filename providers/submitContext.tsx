import useFeature from '@/hooks/useFeature';
import useGetNextInProgressTask from '@/hooks/useGetNextTask';
import { useSubmitTaskNew } from '@/hooks/useSubmitTaskNew';
import { RankOrder, SubmitContextType } from '@/types/ProvidersTypes';
import { CriterionWithResponses, Task } from '@/types/QuestionPageTypes';
import { getTaskIdFromRouter } from '@/utils/general_helpers';
import { TaskPayloadNew } from '@/utils/states';
import { useRouter } from 'next/router';
import React, { ReactNode, createContext, useCallback, useContext, useState } from 'react';

const SubmitContext = createContext<SubmitContextType | undefined>(undefined);

export const useSubmit = () => {
  const context = useContext(SubmitContext);
  if (!context) {
    throw new Error('useSubmit must be used within a SubmitProvider');
  }
  return context;
};

export const SubmitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [criterionForResponse, setCriterionForResponse] = useState<CriterionWithResponses[]>([]);
  const { submitTask, error, resetError: resetSubmissionError, response } = useSubmitTaskNew();
  const [multiSelectData, setMultiSelectData] = useState<string[]>([]);
  const { fetchNextInProgressTask } = useGetNextInProgressTask();
  const [rankingData, setRankingData] = useState<any>();
  const [scoreData, setScoreData] = useState<number>(0);
  const [multiScore, setMultiScore] = useState<any>();
  const [triggerTaskPageReload, setTriggerTaskPageReload] = useState<boolean>(false);
  const [isSubscriptionModalLoading, setIsSubscriptionModalLoading] = useState<boolean>(true);
  const [partnerCount, setPartnerCount] = useState(0);

  const [isMultiSelectQuestion, setIsMultiSelectQuestion] = useState<boolean>(false);
  const [isRankQuestion, setIsRankQuestion] = useState<boolean>(false);
  const [isMultiScore, setIsMultiScore] = useState<boolean>(false);
  const [isSlider, setIsSlider] = useState<boolean>(false);

  const [maxMultiScore, setMaxMultiScore] = useState<number>(0);
  const [minMultiScore, setMinMultiScore] = useState<number>(0);

  const { exp } = useFeature({ kw: 'demo' });

  const handleMaxMultiScore = (value: number) => {
    setMaxMultiScore(value);
  };

  const handleMinMultiScore = (value: number) => {
    setMinMultiScore(value);
  };

  const updateMultiSelect = (data: string[]) => {
    setMultiSelectData(data);
  };

  const updateRanking = (data: RankOrder) => {
    setRankingData(data);
  };

  const updateMultiScore = (data: { [key: string]: number }) => {
    setMultiScore(data);
  };

  const router = useRouter();
  const updateScore = (score: number) => {
    setScoreData(score);
  };

  // Current impl: index is just the criterion label since each label has to be unique.
  const addCriterionForResponse = useCallback((index: string, value: string) => {
    setCriterionForResponse((prev) => {
      const updated = prev.map((c) => {
        const criterionTextId = index.split('::')[0];
        // if (c.text !== criterionTextId) return c; //IMPORTANT TODO: REINSTATE THIS BACK WHEN MORE CRITERION IS ADDED

        // For multi select, we need check if the value was selected before
        if (c.type === 'multi-select') {
          c.responses = c.responses || []; //init incase empty
          if (c.responses.includes(value)) {
            return { ...c, responses: c.responses.filter((r) => r !== value) };
          }
          return { ...c, responses: [...c.responses, value] };
        } else if (c.type === 'multi-score') {
          //multi-score index will be in this format (id::score)
          const tmpResponses = c.responses || {}; //init incase empty
          const tmpArr = index.split('::');
          const modelId = tmpArr.length > 1 ? tmpArr[1] : '';
          tmpResponses[modelId] = value as any; //backend will check so frontend its important to be string or number
          return { ...c, responses: { ...tmpResponses } };
        } else {
          // Single Scoring, Single Select wise we only nede 1 value
          return { ...c, responses: value as any };
        }
      });
      return updated;
    });
  }, []);
  const getCriterionForResponse = useCallback(() => criterionForResponse, [criterionForResponse]);
  const resetCriterionForResponse = useCallback((task: Task) => {
    setCriterionForResponse([
      ...task.taskData.criteria.map((c) => ({ ...c, type: c.type as any, responses: undefined })),
    ]); //Setting up the initial state with responses
  }, []);
  const resetCriterionForResponseNew = useCallback((task: TaskPayloadNew) => {
    const firstResponse = task.taskData.responses[0];
    if (firstResponse && 'criteria' in firstResponse) {
      setCriterionForResponse([
        ...firstResponse.criteria.map((c) => ({
          type: c.type as any,
          responses: undefined,
        })),
      ]);
    }
  }, []);
  const submitTaskNew = useCallback(
    async (preCallback?: (flag: boolean) => void, postCallback?: (flag: boolean) => void) => {
      if (!router) return;
      //Prepare the results data first
      const resultData = criterionForResponse.map((c) => {
        return { type: c.type, value: c.responses };
      });
      preCallback?.(true);
      const submitTaskRes = await submitTask(resultData as any);
      if (submitTaskRes?.success) {
        resetSubmissionError();
        postCallback?.(true);
        const nextTaskResponse = await fetchNextInProgressTask(getTaskIdFromRouter(router));
        if (nextTaskResponse?.nextInProgressTaskId) {
          router.replace(`/Questions?taskId=${nextTaskResponse.nextInProgressTaskId}`);
        } else {
          router.push('/task-list');
        }
      } else {
        postCallback?.(false);
      }
      //Then call the submit api
    },
    [criterionForResponse]
  );

  const handleSetIsMultiSelectQuestion = (value: boolean) => {
    setIsMultiSelectQuestion(value);
  };

  const handleSetIsRankQuestion = (value: boolean) => {
    setIsRankQuestion(value);
  };

  const handleSetIsMultiScore = (value: boolean) => {
    setIsMultiScore(value);
  };

  const handleSetIsSlider = (value: boolean) => {
    setIsSlider(value);
  };
  return (
    <SubmitContext.Provider
      value={{
        multiSelectData,
        rankingData: rankingData || {},
        scoreData,
        multiScore,
        triggerTaskPageReload,
        updateMultiSelect,
        updateRanking: (data: string[]) =>
          updateRanking(Object.fromEntries(data.map((item, index) => [item, index.toString()]))),
        updateScore,
        handleSubmit: submitTaskNew,
        handleSubmitNew: submitTaskNew,
        setTriggerTaskPageReload,
        submissionErr: error,
        resetSubmissionError,
        isSubscriptionModalLoading,
        setIsSubscriptionModalLoading,
        partnerCount,
        setPartnerCount,
        updateMultiScore,
        isMultiSelectQuestion,
        isRankQuestion,
        isMultiScore,
        isSlider,
        maxMultiScore,
        minMultiScore,
        handleSetIsMultiSelectQuestion,
        handleSetIsRankQuestion,
        handleSetIsMultiScore,
        handleSetIsSlider,
        handleMaxMultiScore,
        handleMinMultiScore,
        addCriterionForResponse,
        getCriterionForResponse,
        resetCriterionForResponse,
        resetCriterionForResponseNew,
      }}
    >
      {children}
    </SubmitContext.Provider>
  );
};
