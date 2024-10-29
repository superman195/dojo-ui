import { useSearchParams } from 'next/navigation';

/***
 * This hook is used to determine if a feature is enabled or not.
 * exmaple:
 * const { exp } = useFeature({ kw: 'demo' });
 */
type props = { kw: string; addParams?: string };
const useFeature = ({ kw, addParams }: props) => {
  const params = useSearchParams();
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  // Remove the last clause after we dont need the demo anymore
  if (url?.includes('dev') || url?.includes('testnet') || !url || url?.includes('tensorplex')) {
    const exp = params.get('exp') === kw;
    const info = !addParams || params.get('addParams') === addParams;
    return { exp: exp && info };
  } else {
    return { exp: false };
  }
};

export default useFeature;
