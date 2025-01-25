'use client';

import Datatablev2 from '@/components/Common/DataTable/Datatablev2';
import { cn } from '@/utils/tw';
import { FontManrope, FontSpaceMono } from '@/utils/typography';
import { ColumnDef } from '@tanstack/react-table';

interface Task {
  id: string;
  name: string;
  type: string;
}

const tasks: Task[] = [
  {
    id: '76dc2a9a-0e3f-41b4-9bb5-2c83e3854c19',
    name: 'Create an interactive visualization of a vaccine molecular structure',
    type: 'Code Generation',
  },
  {
    id: 'demo0',
    name: 'Interactive guitar visualization with tuning slider',
    type: 'Code Generation',
  },
  {
    id: '3',
    name: 'Interactive visualization of a musical staff',
    type: 'Code Generation',
  },
  {
    id: '4',
    name: 'Landscape visualization with interactive features',
    type: 'Code Generation',
  },
  {
    id: '5',
    name: 'Interactive visualization of sound waves',
    type: 'Code Generation',
  },
  {
    id: '6',
    name: "Interactive visualization of a Newton's cradle",
    type: 'Code Generation',
  },
  {
    id: '7',
    name: 'Interactive visualization of a tornado',
    type: 'Code Generation',
  },
];
const columnDef: ColumnDef<Task, any>[] = [
  {
    accessorKey: 'name',
    header: 'NAME',
    size: 350,
    cell: (info) => {
      return <div className="truncate text-[15px]">{info.getValue()}</div>;
    },
  },
  {
    accessorKey: 'type',
    header: 'TYPE',
    size: 250,
    cell: (info) => {
      return (
        <div className="flex gap-2">
          <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-600">{info.getValue()}</span>
          <button className="rounded-full border border-gray-300 px-2">↗1</button>
        </div>
      );
    },
  },
  {
    accessorKey: 'action',
    header: '',
    size: 120,
    cell: (info) => {
      return (
        <button
          disabled
          onClick={
            () => {}
            // (window.location.href = `/Questions?taskId=${info.row.original.id}&exp=demo&showIndividualMinerLeadersboard=true`)
          }
          className={cn(
            'uppercase h-[40px] font-bold border-[2px] rounded-sm border-black w-[113px] bg-muted-foreground text-white disabled:cursor-not-allowed',
            FontSpaceMono.className
          )}
        >
          <span className="flex size-full items-center justify-center">View</span>
        </button>
      );
    },
  },
];
export default function VisualizationTaskList() {
  return (
    <>
      {/* <h2 className={`${FontSpaceMono.className} text-4xl mt-8 font-bold uppercase`}>Completed Task List</h2> */}

      <div className="mx-auto w-full py-8">
        <Datatablev2
          tooltipShowingXofY={false}
          headerCellClassName={cn('py-4 text-sm', FontSpaceMono.className)}
          minColumnSize={10}
          containerClassName="rounded-lg border border-black"
          tableClassName={cn('w-full min-w-732', FontManrope.className)}
          data={tasks}
          columnDef={columnDef}
          pageSize={10}
          loadingState={false}
        />
        {/* <BrutCard>lmao</BrutCard> */}
      </div>
    </>
  );
}
