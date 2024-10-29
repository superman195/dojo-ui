import { useAuth } from '@/providers/authContext';
import { TaskPageContext } from '@/providers/taskPageContext';
import { Task } from '@/types/QuestionPageTypes';
import { getFromLocalStorage, wait } from '@/utils/general_helpers';
import { tasklistFull } from '@/utils/states';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import useFeature from './useFeature';

export const taskStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
} as const;

export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

export interface Pagination {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface TasksResponse {
  success: boolean;
  body: {
    tasks: Task[];
    pagination: Pagination;
  };
  error: string | null;
}

const useGetTasks = (
  page: number,
  limit: number,
  taskQuery: string,
  sort: string,
  order: string,
  isAuthenticated: boolean,
  isConnected: boolean,
  yieldMin?: number,
  yieldMax?: number
) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isFetchingRef = useRef<boolean>(false);
  const { address } = useAccount();
  const { partnerCount } = useContext(TaskPageContext);
  const { exp } = useFeature({ kw: 'demo' });
  const { workerLogout } = useAuth();

  //React Query is the best to handle race conditions, debouncing, caching, etc.
  //Just include the dependencies, and dont have to call refetch anywhere unless
  //u need to fetch from the server again. For somethings dont have to be fetched from the server always.
  //There is one refetch in task-list that will do it once every 2 minutes. THat's enough.
  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      'refetchTaskList',
      exp,
      partnerCount,
      isConnected,
      isAuthenticated,
      taskQuery,
      yieldMin,
      yieldMax,
      page,
      limit,
      sort,
      order,
    ],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        if (!router.isReady) return null;

        await wait(500);
        if (exp) {
          return await fetchDemoTasks();
        } else {
          if (!isAuthenticated || !isConnected) {
            return null;
          }
          return await fetchTasks();
        }
      } catch (err) {
        console.error(err);
        return null;
      }
    },
  });
  const fetchDemoTasks = useCallback(async () => {
    await wait(100);
    setPagination({
      pageNumber: 1,
      pageSize: 50,
      totalPages: Math.ceil(tasklistFull.length / 50),
      totalItems: tasklistFull.length,
    });
    if (taskQuery.toLowerCase() === 'all') {
      return tasklistFull;
    } else {
      const filteredTaskList: Task[] = [];
      taskQuery.split(',').forEach((task) => {
        tasklistFull.filter((t) => {
          if (t.type.toLowerCase() === task.toLowerCase()) {
            filteredTaskList.push(t);
          }
        });
      });
      return filteredTaskList;
    }
  }, [taskQuery]);

  const fetchTasks = useCallback(async () => {
    try {
      const yieldMinQuery = yieldMin ? `&yieldMin=${yieldMin}` : '';
      const yieldMaxQuery = yieldMax ? `&yieldMax=${yieldMax}` : '';
      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tasks/?page=${page}&limit=${limit}&task=${taskQuery}&sort=${sort}${yieldMinQuery}${yieldMaxQuery}&order=${order}`;

      const jwtToken = getFromLocalStorage(`dojoui__jwtToken`);

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (response.status === 401) {
        workerLogout();
      }
      const data: TasksResponse = await response.json();

      if (response.ok) {
        return data.body;
      } else {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
    } catch (e: any) {
      throw new Error(e);
    }
  }, [page, limit, taskQuery, sort, order, yieldMin, yieldMax, workerLogout]);

  useEffect(() => {
    if (exp) {
      //There used to be things here but after react query is implemented, no more janky calls
    } else if (!isAuthenticated || !isConnected) {
      setTasks([]);
      setPagination(null);
      setError('No JWT token found');
      return;
    } else {
      //There used to be things here but after react query is implemented, no more janky calls
    }
  }, [isAuthenticated, isConnected, address, exp, refetch, router.isReady, partnerCount]);
  useEffect(() => {
    if (isLoading || queryError || !data) {
      return;
    }
    if ('tasks' in data) {
      //Whatever happens, as long as tasks is in data means its live data
      setTasks(data.tasks);
      setPagination(data.pagination);
    } else {
      //and as long as tasks is not in data, means its exp, means we just assume is exp.
      //we do not do additional checks here because we trust the react query to return correct things
      //and react query does not let us down.
      setPagination({
        pageNumber: 1,
        pageSize: 50,
        totalPages: Math.ceil(tasklistFull.length / 50),
        totalItems: tasklistFull.length,
      });
      setTasks(data);
    }
  }, [data, isLoading, queryError]);

  return { tasks, pagination, loading: isLoading, queryError: queryError || error, refetchTasks: refetch };
};

export default useGetTasks;
