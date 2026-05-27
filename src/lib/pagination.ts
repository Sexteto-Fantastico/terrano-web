import api from "@/lib/axios";
import type { Filters, PaginatedData } from "@/components/ui/data-table/@types";
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from "@/components/ui/data-table/data-table-pagination";

export async function fetchPaginated<T, Q>(
  url: string,
  params?: Filters<Q>
): Promise<PaginatedData<T>> {
  const {
    pageIndex = DEFAULT_PAGE_INDEX,
    pageSize = DEFAULT_PAGE_SIZE,
    ...rest
  } = params ?? {};

  const response = await api.get<T[]>(url, {
    params: {
      ...rest,
      pageIndex: pageIndex + 1,
      pageSize,
    },
  });

  const totalCount = response.headers["x-total-count"];
  return {
    result: response.data,
    rowCount: totalCount ? Number(totalCount) : response.data.length,
  };
}
