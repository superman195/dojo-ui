import Datatablev2 from '@/components/Common/DataTable/Datatablev2';
import { NonRootNeuronObj } from '@/types/DashboardTypes';
import { getFirstAndLastCharacters } from '@/utils/math_helpers';
import { FontManrope, FontSpaceMono } from '@/utils/typography';
import { createColumnHelper } from '@tanstack/react-table';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useMemo } from 'react';
interface MinerData {
  hotkey: string;
  rank: number;
  emission: number;
  stakedAmt: number;
  minerWeight: number;
  performanceData: number[];
  historicalEmissions?: {
    blockNumber: number;
    blockTime: number;
    emission: number;
  }[];
}

interface LeaderboardProps {
  miners: NonRootNeuronObj[] | null;
  isLoading: boolean;
}

const PerformanceChart: React.FC<{ data: number[] }> = ({ data }) => {
  const options: Highcharts.Options = {
    chart: {
      type: 'area',
      height: 30,
      width: 80,
      backgroundColor: 'transparent',
      margin: [2, 0, 2, 0],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    xAxis: { visible: false },
    yAxis: { visible: false },
    legend: { enabled: false },
    credits: { enabled: false },
    tooltip: { enabled: false },
    plotOptions: {
      area: {
        marker: {
          enabled: false,
          states: {
            hover: { enabled: false },
          },
        },
        lineWidth: 2,
        states: {
          hover: { enabled: false },
        },
        lineColor: '#00B6A6',
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, 'rgba(0, 255, 255, 0.3)'],
            [1, 'rgba(0, 255, 255, 0)'],
          ],
        },
      },
    },
    series: [
      {
        type: 'area',
        data: data,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

const ShimmerRow: React.FC = () => (
  <tr className={`${FontManrope.className} h-11 animate-pulse border-b border-gray-100 text-lg font-bold`}>
    <td className="w-10">
      <div className="h-4 w-8 rounded bg-gray-200"></div>
    </td>
    <td className="w-10">
      <div className="h-4 w-20 rounded bg-gray-200"></div>
    </td>
    <td className="w-10">
      <div className="h-4 w-16 rounded bg-gray-200"></div>
    </td>
    <td className="w-10">
      <div className="h-4 w-24 rounded bg-gray-200"></div>
    </td>
    <td className="w-10">
      <div className="h-8 w-20 rounded bg-gray-200"></div>
    </td>
  </tr>
);

const LeaderboardTwo = ({ miners, isLoading }: LeaderboardProps) => {
  const columnHelper = createColumnHelper<NonRootNeuronObj>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('uid', {
        header: 'Position',
        size: 100,
        cell: (info) => `#${info.getValue() + 1}`,
      }),
      columnHelper.accessor('hotkey', {
        header: 'Miner',
        size: 100,
        cell: (info) => getFirstAndLastCharacters(info.getValue(), 5),
      }),
      columnHelper.accessor('minerWeight', {
        header: 'Score',
        size: 100,
        cell: (info) => {
          return Number(info.getValue()).toFixed(9);
        },
      }),
      columnHelper.accessor('emission', {
        header: 'Emission',
        size: 100,
        cell: (info) => info.getValue().toFixed(6),
      }),
      columnHelper.accessor('stakedAmt', {
        header: 'Staked Amount',
        size: 100,
        cell: (info) => info.getValue().toFixed(6),
      }),
      columnHelper.accessor('performanceData', {
        header: 'Performance',
        size: 100,
        cell: (info) => <PerformanceChart data={info.getValue()} />,
      }),
    ],
    []
  );
  return (
    <div className="pb-[30px]">
      <Datatablev2
        tableClassName="max-w-[892px]"
        minColumnSize={20}
        columnDef={columns}
        data={miners || []}
        pageSize={200}
      />
    </div>
  );
};

const Leaderboard: React.FC<LeaderboardProps> = ({ miners, isLoading }) => {
  return (
    <div className="mx-auto mb-6 max-w-4xl rounded-sm border-2 border-black bg-white p-4 shadow-brut-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className={`${FontSpaceMono.className} border-b-2 border-gray-200`}>
              <th className="pb-2 pr-4 text-left">POSITION</th>
              <th className="pb-2 pr-4 text-left">MINER</th>
              <th className="pb-2 pr-4 text-left">SCORE</th>
              {/* <th className="pb-2 pr-4 text-left">STAKED AMOUNT</th> */}
              <th className="pb-2 text-left">PERFORMANCE</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, index) => <ShimmerRow key={index} />)
              : miners?.slice(-10).map((miner, index) => (
                  <tr
                    key={miner.hotkey}
                    className={`${FontManrope.className} h-11 border-b border-gray-100 text-lg font-bold`}
                  >
                    <td className="w-10">#{index + 1}</td>
                    <td className="w-10">{getFirstAndLastCharacters(miner.hotkey, 5)}</td>
                    <td className="w-10">{miner.minerWeight}</td>
                    {/* <td className="w-10 opacity-60">{miner.stakedAmt.toFixed(6)}</td> */}
                    <td className="w-10">
                      <PerformanceChart data={miner.performanceData} />
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTwo;
