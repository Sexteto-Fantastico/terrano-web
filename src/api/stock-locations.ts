import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import type { Filters, PaginatedData } from "@/components/ui/data-table/@types";

export type StockLocationAddress = {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  complement?: string;
};

export type StockLocation = {
  id: number;
  name: string;
  description?: string | null;
  address?: StockLocationAddress | null;
  isActive?: boolean;
  deletedAt?: string | null;
};

export type CreateStockLocationRequestDTO = {
  name: string;
  description?: string;
  address: StockLocationAddress;
};

export type UpdateStockLocationRequestDTO = {
  id: number;
  name: string;
  description?: string;
  address: StockLocationAddress;
};

type StockLocationQuery = {
  name?: string;
  activeOnly?: string;
};

export type StockLocationFilters = Filters<StockLocationQuery>;

type StockLocationApiResponse = Omit<StockLocation, "isActive"> & {
  isActive?: boolean;
};

function withIsActive(stockLocation: StockLocationApiResponse): StockLocation {
  return {
    ...stockLocation,
    isActive: stockLocation.isActive ?? stockLocation.deletedAt == null,
  };
}

export async function fetchStockLocations(
  filters: StockLocationFilters
): Promise<PaginatedData<StockLocation>> {
  const response = await fetchPaginated<StockLocationApiResponse>(
    "/stock-locations",
    filters
  );

  return {
    ...response,
    result: response.result.map(withIsActive),
  };
}

export async function fetchStockLocationById(
  id: number
): Promise<StockLocation> {
  const { data } = await api.get<StockLocationApiResponse>(
    `/stock-locations/${id}`
  );
  return withIsActive(data);
}

export async function createStockLocation(
  data: CreateStockLocationRequestDTO
): Promise<StockLocation> {
  const { data: response } = await api.post<StockLocationApiResponse>(
    "/stock-locations",
    data
  );
  return withIsActive(response);
}

export async function updateStockLocation(
  data: UpdateStockLocationRequestDTO
): Promise<StockLocation> {
  const { id, ...body } = data;
  const { data: response } = await api.put<StockLocationApiResponse>(
    `/stock-locations/${id}`,
    body
  );
  return withIsActive(response);
}

export async function deleteStockLocation(id: number): Promise<void> {
  await api.delete(`/stock-locations/${id}`);
}

export async function restoreStockLocation(
  id: number
): Promise<StockLocation> {
  const { data } = await api.patch<StockLocationApiResponse>(
    `/stock-locations/${id}/restore`
  );
  return withIsActive(data);
}