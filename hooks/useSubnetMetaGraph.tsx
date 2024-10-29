import { SubnetData } from '@/types/DashboardTypes';
import { useEffect, useState } from 'react';

const useSubnetMetagraph = (subnetId: number) => {
  const [data, setData] = useState<SubnetData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubnetMetagraph = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://delegate.tensorplex.ai/api/subnets/${subnetId}?type=metagraph`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.body);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSubnetMetagraph();
  }, [subnetId]);

  return { data, loading, error };
};

export default useSubnetMetagraph;
