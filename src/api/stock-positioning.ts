import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import {
  type Filters,
  type PaginatedData,
} from "@/components/ui/data-table/@types";
import type { Product } from "./products";

export const StockPositioningStatus = {
  ESGOTADO: "ESGOTADO",
  BAIXO: "BAIXO",
  ADEQUADO: "ADEQUADO",
  EXCESSO: "EXCESSO",
} as const;

export type StockPositioningStatus = (typeof StockPositioningStatus)[keyof typeof StockPositioningStatus];

export type StockPositioning = {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  stockLocationId: number;
  status: StockPositioningStatus;
  updatedAt: string;
};

export type StockPositioningMetrics = {
  totalItems: number;
  lowStock: number;
  excessStock: number;
  outOfStock: number;
};

export type StockPositioningQuery = {
  stockLocationId?: string;
  search?: string;
  status?: StockPositioningStatus;
};

export type StockPositioningFilters = Filters<StockPositioningQuery>;

export async function fetchStockPositionings(
  filters: StockPositioningFilters
): Promise<PaginatedData<StockPositioning>> {
  return fetchPaginated<StockPositioning>("/stock-positionings", filters);
}

export async function fetchStockPositioningMetrics(
  stockLocationId?: string
): Promise<StockPositioningMetrics> {
  const { data } = await api.get<StockPositioningMetrics>("/stock-positionings/metrics", {
    params: { stockLocationId },
  });
  return data;
}

export async function generateStockReport(stockLocationId?: string): Promise<void> {
  await api.post("/stock-positionings/export", { stockLocationId });
}
