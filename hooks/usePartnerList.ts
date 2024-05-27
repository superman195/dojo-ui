import { getFromLocalStorage } from '@/utils/general_helpers';
import { useState, useEffect } from 'react';

interface Partner {
  createdAt: any;
  subscriptionKey: any;
  id: string;
  name: string;
  // Add other relevant fields
}

interface UsePartnerListResult {
  partners: Partner[];
  isLoading: boolean;
  error: Error | null;
}

export const usePartnerList = (refetchDependency: any): UsePartnerListResult => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const jwtToken = getFromLocalStorage('jwtToken');
    const fetchPartners = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/worker/partner/list`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`
            },
          });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPartners(data.body.partners); // Assuming the JSON response is an array of partners
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, [refetchDependency]);

  return { partners, isLoading, error };
};