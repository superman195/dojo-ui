import { useQuery } from '@tanstack/react-query';

const fetchCompletedTasksByInterval = async (dateFrom: number, dateTo: number, intervalDays: number) => {
  const response = await fetch(
    `https://dojo-api-testnet.tensorplex.ai/api/v1/metrics/completed-tasks-by-interval?dateFrom=${dateFrom}&dateTo=${dateTo}&intervalDays=${intervalDays}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return (await response.json()).body as {
    dataPoints: {
      timestamp: number;
      numCompletedTasks: number;
    }[];
    dateFrom: number;
    dateTo: number;
    intervalDays: number;
  };
};

const useCompletedTasksByInterval = (dateFrom: number, dateTo: number, intervalDays: number = 1) => {
  return useQuery({
    queryKey: ['completedTasksByInterval', dateFrom, dateTo, intervalDays],
    queryFn: async () => fetchCompletedTasksByInterval(dateFrom, dateTo, intervalDays),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2, // Retry failed requests up to 2 times
  });
};

export default useCompletedTasksByInterval;
