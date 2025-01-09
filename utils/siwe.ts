import { SiweMessage } from 'siwe';

export const fetchNonce = async (address: string) => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/${address}`;
  const method = 'GET';
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.error('Network response was not ok. Status:', response.status);
      console.error('Response:', response);
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // Extracting 'nonce' from the response body if available
    const _nonce = data.body && data.body.nonce ? data.body.nonce : undefined;
    console.log(`Nonce fetched successfully: ${_nonce}`);
    return _nonce;
  } catch (error) {
    console.error('There was a problem with your fetch operation:', url, error);
    throw error;
  }
};
export const createSiweMessage = (address: string, nonce: string, statement: string, chainId: number) => {
  if (typeof window !== 'undefined') {
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement,
      uri: window.location.origin,
      version: '1',
      chainId: chainId,
      nonce: nonce,
    });
    const preparedMessage = message.prepareMessage();
    console.log('preparedMessage SIWE:', preparedMessage);
    return preparedMessage;
  }
  return '';
};
