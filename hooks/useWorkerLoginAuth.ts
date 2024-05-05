import { useState } from 'react';

export interface LoginAuthResponse {
  success: boolean;
  body?: {
    token: string;
  };
  error?: string;
}

export interface LoginAuthPayload {
  walletAddress: string;
  chainId: string;
  signature: string;
  message: string;
  timestamp: string;
  nonce?: string;
}

const useWorkerLoginAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const workerLoginAuth = async (payload: LoginAuthPayload) => {
    setLoading(true);
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/worker/login/auth`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(payload),
      });

      const data: LoginAuthResponse = await response.json();

      if (response.ok && data.success) {
        if (data.body?.token) {
            localStorage.setItem('jwtToken', data.body.token);

          } else {
            throw new Error('Token is undefined');
          }
        } else {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { workerLoginAuth, loading, error };
};

export default useWorkerLoginAuth;