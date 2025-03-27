import { Task } from '@/types/QuestionPageTypes';
import { getFromLocalStorage, wait } from '@/utils/general_helpers';
import { tasklistFull } from '@/utils/states';
import { useEffect, useState } from 'react';
import useFeature from './useFeature';

const getCorrectS3UrlByUrl = (s3Url: string, taskType: string) => {
  try {
    if (taskType === 'TEXT_TO_THREE_D') {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}${s3Url}`;
    }
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // is localhost or dev
      return `https://dev.dojo.network${s3Url}`;
    }

    return s3Url;
  } catch (err) {
    console.log('Invalid URL:', s3Url);
    console.error(err);
  }
};

const useRequestTaskByTaskID = (taskId: string, isConnected?: boolean, isAuthenticated?: boolean) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { exp } = useFeature({ kw: 'demo' });

  useEffect(() => {
    const tokenType = `dojoui__jwtToken`;
    const jwtToken = getFromLocalStorage(tokenType);
    const fetchDemoTask = async () => {
      if (exp) {
        // FInd one demo response if not just return the first one
        setLoading(true);
        await wait(200);
        const filteredTask = tasklistFull.find((t) => t.taskId === taskId);
        if (!filteredTask) {
          setTask(tasklistFull[0]);
          setLoading(false);
          return;
        }

        //For these 2 types we are storing the demo files in the S3 bucket thats why
        //We need to process it by getting the correct url.
        if (filteredTask.type === 'TEXT_TO_THREE_D' || filteredTask.type === 'TEXT_TO_IMAGE') {
          filteredTask.taskData.responses.forEach((r: any) => {
            r.completion.url = getCorrectS3UrlByUrl(r.completion.url, filteredTask.type);
          });
        }
        setTask(filteredTask);
        setLoading(false);
        return;
      }
    };
    const fetchTask = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTask(data.body);
        } else {
          setError(data.error || `HTTP error! status: ${response.status}`);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (exp) {
      fetchDemoTask();
    } else if (isConnected && isAuthenticated && taskId) {
      fetchTask();
    } else {
      setTask(null);
    }
  }, [taskId, isConnected, isAuthenticated, exp]); // jwtToken is not a dependency anymore since it's fetched inside the effect

  return { task, loading, error };
};

export default useRequestTaskByTaskID;
