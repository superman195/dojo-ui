import { getFromLocalStorage } from '@/utils/general_helpers';
import { useState } from 'react';

interface UpdateWorkerPartnerResponse {
  success: boolean;
  body: {
    minerSubscriptionKey: string;
    name: string;
  };
  error: string | null;
}

const useUpdateWorkerPartner = () => {
  const [response, setResponse] = useState<UpdateWorkerPartnerResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateWorkerPartner = async (
    minerSubscriptionKey: string,
    newMinerSubscriptionKey: string,
    name: string
  ): Promise<UpdateWorkerPartnerResponse | null> => {
    setLoading(true);
    setResponse(null); // Clear the response cache
    setError(null); // Clear any previous errors

    try {
      const payload = {
        minerSubscriptionKey: minerSubscriptionKey,
        newMinerSubscriptionKey: newMinerSubscriptionKey,
        name: name,
      };
      const tokenType = `dojoui__jwtToken`;
      const jwtToken = getFromLocalStorage(tokenType);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/partner/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data: UpdateWorkerPartnerResponse = await response.json();

      if (response.ok) {
        setResponse(data);
        console.log('response', data);
        return data;
      } else {
        console.log('response', data.error);
        setError(data.error);
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateWorkerPartner, response, loading, error };
};

export default useUpdateWorkerPartner;
