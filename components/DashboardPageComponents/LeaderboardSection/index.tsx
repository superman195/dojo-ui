import { NonRootNeuronObj } from '@/types/DashboardTypes';
import { FontManrope, FontSpaceMono } from '@/utils/typography';
import React, { useState } from 'react';
import MinerLeaderboard from './MinerLeaderboard';
import ValidatorLeaderboard from './ValidatorLeaderboard';

interface LeaderboardSectionProps {
  miners: NonRootNeuronObj[];
  validators: NonRootNeuronObj[];
  loading: boolean;
  error?: string | null;
}

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ miners, validators, loading, error }) => {
  const [showValidators, setShowValidators] = useState(false);

  if (error) {
    return <div>Error loading leaderboard: {error}</div>;
  }

  const toggleLeaderboard = () => {
    setShowValidators((prev) => !prev);
  };

  return (
    <>
      <div className="my-5 flex items-center justify-between">
        <h2 className={`${FontSpaceMono.className} text-4xl font-bold uppercase`}>
          {showValidators ? 'Validators' : 'Miners'} LEADERBOARD
        </h2>
        <label className="flex cursor-pointer items-center gap-3">
          <span className={`${FontManrope.className} font-semibold text-gray-700`}>
            Showing: {showValidators ? 'Validators' : 'Miners'}
          </span>
          <div className="relative">
            <input type="checkbox" checked={showValidators} onChange={toggleLeaderboard} className="sr-only" />
            <div className="block h-6 w-10 rounded-full bg-gray-600"></div>
            <div
              className={`absolute left-1 top-1 size-4 rounded-full bg-white transition ${
                showValidators ? 'translate-x-full bg-[#00B6A6]' : ''
              }`}
            ></div>
          </div>
        </label>
      </div>
      {showValidators ? (
        <ValidatorLeaderboard validators={validators} isLoading={loading} />
      ) : (
        <MinerLeaderboard miners={miners} isLoading={loading} />
      )}
    </>
  );
};

export default LeaderboardSection;
