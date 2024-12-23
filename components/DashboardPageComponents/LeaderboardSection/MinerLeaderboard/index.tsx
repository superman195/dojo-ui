import { CustomButton } from '@/components/Common/CustomComponents/button';
import Datatablev2 from '@/components/Common/DataTable/Datatablev2';
import MobileTableCard from '@/components/Common/DataTable/MobileTableCard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { NonRootNeuronObj } from '@/types/DashboardTypes';
import { makeDollarReadable } from '@/utils/math_helpers';
import { cn } from '@/utils/tw';
import { FontManrope, FontSpaceMono } from '@/utils/typography';
import {
  IconChevronsLeft,
  IconChevronsRight,
  IconExternalLink,
  IconSortAscending,
  IconSortDescending,
} from '@tabler/icons-react';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import ExampleCard from '../ExampleCard';
import PerformanceChart from '../LeaderboardPerformanceChart';

interface LeaderboardProps {
  miners: NonRootNeuronObj[] | null;
  isLoading: boolean;
}

const MinerLeaderboard = ({ miners, isLoading }: LeaderboardProps) => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState<'default' | 'trust' | 'emission' | 'stakedAmt'>('default');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const isMobile = useMediaQuery('(max-width: 1023px)');

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
        cell: (info) => {
          const hotkey = info.getValue();
          const truncatedHotkey = hotkey.slice(0, 6) + '...';
          return (
            <CustomButton
              onClick={() => window.open(`/dashboard/miner/${hotkey}`, '_blank')}
              className="h-fit p-0 font-bold text-darkGreen"
              variant={'link'}
            >
              <span className="mr-[3px] text-sm underline underline-offset-2">{truncatedHotkey}</span>{' '}
              <IconExternalLink className="size-4" />
            </CustomButton>
          );
        },
      }),
      columnHelper.accessor('coldkey', {
        header: 'Cold Key',
        size: 110,
        cell: (info) => {
          const coldkey = info.getValue();
          const truncatedColdkey = coldkey.slice(0, 6) + '...';
          return (
            <CustomButton
              onClick={() => window.open(`https://taostats.io/account/${coldkey}`, '_blank')}
              className="h-fit p-0 font-bold text-darkGreen"
              variant={'link'}
            >
              <span className="mr-[3px] text-sm underline underline-offset-2">{truncatedColdkey}</span>{' '}
              <IconExternalLink className="size-4" />
            </CustomButton>
          );
        },
      }),
      columnHelper.accessor('trust', {
        header: 'mTrust',
        size: 100,
        enableSorting: true,
        cell: (info) => {
          return Number(info.getValue()).toFixed(6);
        },
        sortingFn: (rowA, rowB) => {
          return Number(rowA.original.trust) - Number(rowB.original.trust); // Access minerWeight from original data
        },
      }),
      columnHelper.accessor('emission', {
        header: 'Daily Emission',
        size: 100,
        cell: (info) => `${makeDollarReadable(info.getValue(), 3)} τ`,
        enableSorting: true,
      }),
      columnHelper.accessor('totalEmission', {
        header: 'Lifetime Emission',
        size: 100,
        cell: (info) => `${makeDollarReadable(info.getValue(), 3)} τ`,
        enableSorting: true,
      }),
      columnHelper.accessor('stakedAmt', {
        header: 'Stake',
        size: 100,
        cell: (info) => `${makeDollarReadable(info.getValue(), 3)} τ`,
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
    <div className={cn(FontManrope.className, 'pb-[30px]')}>
      {isMobile && <ExampleCard isValidator={false} />}
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
              className="flex-1 appearance-none rounded-full border border-black/10 bg-card-background p-2 px-3 pr-12 text-sm hover:cursor-pointer hover:border-primary hover:bg-secondary"
            >
              <option value="default">Default Order</option>
              <option value="trust">Sort by Trust</option>
              <option value="emission">Sort by Daily Emission</option>
              <option value="stakedAmt">Sort by Stake</option>
            </select>
            <button
              onClick={() => {
                if (sortBy !== 'default') {
                  setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
                }
              }}
              className={`flex aspect-square size-[38px] items-center justify-center rounded-full border border-muted bg-card-background ${sortBy === 'default' ? 'cursor-not-allowed text-muted-foreground' : 'border-black/10'}`}
            >
              {sortOrder === 'desc' ? <IconSortDescending /> : <IconSortAscending />}
            </button>
          </div>

          <div className="space-y-2">
            {paginatedMiners.map((miner, index) => (
              <MobileTableCard
                key={miner.uid}
                data={miner}
                position={currentPage * itemsPerPage + index + 1}
                renderMainInfo={(miner) => (
                  <div className="text-xs text-neutral-500">
                    UID: {miner.uid} <br />
                    <CustomButton
                      onClick={() => window.open(`/dashboard/miner/${miner.hotkey}`, '_blank')}
                      className="h-fit p-0 font-bold text-darkGreen"
                      variant={'link'}
                    >
                      <span className="mr-[3px] text-sm underline underline-offset-2">
                        {miner.hotkey.slice(0, 6) + '...'}
                      </span>{' '}
                      <IconExternalLink className="size-4" />
                    </CustomButton>
                  </div>
                )}
                renderStats={(miner) => (
                  <>
                    <div className="text-start">
                      <div className="text-sm font-medium">{Number(miner.trust).toFixed(9)} τ</div>
                      <div className="text-xs text-neutral-500">{makeDollarReadable(miner.emission, 3)} τ/day</div>
                    </div>
                    <PerformanceChart data={miner.historicalEmissions.map(({ emission }) => emission).reverse()} />
                  </>
                )}
                renderExpandedInfo={(miner) => (
                  <>
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center justify-between">
                        <span>Cold key</span>
                        <span>
                          {' '}
                          <CustomButton
                            onClick={() => window.open(`https://taostats.io/account/${miner.coldkey}`, '_blank')}
                            className="h-fit p-0 font-bold text-darkGreen"
                            variant={'link'}
                          >
                            <span className="mr-[3px] text-sm underline underline-offset-2">
                              {miner.coldkey.slice(0, 6) + '...'}
                            </span>
                            <IconExternalLink className="size-4" />{' '}
                          </CustomButton>
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between">
                        <span>Stake</span>
                        <span>{makeDollarReadable(miner.stakedAmt, 3)} τ</span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between">
                        <span>Lifetime Emission</span>
                        <span>{makeDollarReadable(miner.totalEmission, 3)} τ</span>
                      </div>
                    </div>
                  </>
                )}
              />
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
          enableSortHighlight={true}
        />
      )}
    </div>
  );
};

export default MinerLeaderboard;
