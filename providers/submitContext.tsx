import useFeature from '@/hooks/useFeature';
import useGetNextInProgressTask from '@/hooks/useGetNextTask';
import { useSubmitTaskNew } from '@/hooks/useSubmitTaskNew';
import { SubmitContextType } from '@/types/ProvidersTypes';
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
  const { fetchNextInProgressTask } = useGetNextInProgressTask();
  const [triggerTaskPageReload, setTriggerTaskPageReload] = useState<boolean>(false);
  const [isSubscriptionModalLoading, setIsSubscriptionModalLoading] = useState<boolean>(true);
  const [partnerCount, setPartnerCount] = useState(0);

  const { exp } = useFeature({ kw: 'demo' });

  const router = useRouter();

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

      // If multi-select (string[]), it will remove if exist, add if not exist
      // Anything else will do a complete replace since its just a string or number value
      const updated = prev.map((c) => {
        if (c.model === modelId) {
          const tmpCriteria = c.criteria.find((c) => c.query === criteriaObject.query); // Currently i am using text to match. It should be using unique ID.
          if (tmpCriteria?.type === 'multi-select') {
            // if exist remove, if not exist add
            if (tmpCriteria.value?.includes(value)) {
              tmpCriteria.value = tmpCriteria.value.filter((v: any) => v !== value);
            } else {
              tmpCriteria.value = [...(tmpCriteria.value ?? []), value];
            }
          } else {
            if (tmpCriteria) {
              tmpCriteria.value = value as any;
            } else {
              c.criteria.push({ ...criteriaObject, value: value as any });
            }
          }
          return c;
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

  return (
    <SubmitContext.Provider
      value={{
        triggerTaskPageReload,
        handleSubmit: submitTaskNew,
        handleSubmitNew: submitTaskNew,
        setTriggerTaskPageReload,
        submissionErr: error,
        resetSubmissionError,
        isSubscriptionModalLoading,
        setIsSubscriptionModalLoading,
        partnerCount,
        setPartnerCount,
        addCriterionForResponse,
        getCriterionForResponse,
        resetCriterionForResponse,
      }}
    >
      {children}
    </SubmitContext.Provider>
  );
};
