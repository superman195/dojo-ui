'use client';
import { WalletManagement } from '@/components/TaskListPageComponents';
import { categories as cat, dropdownOptions } from '@/data';
import useDropdown from '@/hooks/useDropdown';
import useGetTasks, { taskStatus } from '@/hooks/useGetTasks'; // Import the hook
import { useModal } from '@/hooks/useModal';
import { usePartnerList } from '@/hooks/usePartnerList';
import useSorting from '@/hooks/useSorting';
import { useAuth } from '@/providers/authContext';
import { useSubmit } from '@/providers/submitContext';
import { FontManrope, FontSpaceMono } from '@/utils/typography';
import {
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconArrowsDoubleSwNe,
  IconBoxMultiple2,
  IconBoxMultiple3,
  IconBoxMultiple4,
  IconBoxMultiple5,
  IconBoxMultiple6,
  IconBoxMultiple7,
  IconBoxMultiple8,
  IconSquareNumber1,
} from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { NextRouter, useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

import { Button } from '@/components/Common/Button';
import Datatablev2 from '@/components/Common/DataTable/Datatablev2';
import { DropdownContainer } from '@/components/Common/DropDown';
import SubscriptionModal from '@/components/Common/Modal/SubscriptionModal';
import { Pagination } from '@/components/Common/Pagination';
import Tooltip from '@/components/Common/Tooltip';
import TasktypePill from '@/components/QuestionPageComponents/TaskPrompt/tasktype-pill';
import CategoryItem from '@/components/TaskListPageComponents/CategoryList/CategoryItem';
import { ALL_CATEGORY } from '@/constants';
import useFeature from '@/hooks/useFeature';
import useSaveSortLocalStorage from '@/hooks/useSaveSortLocalStorage';
import Layout from '@/layout';
import { ButtonState } from '@/types/CommonTypes';
import { MODAL } from '@/types/ProvidersTypes';
import { Task } from '@/types/QuestionPageTypes';
import { cn } from '@/utils/tw';
import { ColumnDef, Row } from '@tanstack/react-table';
import Head from 'next/head';
const countdownTimerAutoFetchTask = 120;
const getCategoryObjectsFromUrlQuery = (query: string | string[] | undefined, baseCategories: any[]) => {
  if (!query) return [];
  if (typeof query === 'string') {
    const queryCategories = query.split(',');
    return baseCategories.filter((bcat) => queryCategories.includes(bcat.taskType));
  }
  if (Array.isArray(query)) {
    return baseCategories.filter((bcat) => query[0] === bcat.taskType);
  }

  return [];
};

const getUrlQueryFromCategoryObjects = (categories: any[]) => {
  return categories.map((cat) => cat.taskType).join(',');
};

const categoryIsActive = (taskType: string, query: string | string[] | undefined) => {
  if (!query) return false;
  if (typeof query === 'string') {
    return query.split(',').includes(taskType);
  }
  if (Array.isArray(query)) {
    return query.includes(taskType);
  }
  return false;
};

const RenderTaskLengthBadge = (length: number) => {
  switch (length) {
    case 1:
      return <IconSquareNumber1 className="size-5 rounded-sm" />;
    case 2:
      return <IconBoxMultiple2 className="size-5 rounded-sm" />;
    case 3:
      return <IconBoxMultiple3 className="size-5 rounded-sm" />;
    case 4:
      return <IconBoxMultiple4 className="size-5 rounded-sm" />;
    case 5:
      return <IconBoxMultiple5 className="size-5 rounded-sm" />;
    case 6:
      return <IconBoxMultiple6 className="size-5 rounded-sm" />;
    case 7:
      return <IconBoxMultiple7 className="size-5 rounded-sm" />;
    case 8:
      return <IconBoxMultiple8 className="size-5 rounded-sm" />;
    default:
  }
};

const RenderPill = ({ type, ...task }: Task) => {
  return (
    <div className="flex flex-wrap items-stretch gap-[5px] text-font-primary/80">
      <TasktypePill tasktype={type} />

      <Tooltip
        tooltipContent={`${task.taskData.responses.length} AI output${task.taskData.responses.length > 1 ? 's' : ''}, ${task.taskData.responses.reduce((acc, curr) => acc + curr.criteria.length, 0)} Question${task.taskData.responses.reduce((acc, curr) => acc + curr.criteria.length, 0) > 1 ? 's' : ''}`}
      >
        <div className="flex w-fit items-center gap-px rounded-full border border-font-primary/30 px-2 text-xs font-bold text-font-primary/70 ">
          {RenderTaskLengthBadge(task.taskData.responses.length)}
          <IconArrowsDoubleSwNe className="size-4" />
          <div className={cn(FontManrope.className, 'font-bold text-sm')}>
            {task.taskData.responses.reduce((acc, curr) => acc + curr.criteria.length, 0)}
          </div>
        </div>
      </Tooltip>
    </div>
  );
};

const RenderButton = (id: string, state: ButtonState, router: NextRouter, exp: boolean, meta?: any) => {
  const type = (meta && meta.type) ?? '';
  let tooltipContent = null;
  switch (state.text.toLowerCase()) {
    case 'start':
      tooltipContent = 'Start the task';
      break;
    case 'filled':
      tooltipContent = 'There are no more slots left on this task.';
      break;
    case 'completed':
      tooltipContent = 'You already completed this task.';
      break;
    case 'expired':
      tooltipContent = 'This task has expired.';
      break;
    default:
      tooltipContent = null;
      break;
  }
  return (
    <Tooltip className="w-fit" tooltipContent={tooltipContent} showCondition={!!state.text.toLowerCase()}>
      {/* <button
        onClick={() => {
          if (exp) {
            const currTask = tasklistFull.find((t) => t.taskId === id);
            if (currTask && currTask.taskData.responses.length == 1) router.push(`/Questions?taskId=${id}&exp=demo`);
            else router.push(`/Questions?taskId=${id}&exp=demo`);
          } else {
            router.push(`/Questions?taskId=${id}`);
          }
        }}
        disabled={state.disabled}
        className={cn(
          'uppercase h-[40px] font-bold border-[2px] rounded-sm border-black disabled:bg-gray-400 w-[113px] bg-primary text-white disabled:cursor-not-allowed',
          FontSpaceMono.className
        )}
      >
        {state.text}
      </button> */}
      <a
        href={state.disabled ? '' : exp ? `/Questions?taskId=${id}&exp=demo` : `/Questions?taskId=${id}`}
        className={cn(
          'uppercase h-[40px] font-bold border-[2px] rounded-sm border-black w-[113px] bg-primary text-white disabled:cursor-not-allowed',
          FontSpaceMono.className,
          state.disabled && 'pointer-events-none bg-gray-400 '
        )}
      >
        <span className="flex size-full items-center justify-center">{state.text}</span>
      </a>
    </Tooltip>
  );
};

export default function Index() {
  const [activeCategories, setActiveCategories] = useState<string[]>([ALL_CATEGORY]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showUserCard, setShowUserCard] = useState(false);
  const [countdown, setCountdown] = useState(countdownTimerAutoFetchTask);

  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { openModal } = useModal(MODAL.wallet);
  const { updateSorting, updateOrderSorting } = useSorting();
  const { applySortToUrl } = useSaveSortLocalStorage();
  const { isDropdownOpen, handleToggle, handleClickOutside, dropdownRef } = useDropdown();
  const { address, isConnected } = useAccount();
  const { triggerTaskPageReload } = useSubmit();
  const searchParams = useSearchParams();
  const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const [currentPage, setCurrentPage] = useState<string>('1');
  const { page, limit, tasks: taskTypes, sort, order, yieldMin, yieldMax } = router.query;
  const { exp } = useFeature({ kw: 'demo' });

  // ColumnDef for tasklists is moved into the component because of demo page.
  // Demo page requires a router and query params to find out
  // Whether its a demo page or not. Wrapping in a useMemo is enough to prevent unnecessary rerenders.
  const columnDef = useMemo(() => {
    const columnDef: ColumnDef<Task, any>[] = [
      {
        accessorKey: 'summary',
        header: 'Name',
        size: 130,
        cell: (info) => {
          return <div className=" truncate">{info.getValue() ?? info.row.original.title}</div>;
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 90,
        cell: (info) => {
          return RenderPill(info.row.original);
        },
      },
      // {
      //   accessorKey: "yield",
      //   header: "Yield",
      // },
      {
        accessorKey: 'expireAt',
        header: 'Expiry',
        size: 40,
        accessorFn: (row: any) => {
          if (exp) {
            // Generate a random number between 1 and 28
            const randomHours = Math.floor(Math.random() * 28) + 1;
            return `${randomHours}h`;
          }
          if (new Date(row.expireAt) < new Date() || row.status === taskStatus.EXPIRED) return 'Expired';
          const expiryDate = new Date(row.expireAt);
          const now = new Date();
          const diffMs = expiryDate.getTime() - now.getTime();
          const diffMins = Math.round(diffMs / 60000); // minutes
          const diffHrs = Math.floor(diffMins / 60); // hours
          const diffDays = Math.floor(diffHrs / 24); // days
          let formattedExpiry;
          if (diffDays >= 1) {
            formattedExpiry = `${diffDays}d`;
          } else if (diffHrs >= 1) {
            formattedExpiry = `${diffHrs}h`;
          } else {
            formattedExpiry = `${diffMins}m`;
          }
          return formattedExpiry;
        },
        cell: (info) => {
          return <div className="w-fit">{info.getValue()}</div>;
        },
      },
      {
        accessorKey: 'slotsFilled',
        header: 'Slots Filled',
        size: 50,
        accessorFn: (row: any) => `${row.numResults}/${row.maxResults}`,
      },
      {
        accessorKey: 'operations',
        header: '',
        size: 50,
        cell: (info) => {
          const generateBtnState = (row: Row<any>): ButtonState => {
            if (new Date(row.original.expireAt).getTime() < Date.now() || row.original.status === taskStatus.EXPIRED)
              return { disabled: true, text: 'Expired' };

            if (row.original.isCompletedByWorker) return { disabled: true, text: 'Completed' };

            if (row.original.maxResults === row.original.numResults || row.original.status == taskStatus.COMPLETED)
              return { disabled: true, text: 'Filled' };

            return { disabled: false, text: 'Start' };
          };
          const state = generateBtnState(info.row);
          return RenderButton(info.row.original.taskId, state, router, exp, { type: info.row.original.type });
        }, // Render JSX for the button
      },
    ];
    return columnDef;
  }, [exp, router]);

  const categories = cat;

  const { tasks, pagination, loading, refetchTasks } = useGetTasks(
    page ? parseInt(page as string) : parseInt(currentPage),
    limit ? parseInt(limit as string) : 10,
    taskTypes ? (taskTypes as string) : 'All',
    sort ? (sort as string) : 'createdAt',
    order ? (order as string) : 'desc',
    isConnected,
    isAuthenticated,
    yieldMin ? parseInt(yieldMin as string) : undefined,
    yieldMax ? parseInt(yieldMax as string) : undefined
  );

  const { partners } = usePartnerList(triggerTaskPageReload);
  const countdownRef = useRef(countdownTimerAutoFetchTask);

  useEffect(() => {
    const timer = setInterval(async () => {
      if (countdownRef.current == 0) {
        countdownRef.current = countdownTimerAutoFetchTask + 1;
        await refetchTasks();
      } else {
        countdownRef.current -= 1;
      }
      setCountdown(countdownRef.current); // Update the state for display purposes
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [refetchTasks]);

  useEffect(() => {
    if (!isAuthenticated || !isConnected) return;
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleCategoryClick = useCallback(
    (categoryLabel: string) => {
      //If all is clicked, remove all categories and just show all
      if (categoryLabel.toLowerCase() === 'all') {
        router.replace(
          {
            pathname: router.pathname,
            query: { ...router.query, tasks: undefined },
          },
          undefined,
          { shallow: true }
        );
        return;
      }
      if (!router) return;
      const activeCats = getCategoryObjectsFromUrlQuery(router.query.tasks, categories);
      // If the category is already active, remove it, else add it
      const updatedCategories = activeCats.some((cat) => cat.label.toLowerCase() === categoryLabel.toLowerCase())
        ? activeCats.filter((cat) => cat.label.toLowerCase() !== categoryLabel.toLowerCase())
        : [...activeCats, categories.find((cat) => cat.label.toLowerCase() === categoryLabel.toLowerCase())];

      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, tasks: getUrlQueryFromCategoryObjects(updatedCategories) },
        },
        undefined,
        { shallow: true }
      );
    },
    [router, categories]
  );
  useEffect(() => {
    // Apply the sorting from local storage when the component mounts
    applySortToUrl();
  }, []);

  const handlePageChange = (pageIndex: number | string) => {
    setCurrentPage(pageIndex.toString());
  };

  const handleViewClick = () => {
    setShowUserCard(false);
    setIsModalVisible(true);
  };

  return (
    <>
      <Head>
        <title>Dojo - Label Crowd Sourced Data and improve Open Source AI Multimodal model</title>
        <meta
          name="description"
          content="Label Data and support Open Source and Decentralized AI Multimodal model Development (Bittensor Subnet, etc)"
        ></meta>
      </Head>
      <Layout isFullWidth headerText={exp ? 'DEMO TASK LIST' : 'TASK LIST'}>
        <div className="w-full px-4">
          <div className="mx-auto mt-[18px] flex max-w-[1075px] md:py-2 lg:py-2">
            <div className="flex w-full flex-col items-start justify-between gap-[6px]">
              <span className={cn(FontSpaceMono.className, 'font-bold text-[22px] text-font-primary')}>Task Types</span>
              <div className="flex w-full flex-wrap items-center justify-between gap-2">
                <div className="flex flex-col items-stretch gap-[8px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryItem
                      className="px-4"
                      key={'all'}
                      label={'All'}
                      isActive={router.query.tasks === undefined || router.query.tasks === ''}
                      onClick={() => handleCategoryClick('all')}
                    />
                    {categories.map((category) => (
                      <CategoryItem
                        key={category.label}
                        label={category.label}
                        isActive={categoryIsActive(category.taskType, router.query.tasks)}
                        onClick={() => handleCategoryClick(category.label)}
                      />
                    ))}
                  </div>
                </div>
                <div className=" flex gap-2">
                  {!exp && (
                    <div ref={dropdownRef}>
                      <DropdownContainer
                        buttonText={`Sort By ${params.get('sort') === 'createdAt' ? 'Most Recent' : params.get('sort') === 'numCriteria' ? 'Least Difficult' : 'Most Attempted'}`}
                        imgSrc={`${params.get('order') === 'asc' ? '/top-arrow.svg' : '/down-arrow.svg'}`}
                        isOpen={isDropdownOpen}
                        onToggle={handleToggle}
                      >
                        <div
                          className={`DropDownButton-content absolute z-20 mt-[10px] w-full overflow-hidden rounded-[18px] border border-black/10 bg-card-background`}
                        >
                          <ul className="text-black opacity-75">
                            {dropdownOptions.map((option, index) => (
                              <li
                                key={index}
                                className={`flex text-base text-black ${
                                  params.get('sort') === option.value ? 'bg-secondary opacity-100' : 'py-1.5 opacity-75'
                                } ${FontManrope.className} cursor-pointer items-center justify-between  hover:bg-secondary hover:opacity-100`}
                              >
                                <div
                                  className="h-full min-w-[80%]  pl-[11px]"
                                  onClick={() => updateSorting(option.text)}
                                >
                                  {option.text}
                                </div>
                                <div className="h-full w-1/5">
                                  {params.get('sort') === option.value ? (
                                    params.get('order') === 'asc' ? (
                                      <div
                                        key={index}
                                        className={`px-2 py-[6px] text-base font-semibold text-black opacity-75 ${FontManrope.className} cursor-pointer hover:bg-secondary hover:opacity-100`}
                                        onClick={() => updateOrderSorting('desc')}
                                      >
                                        <IconArrowNarrowUp />
                                      </div>
                                    ) : (
                                      <div
                                        key={index}
                                        className={`px-2 py-[6px] text-base font-semibold text-black opacity-75 ${FontManrope.className} cursor-pointer hover:bg-secondary hover:opacity-100`}
                                        onClick={() => updateOrderSorting('asc')}
                                      >
                                        <IconArrowNarrowDown />
                                      </div>
                                    )
                                  ) : null}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </DropdownContainer>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full px-4">
          <div className="mx-auto mb-[40px] mt-[19px] flex max-w-[1075px] flex-col md:py-2 lg:py-2">
            <div className="mb-[19px]">
              <h1 className={`${FontSpaceMono.className} text-[22px] font-bold uppercase text-black`}>
                SHOWING {tasks.length} of {pagination?.totalItems || 0} RECORDS
              </h1>
              {isAuthenticated && isConnected ? (
                <span className={`${FontSpaceMono.className} text-sm font-bold text-black opacity-60`}>
                  Fetching latest tasks in {countdown}s
                </span>
              ) : null}
            </div>
            <Datatablev2
              tooltipShowingXofY={false}
              headerCellClassName={cn('py-2 uppercase', FontSpaceMono.className)}
              minColumnSize={10}
              defaultColumnSize={0}
              containerClassName="rounded-sm"
              tableClassName={cn('w-[1071px]', FontManrope.className)}
              data={tasks || []}
              columnDef={columnDef}
              pageSize={pagination?.pageSize || 10}
              loadingState={loading}
              showPagination={!exp ? false : true}
            />
            <div className="mt-3">
              {!exp && <Pagination totalPages={pagination?.totalPages || 1} handlePageChange={handlePageChange} />}
            </div>
            {isAuthenticated ? (
              partners.length === 0 || tasks.length <= 0 ? (
                <div className="text-center">
                  <Button
                    onClick={() => handleViewClick()}
                    buttonText="Enter Subscription Key"
                    className="cursor-not-allowed bg-primary text-white"
                  />
                </div>
              ) : null
            ) : null}
          </div>
        </div>
        {showUserCard && (
          <WalletManagement
            address={address || ''}
            openModal={openModal}
            closeModal={setShowUserCard}
            setShowUserCard={setShowUserCard}
            setShowSubscriptionCard={setIsModalVisible}
          />
        )}
        {isModalVisible && <SubscriptionModal setIsModalVisible={setIsModalVisible} isModalVisible={isModalVisible} />}
      </Layout>
    </>
  );
}
