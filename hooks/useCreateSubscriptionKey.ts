import { getFromLocalStorage } from '@/utils/general_helpers';
import { tokenType } from '@/utils/states';
import { useState } from 'react';

interface CreateSubscriptionKeyResponse {
  success: boolean;
  body: string;
  error: string | null;
}

interface SubscriptionKeyData {
  name: string;
  minerSubscriptionKey: string;
}

export const useCreateSubscriptionKey = () => {
  const [response, setResponse] = useState<CreateSubscriptionKeyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const jwtToken = getFromLocalStorage(tokenType);

  const createSubscriptionKey = async (data: SubscriptionKeyData): Promise<CreateSubscriptionKeyResponse | null> => {
    setIsLoading(true);
    setResponse(null); // Clear the response cache
    setError(null); // Clear any previous errors

    try {
      const getData = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/worker/partner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(data),
      });

      const result = await getData.json();
      if (!getData.ok) {
        throw new Error(result.error || 'Failed to create subscription key');
      }
      setResponse(result);
      console.log('response', result);
      return result;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createSubscriptionKey, response, isLoading, error };
};
