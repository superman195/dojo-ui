import { useQuery } from '@tanstack/react-query';

enum MetricsType {
  TOTAL_NUM_COMPLETED_TASKS = 'total_num_completed_tasks',
}

interface CompletedTasksCountResponse {
  success: boolean;
  body: {
    numCompletedTasks: string;
  } | null;
  error: string | null;
}

const fetchCompletedTasksCount = async (): Promise<CompletedTasksCountResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/metrics/completed-tasks-count`);
  return response.json();
};

const useCompletedTasksCount = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['completedTasksCount'],
    queryFn: fetchCompletedTasksCount,
    refetchInterval: 10000,
  });

  const numCompletedTasks = data?.success && data.body ? parseInt(data.body.numCompletedTasks, 10) : null;

  return {
    numCompletedTasks,
    loading: isLoading,
    error: error ? 'Failed to fetch completed tasks count' : data?.error || null,
  };
};

export default useCompletedTasksCount;
