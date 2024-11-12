import { useRouter } from 'next/router';
import { useCallback } from 'react';
import useSaveSortLocalStorage from './useSaveSortLocalStorage';

const useSorting = () => {
  const router = useRouter();
  const { saveSortToLocalStorage, applySortToUrl } = useSaveSortLocalStorage();

  const updateOrderSorting = useCallback(
    (order: string) => {
      const newQuery = {
        ...router.query,
        order: order,
      };

      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );

      saveSortToLocalStorage(router.query.sort as string, order);
    },
    [router, saveSortToLocalStorage]
  );

  const updateSorting = useCallback(
    (sort: string) => {
      let sortQuery: string;
      switch (sort) {
        case 'Most Attempted':
          sortQuery = 'numResults';
          break;
        case 'Most Recent':
          sortQuery = 'createdAt';
          break;
        case 'Least Difficult':
          sortQuery = 'numCriteria';
          break;
        default:
          sortQuery = 'createdAt';
      }
      const newQuery = {
        ...router.query,
        sort: sortQuery,
      };

      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
      saveSortToLocalStorage(sortQuery, router.query.order as string);
    },
    [router, saveSortToLocalStorage]
  );

  return { updateSorting, updateOrderSorting };
};

export default useSorting;
