import { getFromLocalStorage } from '@/utils/general_helpers';
import { useState, useEffect } from 'react';

interface Partner {
  id: string;
  name: string;
  // Add other relevant fields
}

interface UsePartnerListResult {
  partners: Partner[];
  isLoading: boolean;
  error: Error | null;
}

export const usePartnerList = (): UsePartnerListResult => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const jwtToken = getFromLocalStorage('token');
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
        setPartners(data); // Assuming the JSON response is an array of partners
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []); // Empty dependency array means this effect will only run once after the initial render

  return { partners, isLoading, error };
};