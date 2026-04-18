import { useDataTablePagination } from "@/components/ui/data-table/data-table-hooks";
import { useQueryState } from "nuqs";

export function useSearchQueryState({ searchKey }: { searchKey?: string }) {
  const { page, setPage } = useDataTablePagination();
  const [search, setSearch] = useQueryState(searchKey ?? "search", {
    defaultValue: "",
    clearOnDefault: true,
  });

  return {
    search,
    setSearch: (value: string) => {
      if (page !== 1) {
        void setPage(1);
      }
      setSearch(value);
    },
  };
}
