import useSubmitTask from '@/hooks/useSubmitTask';
import { useRouter } from 'next/router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface SubmitContextType {
  multiSelectData: string[];
  rankingData: any;
  scoreData: number;
  multiValues: { [key: string]: number };
  updateMultiSelect: (data: string[]) => void;
  updateRanking: (data: string[]) => void;
  updateScore: (score: number) => void;
  updateMultiValues: (data: { [key: string]: number }) => void;
  handleSubmit: Function;
  triggerTaskPageReload: boolean;
  setTriggerTaskPageReload: React.Dispatch<React.SetStateAction<boolean>>;
  submissionErr: string | null;
  setSubmissionErr: Function;
  isSubscriptionModalLoading: boolean;
  setIsSubscriptionModalLoading: Function;
  partnerCount: number;
  setPartnerCount: React.Dispatch<React.SetStateAction<number>>;
}

const SubmitContext = createContext<SubmitContextType | undefined>(undefined);

export const useSubmit = () => {
  const context = useContext(SubmitContext);
  if (!context) {
    throw new Error('useSubmit must be used within a SubmitProvider');
  }
  return context;
};

type RankOrder = { [key: string]: string };

export const SubmitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [multiSelectData, setMultiSelectData] = useState<string[]>([]);
  const [rankingData, setRankingData] = useState<any>();
  const [scoreData, setScoreData] = useState<number>(0);
  const [multiValues, setMultiValues] = useState<any>();
  const [triggerTaskPageReload, setTriggerTaskPageReload] = useState<boolean>(false);
  const [submissionErr, setSubmissionErr] = useState<string | null>(null);
  const [isSubscriptionModalLoading, setIsSubscriptionModalLoading] = useState<boolean>(true);
  const [partnerCount, setPartnerCount] = useState(0);
  const updateMultiSelect = (data: string[]) => {
    setMultiSelectData(data);
    console.log(multiSelectData);
  };

  const updateRanking = (data: RankOrder) => {
    setRankingData(data);
  };

  const updateMultiValues = (data: { [key: string]: number }) => {
    setMultiValues((prevMultiValues: any) => {
      const updatedMultiValues = { ...prevMultiValues, ...data };
      return updatedMultiValues;
    });
  };

  const router = useRouter();
  const updateScore = (score: number) => {
    setScoreData(score);
  };
  const { submitTask, response, error } = useSubmitTask();
  const handleSubmit = async () => {
    if (!router.isReady) return;

    const taskId = String(router.query.taskId || '');

    if (rankingData || scoreData || multiSelectData.length > 0 || multiValues) {
      console.log('submitting task');
      await submitTask(taskId, multiSelectData, rankingData, scoreData, multiValues);
      if (error) {
        console.log('WORKED >>> ', error);
        setSubmissionErr(error);
        return;
      }
      setSubmissionErr(null);
      router.push('/');
    }
  };

  useEffect(() => {
    if (error) {
      setSubmissionErr(error);
    }
  }, [error]);

  return (
    <SubmitContext.Provider
      value={{
        multiSelectData,
        rankingData: rankingData || {},
        scoreData,
        multiValues,
        triggerTaskPageReload,
        updateMultiSelect,
        updateRanking: (data: string[]) =>
          updateRanking(Object.fromEntries(data.map((item, index) => [item, index.toString()]))),
        updateScore,
        handleSubmit,
        setTriggerTaskPageReload,
        submissionErr,
        setSubmissionErr,
        isSubscriptionModalLoading,
        setIsSubscriptionModalLoading,
        partnerCount,
        setPartnerCount,
        updateMultiValues
      }}
    >
      {children}
    </SubmitContext.Provider>
  );
};
