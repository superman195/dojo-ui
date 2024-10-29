import { getFromLocalStorage } from '@/utils/general_helpers';
import { tokenType } from '@/utils/states';
import { useState } from 'react';

export interface SubmitTaskResponse {
  success: string;
  body: {
    numResults: number;
  };
  error: null | string;
}
type RankOrder = { [key: string]: string };
interface ResultDataItem {
  type: string;
  value: string | RankOrder | string[];
}

interface SubmitTaskPayload {
  taskId: string;
  criteria: any[]; // This should be detailed according to the actual criteria structure
  resultData: ResultDataItem[];
}

const useSubmitTask = () => {
  const [response, setResponse] = useState<SubmitTaskResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const jwtToken = getFromLocalStorage(tokenType);
  const convertPercentageToRange = (percentage: number, min: number, max: number): number => {
    return parseFloat((min + (percentage / 10) * (max - min)).toFixed(3));
  };
  const submitTask = async (
    taskId: string,
    multiSelectData: string[],
    rankingData: RankOrder,
    scoreData: number,
    multiScore: number[],
    isMultiSelectQuestion: boolean,
    isRankQuestion: boolean,
    isMultiScore: boolean,
    isSlider: boolean,
    maxMultiScore: number,
    minMultiScore: number
  ) => {
    setLoading(true);
    const reversedRankingData: RankOrder = rankingData
      ? Object.fromEntries(Object.entries(rankingData).map(([key, value]) => [parseInt(value) + 1, key]))
      : {};
    console.log(taskId);
    try {
      const resultData = [];
      isMultiSelectQuestion && resultData.push({ type: 'multi-select', value: multiSelectData });
      isRankQuestion && resultData.push({ type: 'ranking', value: reversedRankingData });
      isSlider && resultData.push({ type: 'score', value: scoreData });

      if (isMultiScore) {
        const convertedMultiScores = Object.fromEntries(
          Object.entries(multiScore).map(([key, value]) => [
            key,
            convertPercentageToRange(value, minMultiScore, maxMultiScore),
          ])
        );
        resultData.push({ type: 'multi-score', value: convertedMultiScores });
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tasks/submit-result/${taskId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          resultData,
        }),
      });
      const data: SubmitTaskResponse = await response.json();
      if (response.ok) {
        setResponse(data);
        // window.location.href = '/';
      } else {
        setError(data.error || `HTTP error! status: ${response.status}`);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { submitTask, response, loading, error, jwtToken };
};

export default useSubmitTask;
