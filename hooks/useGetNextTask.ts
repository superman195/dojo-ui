import { getFromLocalStorage } from '@/utils/general_helpers';
import { useCallback, useState } from 'react';

export interface NextTaskResponse {
  nextInProgressTaskId: string;
}

export interface TaskResponse {
  success: boolean;
  body: NextTaskResponse | null;
  error: string | null;
}

const useGetNextInProgressTask = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const tokenType = `dojoui__jwtToken`;
  const jwtToken = getFromLocalStorage(tokenType);

  const fetchNextInProgressTask = useCallback(
    async (taskId: string): Promise<NextTaskResponse | null> => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tasks/next-task/${taskId}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (!response.ok) throw new Error(`Error fetching task: ${response.statusText}`);
        const data: TaskResponse = await response.json();

        // throw error if success is false
        if (!data.success && data.error) throw new Error(data.error);
        return data.body;
      } catch (error: any) {
        setError(error?.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [jwtToken]
  );

  return { loading, error, fetchNextInProgressTask };
};

export default useGetNextInProgressTask;
