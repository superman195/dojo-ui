import { getFromLocalStorage } from '@/utils/general_helpers';
import { useState } from 'react';

interface DisableMinerResponse {
  success: boolean;
  body: {
    message: string;
  };
  error: string | null;
}

const useDisableMinerByWorker = () => {
  const [response, setResponse] = useState<DisableMinerResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const tokenType = `dojoui__jwtToken`;
  const jwtToken = getFromLocalStorage(tokenType);

  const disableMinerByWorker = async (
    minerSubscriptionKey: string,
    toDisable: boolean
  ): Promise<DisableMinerResponse | null> => {
    setLoading(true);
    setResponse(null); // Clear the response cache
    setError(null); // Clear any previous errors

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/worker/partner/disable`;
      const payload = {
        minerSubscriptionKey: minerSubscriptionKey,
        toDisable: toDisable,
      };
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data: DisableMinerResponse = await response.json();
      console.log('response', data);

      if (response.ok) {
        console.log('response', data);
        setResponse(data);
        return data;
      } else {
        console.log('response', data);
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { disableMinerByWorker, response, loading, error };
};

export default useDisableMinerByWorker;
