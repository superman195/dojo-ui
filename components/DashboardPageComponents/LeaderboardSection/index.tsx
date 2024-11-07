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
        <label className="flex cursor-pointer items-center">
          <div className="relative">
            <input type="checkbox" checked={showValidators} onChange={toggleLeaderboard} className="sr-only" />
            <div className="block h-8 w-14 rounded-full bg-gray-600"></div>
            <div
              className={`dot absolute left-1 top-1 size-6 rounded-full bg-white transition ${
                showValidators ? 'translate-x-full bg-[#00B6A6]' : ''
              }`}
            ></div>
          </div>
          <span className={`${FontManrope.className} ml-3 font-semibold text-gray-700`}>
            {showValidators ? 'Show Miners' : 'Show Validators'}
          </span>
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
