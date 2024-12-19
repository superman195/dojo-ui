import useCompletedTasksCount from '@/hooks/useCompletedTasksCount';
import { abbreviateNumber } from '@/utils/math_helpers';
import { FontSpaceMono } from '@/utils/typography';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import { useEffect, useRef } from 'react';

interface SubnetData {
  id: number;
  totalEmissions: number;
  minerCount: number;
  maxAllowedKeys: number;
  maxActiveValidators: number;
  maxActiveMiners: number;
  emissionPct: number;
  registerCost: number;
  owner: string;
  historicalSubnetEmissions: {
    blockNumber: number;
    blockTime: number;
    totalEmissions: number;
  }[];
  nonRootNeurons: {
    hotkey: string;
    coldkey: string;
    uid: number;
    emission: number;
    stakedAmt: number;
    rank: number;
    active: boolean;
  }[];
  subnetValidatorWeightAssignments: {
    weight: number;
    owner: string;
    stakedAmt: number;
    hotkey: string;
  }[];
}

interface DashboardGraphAndMetricsProps {
  subnetData: SubnetData | null;
  loading: boolean;
  error: string | null;
}

function DashboardGraphAndMetrics({ subnetData, loading, error }: DashboardGraphAndMetricsProps) {
  // const [chartOptions, setChartOptions] = useState<Highcharts.Options>({});
  const { numCompletedTasks, loading: completedTasksLoading, error: completedTasksError } = useCompletedTasksCount();
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    if (!subnetData || subnetData.historicalSubnetEmissions.length < 2) {
      console.warn('Not enough data points for the chart');
      return;
    }

    // setChartOptions(options);
  }, [subnetData]);
  const emissionData =
    !subnetData || subnetData.historicalSubnetEmissions.length < 2
      ? Array.from({ length: 30 }, (_, i) => [i * 24 * 60 * 60 * 1000, 0])
      : subnetData.historicalSubnetEmissions
          .map((item) => [item.blockTime * 1000, item.totalEmissions] as [number, number])
          .sort((a, b) => a[0] - b[0]);
  const options: Highcharts.Options = {
    credits: { enabled: false },
    chart: {
      height: 430,
      backgroundColor: 'transparent',
      style: { fontFamily: 'Arial, sans-serif' },
    },
    title: {
      text: 'LIVE EMISSIONS PAST 30 DAYS',
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        fontFamily: FontSpaceMono.style.fontFamily,
      },
    },
    subtitle: {
      text: subnetData?.totalEmissions.toFixed(2),
      align: 'left',
      style: {
        fontSize: '24px',
        fontWeight: 'bold',
        fontFamily: FontSpaceMono.style.fontFamily,
        color: 'black',
      },
    },
    xAxis: {
      type: 'datetime',
      ordinal: false,
      min: emissionData[0][0],
      max: emissionData[emissionData.length - 1][0],
      labels: {
        format: '{value:%d %b}',
        style: { color: '#666', fontSize: '10px' },
      },
      tickLength: 0,
      lineColor: '#ccc',
      crosshair: true,
    },
    yAxis: {
      title: {
        text: 'Total Emissions',
      },
      labels: {
        formatter: function () {
          return (this.value as number).toFixed(2) + ' τ';
        },
      },
    },
    legend: { enabled: false },
    plotOptions: {
      areaspline: {
        dataGrouping: {
          enabled: true,
          forced: true,
          units: [
            ['day', [1]],
            ['week', [1]],
            ['month', [1, 3, 6]],
          ],
        },
      },
    },
    series: [
      {
        type: 'areaspline',
        name: 'Total Emissions',
        data: emissionData,
        turboThreshold: 0,
        color: '#24837B',
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, 'rgba(0, 255, 255, 0.3)'],
            [1, 'rgba(0, 255, 255, 0)'],
          ],
        },
        lineWidth: 2,
        marker: { enabled: false },
      },
    ],
    tooltip: {
      shared: true,
      valueSuffix: ' τ',
      valueDecimals: 2,
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderRadius: 10,
    },
    rangeSelector: {
      buttons: [
        { type: 'day', count: 7, text: '7d' },
        { type: 'day', count: 15, text: '15d' },
        { type: 'month', count: 1, text: '1m' },
        { type: 'all', text: 'All' },
      ],
      selected: 3,
      inputEnabled: false,
      buttonTheme: {
        fill: '#E3E3E3',
        stroke: 'none',
        'stroke-width': 0,
        r: 8,
        style: {
          color: 'black',
          fontWeight: '500',
          fontSize: '12px',
        },
        states: {
          hover: {
            fill: '#00B6A6',
            style: { color: 'black', fontWeight: 'bold' },
          },
          select: {
            fill: 'rgba(0, 182, 166, 0.14)',
            style: { color: 'black', fontWeight: 'bold' },
          },
        },
      },
      buttonPosition: {
        align: 'left',
        x: 0,
        y: 0,
      },
    },
    navigator: {
      enabled: true,
      height: 49,
      margin: 5,
      outlineWidth: 0,
      maskFill: 'rgba(0, 182, 166, 0.31)',
      xAxis: { labels: { enabled: false } },
      series: { type: 'area', color: '#24837B', lineWidth: 1 },
      handles: {
        backgroundColor: '#D9D9D9',
        borderColor: 'black',
      },
    },
  };

  const kpiMetrics = [
    { label: 'TOTAL EMISSIONS', value: subnetData ? subnetData.totalEmissions.toFixed(2) + ' τ' : 'N/A' },
    { label: 'MINER COUNT', value: subnetData ? subnetData.minerCount : 'N/A' },
    {
      label: 'TASK COUNT',
      value: completedTasksLoading ? '0' : numCompletedTasks ? abbreviateNumber(numCompletedTasks) : 'N/A',
    },
  ];
  useEffect(() => {
    const handleResize = () => {
      if (chartComponentRef.current) {
        chartComponentRef.current.chart.reflow();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Add resize handler
  return (
    <div className="flex w-full flex-col gap-2 pt-5">
      <div className="flex flex-wrap gap-2">
        {kpiMetrics.map((metric, index) => (
          <div
            key={index}
            className="min-w-[200px] grow rounded-sm border-2 border-black bg-white p-3  lg:min-w-0 lg:p-4"
          >
            <div className={`${FontSpaceMono.className} mb-1 text-sm font-bold lg:text-lg`}>{metric.label}</div>
            {loading ? (
              <div className={`${FontSpaceMono.className} h-8 w-24 animate-pulse bg-gray-200 lg:h-10 lg:w-36`}></div>
            ) : (
              <div className={`text-2xl font-bold lg:text-4xl`}>{metric.value}</div>
            )}
          </div>
        ))}
      </div>
      <div className=" rounded-sm border-2 border-black bg-white">
        <HighchartsReact highcharts={Highcharts} options={options} constructorType={'stockChart'} />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto mb-6 px-0">
      <div className="flex w-full flex-col justify-between gap-3 lg:flex-row">
        <div className="flex flex-row gap-3 overflow-x-auto py-3 lg:min-w-[240px] lg:flex-col lg:overflow-x-visible lg:p-0">
          {kpiMetrics.map((metric, index) => (
            <div
              key={index}
              className="w-full min-w-[200px] rounded-sm border-2 border-black bg-white p-3  lg:min-w-0 lg:p-4"
            >
              <div className={`${FontSpaceMono.className} mb-1 text-sm font-bold lg:text-lg`}>{metric.label}</div>
              {loading ? (
                <div className={`${FontSpaceMono.className} h-8 w-24 animate-pulse bg-gray-200 lg:h-10 lg:w-36`}></div>
              ) : (
                <div className={`text-2xl font-bold lg:text-4xl`}>{metric.value}</div>
              )}
            </div>
          ))}
        </div>
        <div className="min-h-[300px] flex-1 rounded-sm border-2 border-black bg-white lg:min-h-[400px]">
          <div className="size-full p-4">
            {loading ? (
              <div className="flex h-full flex-col">
                <div className="mb-4 h-6 w-48 animate-pulse bg-gray-200"></div>
                <div className="mb-6 h-8 w-32 animate-pulse bg-gray-300"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-40 w-full animate-pulse bg-gray-200"></div>
                  <div className="h-4 w-3/4 animate-pulse bg-gray-200"></div>
                  <div className="h-4 w-1/2 animate-pulse bg-gray-200"></div>
                </div>
                <div className="mt-4 flex justify-between">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-16 animate-pulse rounded-md bg-gray-200"></div>
                  ))}
                </div>
              </div>
            ) : (
              <HighchartsReact highcharts={Highcharts} options={options} constructorType={'stockChart'} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardGraphAndMetrics;
