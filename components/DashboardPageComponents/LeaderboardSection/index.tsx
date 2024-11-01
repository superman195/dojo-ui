import { NonRootNeuronObj } from '@/types/DashboardTypes';
import { FontSpaceMono } from '@/utils/typography';
import LeaderboardTwo from './Leaderboard';

interface LeaderboardSectionProps {
  miners: NonRootNeuronObj[];
  loading: boolean;
  error?: string | null;
}

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ miners, loading, error }) => {
  if (error) {
    return <div>Error loading leaderboard: {error}</div>;
  }

  return (
    <>
      <div className="my-5">
        <h2 className={`${FontSpaceMono.className} text-4xl font-bold`}>LEADERBOARD</h2>
      </div>
      <LeaderboardTwo miners={miners} isLoading={loading} />
    </>
  );
};

export default LeaderboardSection;
