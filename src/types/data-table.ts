import type { PaginationState, RowData } from "@tanstack/react-table";

export type PaginatedData<T> = {
  result: T[];
  rowCount: number;
};

export type PaginationParams = PaginationState;
export type SortParams = { sortBy: `${string}.${"asc" | "desc"}` };
export type Filters<T> = Partial<T & PaginationParams & SortParams>;

export const DataTableFilter = {
  variants: [
    "text",
    "number",
    "range",
    "date",
    "dateRange",
    "boolean",
    "select",
    "multiSelect",
  ] as const,
} as const;

export type DataTableFilterVariant = (typeof DataTableFilter.variants)[number];

export type DataTableFilterOption = {
  label: string;
  value: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
};

export type DataTableFilterProps = {
  className?: string;
  inputProps?: Omit<
    React.ComponentProps<"input">,
    "value" | "defaultValue" | "onChange" | "type"
  >;
  selectProps?: {
    className?: string;
    placeholder?: string;
  };
};

export type DataTableFilterConfig = {
  label?: string;
  variant: DataTableFilterVariant;
  placeholder?: string;
  options?: DataTableFilterOption[];
  hidden?: boolean;
  props?: DataTableFilterProps;
};

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filter?: DataTableFilterConfig;
  }
}
