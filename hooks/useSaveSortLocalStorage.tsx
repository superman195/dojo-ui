import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const useSaveSortLocalStorage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const saveSortToLocalStorage = useCallback((sort: string, order: string) => {
    if (sort && order) {
      localStorage.setItem('sort', sort);
      localStorage.setItem('order', order);
    }
  }, []);

  const applySortToUrl = useCallback(() => {
    const sort = localStorage.getItem('sort');
    const order = localStorage.getItem('order');

    if (sort && order) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', sort);
      params.set('order', order);
      router.push(`?${params.toString()}`);
    }
  }, [router, searchParams]);

  return { saveSortToLocalStorage, applySortToUrl };
};

export default useSaveSortLocalStorage;
