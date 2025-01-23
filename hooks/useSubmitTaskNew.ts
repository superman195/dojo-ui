import { tokenType } from '@/utils/states';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitTaskResponse } from './useSubmitTask';

export const useSubmitTaskNew = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<SubmitTaskResponse | null>(null);
  const resetError = () => setError(null);

  // This function returns the body if success and null if unsucceessful.
  // You can also use the error response and loading states if you like.
  const submitTask = async (submitPayload: any) => {
    try {
      setLoading(true);
      console.log('Payload just before submitting', submitPayload);
      const taskId = String(router.query.taskId || '');
      const jwtToken = localStorage.getItem(tokenType);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tasks/submit-result/${taskId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          resultData: submitPayload,
        }),
      });
      const data: SubmitTaskResponse = await response.json();
      if (response.ok && !data.error) {
        setResponse(data);
        setLoading(false);
        return data;
      } else {
        setError(data.error || `HTTP error! status: ${response.status}`);
      }
      setLoading(false);
      return null;
    } catch (err) {
      setLoading(false);
      setError('Unexpected error while submitting task. Please try again later.');
      return null;
    }
  };
  return { submitTask, loading, error, resetError, response };
};
