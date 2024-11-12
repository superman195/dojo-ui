import Datatablev2 from '@/components/Common/DataTable/Datatablev2';
import { NonRootNeuronObj } from '@/types/DashboardTypes';
import { getFirstAndLastCharacters } from '@/utils/math_helpers';
import { createColumnHelper } from '@tanstack/react-table';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useCallback, useMemo, useState } from 'react';

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
const MinerLeaderboard = ({ miners, isLoading }: LeaderboardProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Set the number of items per page

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
          const chartData = emissionsData.map(({ emission }) => emission); // Extract only the emission values

          return <PerformanceChart data={chartData} />; // Pass the array of numbers
        },
        // enableSorting: true,
      }),
    ],
    []
  );

  const handlePageChange = useCallback((pageIndex: number) => {
    setCurrentPage(pageIndex);
  }, []);

  // const paginatedData = useMemo(() => {
  //   if (!miners) return [];
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  //   return miners.slice(startIndex, endIndex);
  // }, [miners, currentPage, itemsPerPage]);

  return (
    <div className="pb-[30px]">
      <Datatablev2
        tableClassName="min-w-[892px]"
        minColumnSize={20}
        columnDef={columns}
        data={miners ?? []}
        pageSize={itemsPerPage}
      />
      <div className="mt-3"></div>
      {/* <Pagination totalPages={Math.ceil((miners?.length || 0) / itemsPerPage)} handlePageChange={handlePageChange} /> */}
    </div>
  );
};

export default MinerLeaderboard;
