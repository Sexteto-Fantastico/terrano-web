import api from "@/lib/axios";
import type { Filters } from "@/components/ui/data-table/@types";

export async function fetchPaginated<T>(
  url: string,
  params?: Filters<T>
): Promise<{ result: T[]; rowCount: number }> {
  const { pageIndex = 0, pageSize = 10, ...rest } = params ?? {};

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
