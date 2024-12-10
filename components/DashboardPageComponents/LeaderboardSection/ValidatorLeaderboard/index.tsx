import Datatablev2 from '@/components/Common/DataTable/Datatablev2';
import MobileTableCard from '@/components/Common/DataTable/MobileTableCard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { NonRootNeuronObj } from '@/types/DashboardTypes';
import { getFirstAndLastCharacters } from '@/utils/math_helpers';
import { cn } from '@/utils/tw';
import { FontSpaceMono } from '@/utils/typography';
import { IconChevronsLeft, IconChevronsRight, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { createColumnHelper } from '@tanstack/react-table';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useMemo, useState } from 'react';
import ExampleCard from '../ExampleCard';

interface LeaderboardProps {
  validators: NonRootNeuronObj[] | null;
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
const ValidatorLeaderboard = ({ validators, isLoading }: LeaderboardProps) => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState<'default' | 'validatorTrust' | 'emission' | 'stakedAmt'>('default');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const paginatedValidators = useMemo(() => {
    if (!validators) return [];
    let sortedValidators = [...validators];

    if (sortBy !== 'default') {
      switch (sortBy) {
        case 'validatorTrust':
          sortedValidators.sort((a, b) => {
            const multiplier = sortOrder === 'desc' ? -1 : 1;
            return multiplier * (Number(a.validatorTrust) - Number(b.validatorTrust));
          });
          break;
        case 'emission':
          sortedValidators.sort((a, b) => {
            const multiplier = sortOrder === 'desc' ? -1 : 1;
            return multiplier * (a.emission - b.emission);
          });
          break;
        case 'stakedAmt':
          sortedValidators.sort((a, b) => {
            const multiplier = sortOrder === 'desc' ? -1 : 1;
            return multiplier * (a.stakedAmt - b.stakedAmt);
          });
          break;
      }
    }

    const start = currentPage * itemsPerPage;
    return sortedValidators.slice(start, start + itemsPerPage);
  }, [validators, currentPage, itemsPerPage, sortBy, sortOrder]);

  const columnHelper = createColumnHelper<NonRootNeuronObj>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'position',
        header: 'Pos.',
        size: 50,
        cell: (info) => <span className="whitespace-nowrap">{`#${info.row.index + 1}`}</span>,
      }),
      columnHelper.accessor('uid', {
        header: 'UID',
        size: 50,
        cell: (info) => <span className="whitespace-nowrap">{info.getValue()}</span>,
      }),
      columnHelper.accessor('hotkey', {
        header: 'Hot Key',
        size: 110,
        cell: (info) => {
          const hotkey = info.getValue();
          return <span className="whitespace-nowrap">{hotkey.slice(0, 6) + '...'}</span>;
        },
      }),
      columnHelper.accessor('coldkey', {
        header: 'Cold Key',
        size: 110,
        cell: (info) => {
          const coldkey = info.getValue();
          return <span className="whitespace-nowrap">{coldkey.slice(0, 6) + '...'}</span>;
        },
      }),
      columnHelper.accessor('validatorTrust', {
        header: 'vTrust',
        size: 100,
        cell: (info) => <span className="whitespace-nowrap">{Number(info.getValue()).toFixed(6)} τ</span>,
        enableSorting: true,
      }),
      columnHelper.accessor('emission', {
        header: 'Daily Emission',
        size: 100,
        cell: (info) => <span className="whitespace-nowrap">{`${info.getValue().toFixed(3)} τ`}</span>,
        enableSorting: true,
      }),
      columnHelper.accessor('totalEmission', {
        header: 'Lifetime Emission',
        size: 100,
        cell: (info) => <span className="whitespace-nowrap">{`${info.getValue().toFixed(3)} τ`}</span>,
        enableSorting: true,
      }),
      columnHelper.accessor('stakedAmt', {
        header: 'Stake',
        size: 100,
        cell: (info) => <span className="whitespace-nowrap">{`${info.getValue().toFixed(3)} τ`}</span>,
        enableSorting: true,
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
      {isMobile && <ExampleCard />}
      {isMobile ? (
        <>
          {validators && validators.length > 0 && (
            <span className="mb-4 block text-xs text-muted-foreground">
              Showing {currentPage * itemsPerPage + 1}-{Math.min(validators.length, (currentPage + 1) * itemsPerPage)}{' '}
              of {validators.length}
            </span>
          )}

          <div className="mb-4 flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as typeof sortBy);
                setCurrentPage(0);
              }}
              className="flex-1 appearance-none rounded-lg border border-neutral-700 bg-[url('/chevron-down.svg')] bg-[length:16px] bg-[center_right_1rem] bg-no-repeat p-2 pr-12 text-sm"
            >
              <option value="default">Default Order</option>
              <option value="validatorTrust">Sort by Trust</option>
              <option value="emission">Sort by Daily Emission</option>
              <option value="stakedAmt">Sort by Stake</option>
            </select>
            <button
              onClick={() => {
                if (sortBy !== 'default') {
                  setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
                }
              }}
              className={`rounded-lg border border-neutral-700 px-3 py-1 ${sortBy === 'default' ? 'text-muted cursor-not-allowed' : ''}`}
            >
              {sortOrder === 'desc' ? <IconSortDescending /> : <IconSortAscending />}
            </button>
          </div>

          <div className="space-y-2">
            {paginatedValidators.map((validator, index) => (
              <MobileTableCard
                key={validator.uid}
                data={validator}
                position={currentPage * itemsPerPage + index + 1}
                renderMainInfo={(validator) => <div className="text-xs text-neutral-500">UID: {validator.uid}</div>}
                renderStats={(validator) => (
                  <>
                    <div className="text-right">
                      <div className="text-sm font-medium">{Number(validator.validatorTrust).toFixed(6)} τ</div>
                      <div className="text-xs text-neutral-500">{validator.emission.toFixed(3)} τ/day</div>
                    </div>
                    <PerformanceChart data={validator.historicalEmissions.map(({ emission }) => emission).reverse()} />
                  </>
                )}
                renderExpandedInfo={(validator) => (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="mb-1 text-neutral-500">Cold Key</div>
                      <div className="font-medium">{getFirstAndLastCharacters(validator.coldkey, 5)}</div>
                    </div>
                    <div>
                      <div className="mb-1 text-neutral-500">Stake</div>
                      <div className="font-medium">{validator.stakedAmt.toFixed(3)} τ</div>
                    </div>
                    <div>
                      <div className="mb-1 text-neutral-500">Lifetime Emission</div>
                      <div className="font-medium">{validator.totalEmission.toFixed(3)} τ</div>
                    </div>
                  </div>
                )}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {paginatedValidators.length > 0 && validators && (
            <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-2">
              <span className="order-2 text-xs text-muted-foreground sm:order-1">
                Showing {currentPage * itemsPerPage + 1}-{Math.min(validators.length, (currentPage + 1) * itemsPerPage)}{' '}
                of {validators.length}
              </span>

              {/* Pagination buttons - same as MinerLeaderboard */}
              <div className="order-1 flex w-full items-center justify-center gap-2 sm:order-2 sm:w-auto sm:justify-end">
                {/* First page button */}
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

                {/* Previous button */}
                <button
                  disabled={!validators || currentPage === 0}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  className={cn(
                    FontSpaceMono.className,
                    currentPage === 0 && 'text-muted bg-transparent border-none',
                    'font-bold p-0'
                  )}
                >
                  PREV
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.ceil((validators?.length || 0) / itemsPerPage) }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 2),
                    Math.min(currentPage + 3, Math.ceil((validators?.length || 0) / itemsPerPage))
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

                {/* Next button */}
                <button
                  disabled={!validators || currentPage + 1 === Math.ceil((validators?.length || 0) / itemsPerPage)}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className={cn(
                    FontSpaceMono.className,
                    currentPage + 1 === Math.ceil((validators?.length || 0) / itemsPerPage) &&
                      'text-muted bg-transparent border-none',
                    'font-bold p-0'
                  )}
                >
                  NEXT
                </button>

                {/* Last page button */}
                <button
                  disabled={currentPage + 1 === Math.ceil((validators?.length || 0) / itemsPerPage)}
                  onClick={() => setCurrentPage(Math.ceil((validators?.length || 0) / itemsPerPage) - 1)}
                  className={cn(
                    'flex aspect-square h-[30px] items-center justify-center p-0',
                    currentPage + 1 === Math.ceil((validators?.length || 0) / itemsPerPage)
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
          tableClassName="min-w-[892px]"
          minColumnSize={20}
          columnDef={columns}
          data={validators ?? []}
          pageSize={itemsPerPage}
          tooltipShowingXofY={false}
          enableSortHighlight={true}
        />
      )}
    </div>
  );
};

export default ValidatorLeaderboard;
