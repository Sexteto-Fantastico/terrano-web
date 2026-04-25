import { type PaginatedData, type Filters } from "@/types/data-table";
import { sortByToState, stateToSortBy } from "@/lib/filters";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type TableOptions,
} from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from "@/components/ui/data-table/data-table-pagination";

type BaseRow = Record<string, string | number>;

type UseDataTableOptions<
  TData extends BaseRow,
  TEntityFilters extends Filters<TData>,
> = {
  data?: PaginatedData<TData>;
  columns: ColumnDef<TData>[];
  filters: TEntityFilters;
  setFilters: (partialFilters: Partial<TEntityFilters>) => void;
  tableOptions?: Omit<
    Partial<TableOptions<TData>>,
    | "data"
    | "columns"
    | "state"
    | "onSortingChange"
    | "onPaginationChange"
    | "manualFiltering"
    | "manualSorting"
    | "manualPagination"
    | "getCoreRowModel"
  >;
};

export function useDataTable<
  TData extends BaseRow,
  TEntityFilters extends Filters<TData>,
>({
  data = { result: [], rowCount: 0 },
  columns,
  filters,
  setFilters,
  tableOptions,
}: UseDataTableOptions<TData, TEntityFilters>) {
  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: filters.pageIndex ?? DEFAULT_PAGE_INDEX,
      pageSize: filters.pageSize ?? DEFAULT_PAGE_SIZE,
    }),
    [filters.pageIndex, filters.pageSize]
  );

  const sorting = useMemo<SortingState>(
    () => sortByToState(filters.sortBy),
    [filters.sortBy]
  );

  const setPaginationState = useCallback(
    (
      updaterOrValue:
        | PaginationState
        | ((old: PaginationState) => PaginationState)
    ) => {
      const newPaginationState =
        typeof updaterOrValue === "function"
          ? updaterOrValue(pagination)
          : updaterOrValue;

      setFilters({
        pageIndex: newPaginationState.pageIndex,
        pageSize: newPaginationState.pageSize,
      } as Partial<TEntityFilters>);
    },
    [pagination, setFilters]
  );

  const setSortingState = useCallback(
    (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      const newSortingState =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sorting)
          : updaterOrValue;

      setFilters({
        sortBy: stateToSortBy(newSortingState),
        pageIndex: DEFAULT_PAGE_INDEX,
      } as Partial<TEntityFilters>);
    },
    [setFilters, sorting]
  );

  const setTableFilters = useCallback(
    (partialFilters: Partial<TEntityFilters>) => {
      setFilters({
        ...partialFilters,
        pageIndex:
          partialFilters.pageIndex === undefined
            ? DEFAULT_PAGE_INDEX
            : partialFilters.pageIndex,
      });
    },
    [setFilters]
  );

  const table = useReactTable({
    data: data.result,
    columns,
    rowCount: data.rowCount,
    state: { pagination, sorting },
    onSortingChange: setSortingState,
    onPaginationChange: setPaginationState,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    ...tableOptions,
  });

  return {
    table,
    filters,
    pagination,
    sorting,
    setTableFilters,
    setPaginationState,
    setSortingState,
  };
}
