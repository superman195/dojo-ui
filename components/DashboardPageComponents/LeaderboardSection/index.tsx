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
    <div className="container mx-auto px-0 lg:px-8">
      <div className="my-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
        <h2 className={`${FontSpaceMono.className} text-2xl font-bold uppercase sm:text-4xl`}>LEADERBOARD</h2>
        <label className="flex cursor-pointer items-center gap-3 text-sm sm:text-base">
          <span className={`${FontManrope.className} whitespace-nowrap font-semibold text-gray-700`}>
            Showing: {showValidators ? 'Validators' : 'Miners'}
          </span>
          <div className="relative">
            <input type="checkbox" checked={showValidators} onChange={toggleLeaderboard} className="sr-only" />
            <div className="block h-5 w-9 rounded-full bg-gray-600 sm:h-6 sm:w-10"></div>
            <div
              className={`absolute left-1 top-1 size-3 rounded-full bg-white transition sm:size-4 ${
                showValidators ? 'translate-x-full bg-[#00B6A6]' : ''
              }`}
            ></div>
          </div>
        </label>
      </div>
      <div className="overflow-x-auto">
        {showValidators ? (
          <ValidatorLeaderboard validators={validators} isLoading={loading} />
        ) : (
          <MinerLeaderboard miners={miners} isLoading={loading} />
        )}
      </div>
    </div>
  );
};

export default LeaderboardSection;
