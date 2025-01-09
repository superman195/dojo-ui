import useFeature from '@/hooks/useFeature';
import useGetNextInProgressTask from '@/hooks/useGetNextTask';
import { useSubmitTaskNew } from '@/hooks/useSubmitTaskNew';
import { RankOrder, SubmitContextType } from '@/types/ProvidersTypes';
import { Criterion, ResponseWithResponseCriterion, Task } from '@/types/QuestionPageTypes';
import { getTaskIdFromRouter } from '@/utils/general_helpers';
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
  const [allResponses, setAllResponses] = useState<ResponseWithResponseCriterion[]>([]);
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

  // Versioned 27 dec 2024 feedbackloop act-1
  const addCriterionForResponse = useCallback((modelId: string, criteriaObject: Criterion, value: string) => {
    // List of reponses
    setAllResponses((prev) => {
      //       {
      //   "resultData": [
      //     {
      //       "model": "anthropic/claude-3.5-sonnet_0_0",
      //       "criteria": [
      //         {
      //           "value": 10,
      //           "type": "score"
      //         }
      //       ],

      //     },
      //     {
      //       "model": "anthropic/claude-3.5-sonnet_0_0",
      //       "criteria": [
      //         {
      //           "value": 100,
      //           "type": "score"
      //         }
      //       ],

      //     }
      //   ]
      // }

      const tmpFiltered = prev.find((c) => c.model === modelId); //This will get the one with the modelId, if empty means not initialised
      if (!tmpFiltered) {
        console.error('No model found for', modelId);
        return prev;
      }
      const updatedObj = { ...tmpFiltered, criteria: [{ ...tmpFiltered.criteria[0], value: value as any }] };
      const updated = prev.map((c) => {
        if (c.model === modelId) {
          // Current version as of 27 dec 2024 just have to replace all criteria with the new value
          // This is because it is guaranteed to only have 1 criteria, and criteria have no id to differentiate yet
          return updatedObj;
        }
        return c;
      });
      console.log('updated', updated);
      return updated;
    });
  }, []);
  const getCriterionForResponse = useCallback(() => allResponses, [allResponses]);
  const resetCriterionForResponse = useCallback((task: Task) => {
    // Setting up so that it takes the initial response and remove "completion" key
    // inside responses, and giving all criteria a value of undefined
    setAllResponses([
      ...task.taskData.responses.map((r) => ({
        model: r.model,
        criteria: [...r.criteria.map((c) => ({ ...c, value: undefined }))],
      })),
    ]);
    // setCriterionForResponse([
    //   ...task.taskData.criteria.map((c) => ({ ...c, type: c.type as any, responses: undefined })),
    // ]); //Setting up the initial state with responses
  }, []);

  // Versioned 27 dec 2024 feedbackloop act-1
  const submitTaskNew = useCallback(
    async (preCallback?: (flag: boolean) => void, postCallback?: (flag: boolean) => void) => {
      if (!router) return;
      //Prepare the results data first
      preCallback?.(true);
      const submitTaskRes = await submitTask(allResponses as any);
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
    [allResponses]
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
      }}
    >
      {children}
    </SubmitContext.Provider>
  );
};
