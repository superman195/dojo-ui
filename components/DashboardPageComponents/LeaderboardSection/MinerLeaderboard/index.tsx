import Datatablev2 from '@/components/Common/DataTable/Datatablev2';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { NonRootNeuronObj } from '@/types/DashboardTypes';
import { getFirstAndLastCharacters } from '@/utils/math_helpers';
import { cn } from '@/utils/tw';
import { FontSpaceMono } from '@/utils/typography';
import { IconChevronDown, IconChevronsLeft, IconChevronsRight, IconChevronUp } from '@tabler/icons-react';
import { createColumnHelper } from '@tanstack/react-table';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useMemo, useState } from 'react';

interface LeaderboardProps {
  miners: NonRootNeuronObj[] | null;
  isLoading: boolean;
}

const PerformanceChart: React.FC<{ data: number[] }> = ({ data }) => {
  const isPositive = data[0] < data[data.length - 1];
  const color = isPositive ? '#00C7B0' : '#FF4D4D';

  const options: Highcharts.Options = {
    chart: {
      type: 'area',
      height: 35,
      width: 120,
      backgroundColor: 'transparent',
      margin: [0, 0, 0, 0],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    xAxis: { visible: false },
    yAxis: { visible: false },
    legend: { enabled: false },
    credits: { enabled: false },
    tooltip: {
      enabled: true,
      backgroundColor: '#1E1E1E',
      borderColor: '#333',
      borderRadius: 8,
      borderWidth: 1,
      padding: 8,
      style: {
        color: '#fff',
      },
      formatter: function () {
        return `<span style="font-size: 10px">${this.y?.toFixed(6)} τ</span>`;
      },
    },
    plotOptions: {
      area: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 3,
            },
          },
        },
        lineWidth: 1.5,
        states: {
          hover: {
            lineWidth: 2,
          },
        },
        lineColor: color,
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, Highcharts.color(color).setOpacity(0.2).get() as string],
            [1, Highcharts.color(color).setOpacity(0).get() as string],
          ],
        },
        threshold: null,
      },
    },
    series: [
      {
        type: 'area',
        data: data,
        animation: false,
      },
    ],
  };

  return (
    <div className="flex items-center">
      <HighchartsReact highcharts={Highcharts} options={options} />
      <div className={`ml-2 text-xs ${isPositive ? 'text-[#00C7B0]' : 'text-[#FF4D4D]'}`}>{isPositive ? '↑' : '↓'}</div>
    </div>
  );
};

const MinerCard: React.FC<{ miner: NonRootNeuronObj; position: number }> = ({ miner, position }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="hover:bg-primary-100 mb-3 rounded-xl border border-neutral-700 p-4 transition-colors">
      <div
        className="flex cursor-pointer flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-2 sm:items-center">
          <span className="shrink-0 text-2xl font-bold text-neutral-400">#{position}</span>
          <div className="flex flex-col">
            <div className="text-sm font-medium">{getFirstAndLastCharacters(miner.hotkey, 5)}</div>
            <div className="text-xs text-neutral-500">UID: {miner.uid}</div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-6 sm:w-auto sm:justify-end">
          <div className="text-right">
            <div className="text-sm font-medium">{Number(miner.trust).toFixed(9)} </div>
            <div className="text-xs text-neutral-500">{miner.emission.toFixed(6)} τ/day</div>
          </div>
          <PerformanceChart data={miner.historicalEmissions.map(({ emission }) => emission).reverse()} />
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 border-t border-neutral-800 pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="mb-1 text-neutral-500">Cold Key</div>
              <div className="font-medium">{getFirstAndLastCharacters(miner.coldkey, 5)}</div>
            </div>
            <div>
              <div className="mb-1 text-neutral-500">Stake</div>
              <div className="font-medium">{miner.stakedAmt.toFixed(6)}</div>
            </div>
            <div>
              <div className="mb-1 text-neutral-500">Lifetime Emission</div>
              <div className="font-medium">{miner.totalEmission.toFixed(6)} τ</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MinerLeaderboard = ({ miners, isLoading }: LeaderboardProps) => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState<'default' | 'trust' | 'emission' | 'stakedAmt'>('default');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const isMobile = useMediaQuery('(max-width: 768px)');

  const paginatedMiners = useMemo(() => {
    if (!miners) return [];
    let sortedMiners = [...miners];

    if (sortBy !== 'default') {
      switch (sortBy) {
        case 'trust':
          sortedMiners.sort((a, b) => {
            const multiplier = sortOrder === 'desc' ? -1 : 1;
            return multiplier * (Number(a.trust) - Number(b.trust));
          });
          break;
        case 'emission':
          sortedMiners.sort((a, b) => {
            const multiplier = sortOrder === 'desc' ? -1 : 1;
            return multiplier * (a.emission - b.emission);
          });
          break;
        case 'stakedAmt':
          sortedMiners.sort((a, b) => {
            const multiplier = sortOrder === 'desc' ? -1 : 1;
            return multiplier * (a.stakedAmt - b.stakedAmt);
          });
          break;
      }
    }

    const start = currentPage * itemsPerPage;
    return sortedMiners.slice(start, start + itemsPerPage);
  }, [miners, currentPage, itemsPerPage, sortBy, sortOrder]);

  const columnHelper = createColumnHelper<NonRootNeuronObj>();
  const sortingmTrust = (a: NonRootNeuronObj, b: NonRootNeuronObj) => {
    return Number(a.trust) - Number(b.trust);
  };
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'position',
        header: 'Pos.',
        size: 50,
        cell: (info) => `#${info.row.index + 1}`,
      }),
      columnHelper.accessor('uid', {
        header: 'UID',
        size: 50,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('hotkey', {
        header: 'Hot Key',
        size: 110,
        cell: (info) => getFirstAndLastCharacters(info.getValue(), 5),
      }),
      columnHelper.accessor('coldkey', {
        header: 'Cold Key',
        size: 110,
        cell: (info) => getFirstAndLastCharacters(info.getValue(), 5),
      }),
      columnHelper.accessor('trust', {
        header: 'mTrust',
        size: 100,
        enableSorting: true,
        cell: (info) => {
          return Number(info.getValue()).toFixed(9);
        },
        sortingFn: (rowA, rowB) => {
          return Number(rowA.original.trust) - Number(rowB.original.trust); // Access minerWeight from original data
        },
      }),
      columnHelper.accessor('emission', {
        header: 'Daily Emission',
        size: 100,
        cell: (info) => `${info.getValue().toFixed(6)} τ`,
        enableSorting: true,
      }),
      columnHelper.accessor('totalEmission', {
        header: 'Lifetime Emission',
        size: 100,
        cell: (info) => `${info.getValue().toFixed(6)} τ`,
        enableSorting: true,
      }),
      columnHelper.accessor('stakedAmt', {
        header: 'Stake',
        size: 100,
        cell: (info) => info.getValue().toFixed(6),
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          return Number(rowA.original.stakedAmt) - Number(rowB.original.stakedAmt);
        },
      }),
      columnHelper.accessor('historicalEmissions', {
        header: 'Performance',
        size: 100,
        cell: (info) => {
          const emissionsData = info.getValue();
          const chartData = emissionsData.map(({ emission }) => emission);
          return <PerformanceChart data={chartData.reverse()} />;
        },
      }),
    ],
    []
  );

  return (
    <div className="pb-[30px]">
      {isMobile ? (
        <>
          {miners && miners.length > 0 && (
            <span className="mb-4 block text-xs text-muted-foreground">
              Showing {currentPage * itemsPerPage + 1}-{Math.min(miners.length, (currentPage + 1) * itemsPerPage)} of{' '}
              {miners.length}
            </span>
          )}

          <div className="mb-4 flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as typeof sortBy);
                setCurrentPage(0);
              }}
              className="flex-1 rounded-lg border border-neutral-700 p-2 text-sm"
            >
              <option value="default">Default Order</option>
              <option value="trust">Sort by Trust</option>
              <option value="emission">Sort by Daily Emission</option>
              <option value="stakedAmt">Sort by Stake</option>
            </select>
            <button
              onClick={() => setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'))}
              className={`rounded-lg border border-neutral-700 px-3 py-1 ${sortBy === 'default' ? 'text-muted' : ''}`}
            >
              {sortOrder === 'desc' ? <IconChevronDown /> : <IconChevronUp />}
            </button>
          </div>

          <div className="space-y-2">
            {paginatedMiners.map((miner, index) => (
              <MinerCard key={miner.uid} miner={miner} position={currentPage * itemsPerPage + index + 1} />
            ))}
          </div>

          {paginatedMiners.length > 0 && miners && (
            <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-2">
              <span className="order-2 text-xs text-muted-foreground sm:order-1">
                Showing {currentPage * itemsPerPage + 1}-{Math.min(miners.length, (currentPage + 1) * itemsPerPage)} of{' '}
                {miners.length}
              </span>

              <div className="order-1 flex w-full items-center justify-center gap-2 sm:order-2 sm:w-auto sm:justify-end">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(0)}
                  className={cn(
                    'flex aspect-square h-[30px] items-center justify-center p-0',
                    currentPage === 0 ? 'text-muted' : 'text-font-primary'
                  )}
                >
                  <IconChevronsLeft />
                </button>
                <button
                  disabled={!miners || currentPage === 0}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  className={cn(
                    FontSpaceMono.className,
                    currentPage === 0 && 'text-muted bg-transparent border-none',
                    'font-bold p-0'
                  )}
                >
                  PREV
                </button>
                {Array.from({ length: Math.ceil((miners?.length || 0) / itemsPerPage) }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 2),
                    Math.min(currentPage + 3, Math.ceil((miners?.length || 0) / itemsPerPage))
                  )
                  .map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum - 1)}
                      className={cn(
                        FontSpaceMono.className,
                        'font-bold p-0',
                        currentPage + 1 === pageNum ? 'text-black' : 'text-font-primary/40'
                      )}
                    >
                      {pageNum}
                    </button>
                  ))}
                <button
                  disabled={!miners || currentPage + 1 === Math.ceil((miners?.length || 0) / itemsPerPage)}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className={cn(
                    FontSpaceMono.className,
                    currentPage + 1 === Math.ceil((miners?.length || 0) / itemsPerPage) &&
                      'text-muted bg-transparent border-none',
                    'font-bold p-0'
                  )}
                >
                  NEXT
                </button>
                <button
                  disabled={currentPage + 1 === Math.ceil((miners?.length || 0) / itemsPerPage)}
                  onClick={() => setCurrentPage(Math.ceil((miners?.length || 0) / itemsPerPage) - 1)}
                  className={cn(
                    'flex aspect-square h-[30px] items-center justify-center p-0',
                    currentPage + 1 === Math.ceil((miners?.length || 0) / itemsPerPage)
                      ? 'text-muted'
                      : 'text-font-primary'
                  )}
                >
                  <IconChevronsRight />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Datatablev2
          tableClassName="w-full"
          minColumnSize={20}
          columnDef={columns}
          data={miners ?? []}
          pageSize={itemsPerPage}
        />
      )}
    </div>
  );
};

export default MinerLeaderboard;
