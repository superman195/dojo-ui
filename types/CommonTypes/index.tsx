import { brutCardVariants } from '@/components/Common/CustomComponents/brut-card';
import { buttonVariants } from '@/components/Common/CustomComponents/button';
import { ColumnDef } from '@tanstack/react-table';
import { VariantProps } from 'class-variance-authority';
import { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export type CustomButtonProps = {
  onClick?: () => void;
  className?: string;
  buttonText: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

export type ComingSoonProps = {
  type?: 'Coming Soon' | 'Not Found';
  mainTitle?: string;
  mainSubTitle?: string;
  subtitle1?: string;
  subtitle2?: string;
};

export interface DropdownContainerProps {
  buttonText: string;
  imgSrc: string;
  children?: ReactNode;
  className?: string;
  count?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export type DropdownButtonProps = {
  buttonText: string;
  imgSrc: string;
  onClick: () => void;
  count?: string;
  className?: string;
};

export type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
  errorMessage?: string;
  isCopy?: boolean;
};

export type LabelledInputProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type ModalProps = {
  title: string;
  showModal: boolean;
  setShowModal: Function;
  btnText: string;
  children: ReactNode;
  className?: string;
};

export interface ModalContainerProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
  header?: React.ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
}

export interface MSProps {
  options: string[];
  onSelectionChange: (value: string) => void;
}

export type conditionalMSProps =
  | { singleSelect: true; selectedValues: string }
  | { singleSelect?: false | undefined; selectedValues: string[] };

export type MultiSelectProps = MSProps & conditionalMSProps;

export interface MultiSelectItemProps {
  option: string;
  isSelected: boolean;
  onSelectionChange: (value: string) => void;
  singleSelect?: boolean;
}

export interface MultiSelectQuestionProps {
  questionDataPY: Array<{
    id: string;
    showTitle: boolean;
    src: string;
  }>;
  options: Array<any>; // Define the correct type for your options
  handleOrderChange: (newOrder: Array<any>) => void; // Define the correct type for the newOrder
}

export type NavigationBarProps = {
  openModal: () => void;
  isHomePage?: boolean;
};

export interface PaginationProps {
  totalPages: number;
  handlePageChange: (page: number) => void;
}

export type SubscriptionModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
export type SubscriptionData = {
  id: string;
  subscriptionKey: string;
  createdAt: string;
  name: string;
};

export type SubscriptionTableProps = {
  refetch?: boolean | null;
};

export interface BrutCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof brutCardVariants> {
  loading?: boolean;
  disabledOverlay?: ReactNode;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export interface UserCardProps {
  closeModal: Function;
  children?: React.ReactNode;
}

export interface FilterDef {
  filterType: 'global' | 'column';
  columnIdToFilter?: string;
  filterInputType?: 'string' | 'date';
  displayLabel?: string;
}

export interface DatatableProps {
  canLoad?: boolean;
  loadingState?: boolean;
  data: any[];
  columnDef: ColumnDef<any, any>[];
  filterControlsDef?: FilterDef[];
  dateFilterControlType?: 'past' | 'future' | 'none';
  pageSize?: number;
  headerClassName?: string;
  headerCellClassName?: string;
  styled?: boolean;
  tooltipShowingXofY?: boolean;
  cellsClassName?: string;
  tableClassName?: string;
  defaultColumnSize?: number;
  columnVisibility?: Record<string, boolean>;
  isLoading?: boolean;
  cellRenderer?: (cell: any, cellIndex: number, row: any, rowIndex: number) => React.ReactNode;
  rowRenderer?: (row: any, rowIndex: number, cells: any[]) => React.ReactNode;
}

export type ColumnFilter = {
  id: string;
  value: any;
};

export type ButtonState = {
  disabled: boolean;
  text: string;
};
