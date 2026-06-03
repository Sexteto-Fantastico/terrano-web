import { fetchPaginated } from "@/lib/pagination";
import type { Filters, PaginatedData } from "@/components/ui/data-table/@types";

export type Supplier = {
  id: number;
  tradeName: string;
};

export type SupplierFilters = Filters<{
  tradeName?: string;
  activeOnly?: string;
}>;

export async function fetchSuppliers(
  filters?: SupplierFilters
): Promise<PaginatedData<Supplier>> {
  return fetchPaginated<Supplier>("/suppliers", filters);
}

export async function fetchAllSuppliers(): Promise<Supplier[]> {
  const response = await fetchPaginated<Supplier>("/suppliers", {
    pageIndex: 0,
    pageSize: 50,
  });
  return response.result;
}
