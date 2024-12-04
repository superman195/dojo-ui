import VisualizationTaskList from '@/components/DashboardPageComponents/IndividualMinerDashboardSection';
import useSubnetMetagraph from '@/hooks/useSubnetMetaGraph';
import Layout from '@/layout';
import { NonRootNeuronObj } from '@/types/DashboardTypes';
import { getFirstAndLastCharacters } from '@/utils/math_helpers';
import { cn } from '@/utils/tw';
import { FontSpaceMono } from '@/utils/typography';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const IndividualMinerPage = () => {
  const router = useRouter();
  const { hotkey } = router.query;
  const { data: subnetData, loading, error } = useSubnetMetagraph(52); // Using subnet 52 as seen in your codebase
  const [minerData, setMinerData] = useState<NonRootNeuronObj | null>(null);

  useEffect(() => {
    if (subnetData && hotkey) {
      const miner = subnetData.nonRootNeurons.find((neuron) => neuron.hotkey === hotkey);
      if (miner) {
        const totalEmission = miner.historicalEmissions.reduce((sum, { emission }) => sum + emission, 0);
        setMinerData({ ...miner, totalEmission });
      }
    }
  }, [subnetData, hotkey]);

  const chartOptions: Highcharts.Options = {
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
      text: minerData?.totalEmission.toFixed(2),
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
    credits: { enabled: false },
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
        data: minerData?.historicalEmissions.map(({ blockTime, emission }) => [blockTime * 1000, emission]) || [],
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
    responsive: {
      rules: [
        {
          condition: { maxWidth: 768 },
          chartOptions: {
            chart: { height: 300 },
            subtitle: { style: { fontSize: '18px' } },
            yAxis: {
              labels: { align: 'left', x: 0, y: -2 },
              title: { text: null },
            },
            rangeSelector: {},
            navigator: { enabled: false },
          },
        },
      ],
    },
  };

  if (loading) {
    return (
      <Layout headerText="Individual Miner Dashboard">
        <div className="min-h-screen">
          <main className="mx-auto max-w-4xl px-4 py-8">
            {/* Miner Info Skeleton */}
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="border-2 border-black bg-white p-4 shadow-brut-sm">
                  <div className={`${FontSpaceMono.className} mb-2 h-4 w-32 animate-pulse rounded bg-gray-200`}></div>
                  <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
                </div>
              ))}
            </div>

            {/* Secondary Stats Grid Skeleton */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[1, 2, 3].map((index) => (
                <div key={index} className="border-2 border-black bg-white p-4 shadow-brut-sm">
                  <div className={`${FontSpaceMono.className} mb-2 h-4 w-32 animate-pulse rounded bg-gray-200`}></div>
                  <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
                </div>
              ))}
            </div>

            {/* Chart Skeleton */}
            <div className="border-2 border-black bg-white p-4 shadow-brut-sm">
              <div className={`${FontSpaceMono.className} mb-4 h-6 w-48 animate-pulse rounded bg-gray-200`}></div>
              <div className="h-[300px] w-full animate-pulse rounded bg-gray-200"></div>
            </div>

            {/* Additional Info Skeleton */}
            <div className="mt-8 border-2 border-black bg-white p-4 shadow-brut-sm">
              <div className={`${FontSpaceMono.className} mb-4 h-6 w-48 animate-pulse rounded bg-gray-200`}></div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div>
                  <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            </div>

            {/* VisualizationTaskList Skeleton */}
            <div className="mt-8">
              <div
                className={`${FontSpaceMono.className} mb-8 h-10 w-96 animate-pulse rounded bg-gray-200 text-4xl font-bold uppercase`}
              ></div>

              <div className="mx-auto max-w-[1075px]">
                <div className="overflow-hidden rounded-sm border-2 border-black bg-white">
                  {/* Table Header */}
                  <div className="grid grid-cols-[400px,200px,120px] border-b border-black/10">
                    {['NAME', 'TYPE', ''].map((header) => (
                      <div key={header} className={cn('p-4 text-sm uppercase', FontSpaceMono.className)}>
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                      </div>
                    ))}
                  </div>

                  {/* Table Body */}
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="grid grid-cols-[400px,200px,120px] border-b border-black/10">
                      <div className="p-4">
                        <div className="h-[15px] w-3/4 animate-pulse rounded bg-gray-200"></div>
                      </div>
                      <div className="p-4">
                        <div className="flex gap-2">
                          <div className="h-7 w-32 animate-pulse rounded-full bg-gray-200"></div>
                          <div className="size-7 animate-pulse rounded-full bg-gray-200"></div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="h-[40px] w-[113px] animate-pulse rounded-sm bg-gray-200"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </Layout>
    );
  }

  if (error || !minerData) {
    return (
      <Layout headerText="Miner Details">
        <div className="flex h-screen items-center justify-center">
          <p className="text-red-500">Error loading miner data</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout headerText="Individual Miner Dashboard">
      <div className="min-h-screen">
        <main className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <p className={`${FontSpaceMono.className} text-gray-600`}>
                Hotkey: {getFirstAndLastCharacters(hotkey as string, 5)}
              </p>
              <p className={`${FontSpaceMono.className} text-gray-600`}>UID: {minerData.uid}</p>
              <span className={`${FontSpaceMono.className} rounded-full bg-green-100 px-2 py-1 text-sm`}>
                {minerData.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'DAILY EMISSION', value: `${minerData.emission.toFixed(6)} τ` },
              { label: 'LIFETIME EMISSION', value: `${minerData.totalEmission.toFixed(6)} τ` },
              { label: 'TRUST SCORE', value: minerData.trust.toFixed(6) },
              { label: 'STAKE', value: `${minerData.stakedAmt.toFixed(6)} τ` },
            ].map((stat, index) => (
              <div
                key={index}
                className="rounded-sm border-2 border-black bg-white p-4 shadow-brut-sm transition-shadow hover:shadow-brut-md"
              >
                <div className={`${FontSpaceMono.className} mb-1 text-sm font-bold`}>{stat.label}</div>
                <div className={`${FontSpaceMono.className} text-2xl font-bold`}>{stat.value || 'N/A'}</div>
              </div>
            ))}
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { label: 'RANK', value: `#${minerData.rank}` },
              { label: 'CONSENSUS', value: minerData.consensus.toFixed(6) },
              { label: 'INCENTIVE', value: minerData.incentive.toFixed(6) },
            ].map((stat, index) => (
              <div
                key={index}
                className="rounded-sm border-2 border-black bg-white p-4 shadow-brut-sm transition-shadow hover:shadow-brut-md"
              >
                <div className={`${FontSpaceMono.className} mb-1 text-sm font-bold`}>{stat.label}</div>
                <div className={`${FontSpaceMono.className} text-xl font-bold`}>{stat.value || 'N/A'}</div>
              </div>
            ))}
          </div>

          <div className="rounded-sm border-2 border-black bg-white p-4 shadow-brut-sm">
            <h2 className={`${FontSpaceMono.className} mb-4 text-xl font-bold`}>EMISSION HISTORY</h2>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />{' '}
          </div>

          <VisualizationTaskList />
        </main>
      </div>
    </Layout>
  );
};

export default IndividualMinerPage;
