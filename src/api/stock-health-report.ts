import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import type { Filters, PaginatedData } from "@/components/ui/data-table/@types";

export const StockHealthStatus = {
  ESGOTADO: "ESGOTADO",
  BAIXO: "BAIXO",
} as const;

export type StockHealthStatus = (typeof StockHealthStatus)[keyof typeof StockHealthStatus];

export type StockHealthReportItem = {
  id: number;
  productId: number;
  code: string;
  name: string;
  category: string | null;
  brand: string | null;
  measurementUnit: string;
  stockLocationId: number;
  stockLocationName: string;
  quantity: number;
  minStock: number | null;
  shortage: number | null;
  status: StockHealthStatus;
  updatedAt: string;
};

export type StockHealthSummary = {
  totalTracked: number;
  outOfStock: number;
  lowStock: number;
  totalCritical: number;
  criticalPercentage: number;
};

export type StockHealthReportQuery = {
  search?: string;
  stockLocationId?: string;
  status?: StockHealthStatus;
};

export type StockHealthReportFilters = Filters<StockHealthReportQuery>;

export async function fetchStockHealthReport(
  filters: StockHealthReportFilters
): Promise<PaginatedData<StockHealthReportItem>> {
  return fetchPaginated<StockHealthReportItem>("/stock-health-reports", filters);
}

export async function fetchStockHealthSummary(
  stockLocationId?: string
): Promise<StockHealthSummary> {
  const { data } = await api.get<StockHealthSummary>("/stock-health-reports/summary", {
    params: { stockLocationId },
  });
  return data;
}
