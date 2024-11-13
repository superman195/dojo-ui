// This function is only for tanstack table v8 implementation.
// When using the TPLXDatatable2, we get to tell pass in
// Data, ColumnDefs, and Filters. Each filter will create an input field
// that is responsible for filtering the data passed into TPLXDatatable2.
// Special function: Include in your data a key called bodyRowClassName in order to style the row with tailwind
import {
  ColumnDef,
  ColumnFilter,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { HTMLAttributes, useEffect, useRef, useState } from 'react';

import { wait } from '@/utils/general_helpers';
import { cn } from '@/utils/tw';
import { FontSpaceMono } from '@/utils/typography';
import {
  IconArrowsSort,
  IconChevronsLeft,
  IconChevronsRight,
  IconSortAscending,
  IconSortDescending,
} from '@tabler/icons-react';
import React from 'react';
import { BrutCard } from '../CustomComponents/brut-card';
import Shimmers from '../CustomComponents/shimmers';

export interface FilterDef {
  filterType: 'gloabl' | 'column';
  columnIdToFilter?: string;
  filterInputType?: 'string' | 'date';
  displayLabel?: string;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  canLoad?: boolean;
  loadingState?: boolean;
  data: any[];
  columnDef: ColumnDef<any, any>[];
  filterControlsDef?: FilterDef[];
  dateFilterControlType?: 'past' | 'future' | 'none';
  pageSize?: number;
  headerClassName?: string;
  headerCellClassName?: string;
  containerClassName?: string;
  styled?: boolean;
  tooltipShowingXofY?: boolean;
  cellsClassName?: string | ((row: Row<any>) => string);
  tableClassName?: string;
  defaultColumnSize?: number;
  minColumnSize?: number;
  columnVisibility?: Record<string, boolean>;
  isLastSticky?: boolean;
  globalFilter?: string;
  getRowCanExpand?: (row: Row<any>) => boolean;
  onSortingChange?: (sorting: any) => void;
}

export interface dateRangeType {
  startDate: Date | null;
  endDate: Date | null;
}

type filterControlState = Record<string, string | { startDate: Date | null; endDate: Date | null }>;

const Datatablev2 = ({
  canLoad,
  loadingState,
  data,
  columnDef,
  filterControlsDef,
  pageSize,
  dateFilterControlType,
  headerClassName,
  headerCellClassName,
  tooltipShowingXofY,
  styled,
  cellsClassName,
  tableClassName,
  defaultColumnSize,
  minColumnSize,
  columnVisibility,
  isLastSticky,
  globalFilter = '',
  containerClassName,
  getRowCanExpand,
  onSortingChange,
  ...props
}: Props) => {
  // Configuration
  const initialPageSize = pageSize ?? 8;
  const allowLoading = canLoad ?? true;
  const isStyled = styled ?? true;
  const showTooltipShowingXofY = tooltipShowingXofY ?? true;
  const tableDefaultColumnSize = defaultColumnSize ?? 150;
  const tableMinColumnSize = minColumnSize ?? 150;
  const [pageControlPagesShown, setPageControlPagesShown] = useState<number[]>([]);
  // const [globalFilter, setGlobalFiltering] = useState('');
  const [allFilters, setAllFilters] = useState<filterControlState>(); //Filter controls state to store all
  const [columnFilterState, setColumnFilterState] = useState<ColumnFilter[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const excludeDateIntervals: {
    start: Date;
    end: Date;
  }[] = [];

  const table = useReactTable({
    data: data,
    columns: React.useMemo(
      () =>
        columnDef.map((column) => ({
          ...column,
          enableSorting: column.enableSorting ?? false,
        })),
      [columnDef]
    ),
    defaultColumn: {
      size: tableDefaultColumnSize,
      minSize: tableMinColumnSize,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      onSortingChange?.(newSorting);
    },
    initialState: { pagination: { pageSize: initialPageSize } },
    state: {
      globalFilter: globalFilter,
      columnFilters: columnFilterState,
      columnVisibility: columnVisibility,
      sorting,
    },
    getRowCanExpand: getRowCanExpand,
    enableExpanding: getRowCanExpand ? true : false,
  });

  const getPaginationShownPagesNumber = () => {
    const maxNumPagesShown = 5; // This is this number of pages shown (must be odd) e.g. 1,2,3,4,5 or 4,5,6,7,8
    const currPage = table.getState().pagination.pageIndex + 1; // Current human readable page (1,2,3,4), not computer index (0,1,2,3)
    let startingIdx = currPage - (maxNumPagesShown - 1) / 2; // Must start with >=1
    if (table.getPageCount() - currPage < (maxNumPagesShown - 1) / 2)
      // This if checks if its reaching the end, then the starting index will change accordingly
      startingIdx = startingIdx - ((maxNumPagesShown - 1) / 2 - (table.getPageCount() - currPage));
    const retList = []; // The Final list to be updated to pageControlPagesShown state
    // get the first starting idx that is positive
    while (startingIdx <= 0) {
      startingIdx++;
    }
    for (let i = startingIdx; i < maxNumPagesShown + startingIdx && i <= table.getPageCount(); i++) {
      retList.push(i);
    }
    setPageControlPagesShown([...retList]);
  };

  // Handlers
  const goToPageOnClickHandler = async (pageNum: number) => {
    if (table.getState().pagination.pageIndex + 1 == pageNum) return;
    table.setPageIndex(pageNum - 1);
    await wait(0);
    getPaginationShownPagesNumber();
  };

  const firstPageOnClickHandler = async () => {
    if (table.getState().pagination.pageIndex == 0) return;
    table.setPageIndex(0);
    await wait(0);
    getPaginationShownPagesNumber();
  };
  const lastPageOnClickHandler = async () => {
    if (table.getState().pagination.pageIndex + 1 == table.getPageCount()) return;
    table.setPageIndex(table.getPageCount() - 1);
    await wait(0);
    getPaginationShownPagesNumber();
  };

  const prevPageHandler = async () => {
    if (!table.getCanPreviousPage()) return;
    table.previousPage();
    await wait(0);
    getPaginationShownPagesNumber();
  };

  const nextPageHandler = async () => {
    if (!table.getCanNextPage()) return;
    table.nextPage();
    await wait(0);
    getPaginationShownPagesNumber();
  };

  const updateFiltersState = (idToUpdate?: string, value?: any) => {
    if (!idToUpdate) return;
    const cf: ColumnFilter = {
      id: idToUpdate,
      value: value,
    };

    //Setting the column filter for the actual datatable
    setColumnFilterState((prev) => {
      // This will remove the old filter and add the new one
      const removedFilter = prev.filter((v, i) => {
        return v.id !== idToUpdate;
      });

      return [...removedFilter, cf];
    });

    //Setting for the input control filter
    setAllFilters((prev) => {
      const newInputFilters = { ...prev };
      newInputFilters[idToUpdate] = value;
      return newInputFilters;
    });
  };

  const removeFromFilterState = (idToRemove?: string) => {
    if (!idToRemove) return;

    //Setting column filter for actual datatable
    setColumnFilterState((prev) => {
      const filterRes = prev.filter((v, i) => {
        return v.id !== idToRemove;
      });
      return [...filterRes];
    });

    //Setting for the input control filter
    setAllFilters((prev) => {
      const newInputFilters = { ...prev };
      Object.keys(newInputFilters).forEach((v) => {
        if (typeof newInputFilters[v] === 'string') {
          newInputFilters[v] = '';
        } else if (
          newInputFilters[v] instanceof Object &&
          'startDate' in (newInputFilters[v] as any) &&
          'endDate' in (newInputFilters[v] as any)
        ) {
          newInputFilters[v] = { startDate: null, endDate: null };
        }
      });
      return newInputFilters;
    });
  };

  const renderLoadingShimmer = () => {
    return (
      <tbody>
        <tr>
          <td className="relative h-[100px]">
            <div className="absolute left-0 top-0 flex w-full flex-col gap-[20px] p-[16px]">
              <Shimmers className="w-6/12"></Shimmers>
              <Shimmers className="w-8/12"></Shimmers>
            </div>
          </td>
        </tr>
      </tbody>
    );
  };

  const renderNoDataIntableFound = () => {
    return (
      <>
        <tbody>
          <tr>
            <td className="h-[100px]">
              {/* <div className="w-full h-full flex justify-center items-center absolute top-0 left-0">
              No data found here...
            </div> */}
            </td>
          </tr>
        </tbody>
      </>
    );
  };

  // useEffect(() => {
  //   getPaginationShownPagesNumber();
  // }, [table.getFilteredRowModel().rows]);

  useEffect(() => {
    getPaginationShownPagesNumber();
  }, [data]);

  useEffect(() => {
    // Populate filter control states into format of e.g. {state.txn_hash='0xCe...' or state.timestamp={startdate,enddate}}
    if (filterControlsDef) {
      const tempAllFilters: filterControlState = {};
      filterControlsDef?.forEach((filterControl, i) => {
        filterControl.columnIdToFilter &&
          (tempAllFilters[filterControl.columnIdToFilter] =
            filterControl.filterInputType === 'string' ? '' : { startDate: null, endDate: null });
      });
      setAllFilters(tempAllFilters);
    }
  }, []);
  return (
    <div className="flex w-full flex-col gap-[8px]">
      {/* Table controls */}
      {showTooltipShowingXofY && (
        <span className={cn('text-xs text-muted-foreground')}>
          Showing{' '}
          {table.getState().pagination.pageIndex * initialPageSize +
            (table.getFilteredRowModel().rows.length > 0 ? 1 : 0)}
          -
          {Math.min(
            table.getFilteredRowModel().rows.length,
            (table.getState().pagination.pageIndex + 1) * initialPageSize
          )}{' '}
          of {table.getFilteredRowModel().rows.length}..
          {table.getFilteredRowModel().rows.length}
        </span>
      )}
      <BrutCard
        variant={isStyled ? 'default' : 'none'}
        ref={tableContainerRef}
        className={cn(
          'p-0 overflow-x-auto relative',
          !loadingState && table.getFilteredRowModel().rows.length <= 0 && 'overflow-x-hidden',
          'sticky-table-container',
          containerClassName,
          'rounded-sm'
        )}
      >
        {/* Default col size in tanstack table is 150px  */}
        {/* Table size is page body size (800 atm) -2pixel cuz of borders */}
        {/* Have to put fixed width and table-fixed if not the widths will let the content anyhow run */}
        {/* By doing the above, the td will all follow the table header */}

        {/* This is a no data overlay */}
        {!loadingState && table.getFilteredRowModel().rows.length <= 0 && (
          <div className="absolute z-10 flex size-full items-center justify-center bg-gradient-to-t from-background to-background/80 capitalize">
            no data
          </div>
        )}
        <table className={cn('table-fixed w-[1100px] relative', tableClassName)}>
          <thead className={cn('border-b-[1px] border-muted-foreground', headerClassName)}>
            {table.getHeaderGroups().map((hg) => (
              <tr className="" key={hg.id}>
                {hg.headers.map((header, idx) => (
                  <th
                    onClick={header.column.getToggleSortingHandler()}
                    key={header.id}
                    className={cn(
                      'text-start px-[12px] py-[6px]',
                      headerCellClassName,
                      idx === hg.headers.length - 1 && isLastSticky && 'sticky-column',
                      header.column.getCanSort() && 'cursor-pointer'
                    )}
                    style={{
                      boxShadow:
                        idx === hg.headers.length - 1 && isLastSticky
                          ? 'inset 1px 0px 1px -1px black'
                          : 'inset 0px 0px 0px -1px black',
                      maxWidth: header.column.getSize() == 0 ? 'auto' : `${header.column.getSize()}px`,
                      width: header.column.getSize() == 0 ? 'auto' : `${header.column.getSize()}px`,
                      minWidth: header.column.getSize() == 0 ? 'auto' : `${header.column.getSize()}px`,
                    }}
                  >
                    <div className="flex items-center gap-[3px]">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <IconSortAscending className="shrink-0" size={16} />,
                        desc: <IconSortDescending className="shrink-0" size={16} />,
                      }[header.column.getIsSorted() as string] ??
                        (header.column.getCanSort() ? (
                          <IconArrowsSort className="shrink-0 text-font-primary/40" size={16} />
                        ) : null)}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {allowLoading && loadingState ? (
            renderLoadingShimmer()
          ) : (
            <>
              {allowLoading && !loadingState && table.getFilteredRowModel().rows.length <= 0 ? (
                renderNoDataIntableFound()
              ) : (
                <tbody>
                  {table.getRowModel().rows.map((row, rowIdx) => (
                    <tr
                      style={row.original.bodyRowClassName ? row.original.bodyRowClassName : {}}
                      className={cn()}
                      key={row.id}
                    >
                      {row.getVisibleCells().map(
                        (cell, idx: number) =>
                          (!cell.row.original.info || (cell.row.original.info && idx === 0)) && (
                            <td
                              colSpan={cell.row.original.info ? row.getVisibleCells().length : 1}
                              key={cell.id}
                              style={{
                                minHeight: '42px',
                                boxShadow:
                                  idx === row.getVisibleCells().length - 1 && isLastSticky
                                    ? 'inset 1px 0px 1px -1px black'
                                    : 'inset 0px 0px 0px -1px black',
                              }}
                              className={cn(
                                'border-b-[1px] px-[12px] py-[6px] h-[55px]',
                                typeof cellsClassName === 'string'
                                  ? cellsClassName
                                  : cellsClassName && cellsClassName(row),
                                idx === row.getVisibleCells().length - 1 && isLastSticky && 'sticky-column ',
                                cell.row.original.info && 'p-0 h-fit'
                              )}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          )
                      )}
                    </tr>
                  ))}
                </tbody>
              )}
            </>
          )}
        </table>
      </BrutCard>
      {table.getPageCount() > 1 && (
        //pagination section
        <div className="mt-[10px] flex items-center justify-end gap-[8px]">
          <button
            disabled={!table.getCanPreviousPage()}
            onClick={prevPageHandler}
            className={cn(
              FontSpaceMono.className,
              !table.getCanPreviousPage() && 'text-muted bg-transparent border-none',
              'font-bold p-0'
            )}
          >
            PREV
          </button>
          <button
            onClick={firstPageOnClickHandler}
            className={cn(
              'flex aspect-square h-[30px] items-center justify-center p-0',
              table.getState().pagination.pageIndex == 0 ? 'text-muted' : 'text-font-primary'
            )}
          >
            <IconChevronsLeft />
          </button>
          {pageControlPagesShown.map((v, i) => {
            return (
              <button
                onClick={() => {
                  goToPageOnClickHandler(v);
                }}
                className={cn(
                  FontSpaceMono.className,
                  'font-bold p-0',
                  table.getState().pagination.pageIndex + 1 == v ? 'text-black' : ' text-font-primary/40'
                )}
                key={`pageControlPages_${i}`}
              >
                {v}
              </button>
            );
          })}
          <button
            onClick={lastPageOnClickHandler}
            className={cn(
              'flex aspect-square h-[30px] items-center justify-center p-0',
              table.getState().pagination.pageIndex + 1 == table.getPageCount() || table.getPageCount() == 0
                ? 'text-muted'
                : 'text-font-primary'
            )}
          >
            <IconChevronsRight />
          </button>
          <button
            disabled={!table.getCanNextPage()}
            onClick={nextPageHandler}
            className={cn(
              FontSpaceMono.className,
              !table.getCanNextPage() && 'text-muted bg-transparent border-none',
              'font-bold p-0'
            )}
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
};

export default Datatablev2;
