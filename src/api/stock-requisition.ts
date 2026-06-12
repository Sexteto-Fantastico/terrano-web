import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import type {
  Filters,
  PaginatedData,
} from "@/components/ui/data-table/@types";

export const STOCK_REQUISITION_STATUS = {
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
  DENIED: "DENIED",
  APPROVED: "APPROVED",
  WAITING_PURCHASE: "WAITING_PURCHASE",
  WAITING_ARRIVAL: "WAITING_ARRIVAL",
  FINISHED: "FINISHED",
} as const;

export type StockRequisitionStatus =
  (typeof STOCK_REQUISITION_STATUS)[keyof typeof STOCK_REQUISITION_STATUS];

export const STOCK_REQUISITION_STATUS_LABELS: Record <StockRequisitionStatus,string> = {
  PENDING: "Pendente",
  CANCELLED: "Cancelada",
  DENIED: "Negada",
  APPROVED: "Aprovada",
  WAITING_PURCHASE: "Aguardando compra",
  WAITING_ARRIVAL: "Aguardando chegada",
  FINISHED: "Finalizada",
};

export type StockRequisitionItem = {
  productId: number;
  productName?: string;
  quantity: number;
  delivered: boolean;
};

export type StatusLog = {
  id: number;
  previousStatus?: StockRequisitionStatus | null;
  currentStatus: StockRequisitionStatus;
  changeJustification?: string | null;
  createdAt: string;
};

export type StockRequisition = {
  id: number;
  requesterJustification: string;
  status: StockRequisitionStatus;
  createdAt: string;
  department?: { id: number; name: string } | null;
  items: StockRequisitionItem[];
  statusLogs?: StatusLog[];
  deletedAt?: string | null;
};

export type CreateStockRequisitionDTO = {
  requesterJustification: string;
  items: {
    productId: number;
    quantity: number;
  }[];
};

export type UpdateStockRequisitionDTO = {
  id: number;
  requesterJustification?: string;
  items?: {
    productId: number;
    quantity: number;
  }[];
};

export type UpdateStockRequisitionStatusDTO = {
  status: StockRequisitionStatus;
  changeJustification?: string;
};

export type StockRequisitionFilters = Filters<{
  status?: StockRequisitionStatus;
  openOnly?: "true" | "false";
  activeOnly?: "true" | "false";
  startDate?: string;
  endDate?: string;
  period?: { from?: string; to?: string };
  pageIndex?: number;
  pageSize?: number;
}>;
export async function fetchStockRequisitions(
  filters: StockRequisitionFilters
): Promise<PaginatedData<StockRequisition>> {
  const period = (filters as any).period;
  const apiFilters: StockRequisitionFilters = {
    ...filters,
    startDate: period?.from ?? filters.startDate,
    endDate: period?.to ?? filters.endDate,
  };
  delete (apiFilters as any).period;

  if (apiFilters.status) {
    delete (apiFilters as any).openOnly;  
  }

  return fetchPaginated<StockRequisition>("/stock-requisitions", apiFilters);
}

export async function fetchAllStockRequisitions(): Promise<StockRequisition[]> {
  const { data } = await api.get<StockRequisition[]>("/stock-requisitions");
  return data;
}

export async function fetchStockRequisitionById(
  id: number
): Promise<StockRequisition> {
  const { data } = await api.get<StockRequisition>(
    `/stock-requisitions/${id}`
  );
  return data;
}

export async function createStockRequisition(
  dto: CreateStockRequisitionDTO
): Promise<StockRequisition> {
  const { data } = await api.post<StockRequisition>(
    "/stock-requisitions",
    dto
  );
  return data;
}

export async function updateStockRequisition(
  dto: UpdateStockRequisitionDTO
): Promise<StockRequisition> {
  const { id, ...payload } = dto;

  const { data } = await api.put<StockRequisition>(
    `/stock-requisitions/${id}`,
    payload
  );

  return data;
}

export async function updateStockRequisitionStatus(
  id: number,
  dto: UpdateStockRequisitionStatusDTO
): Promise<StockRequisition> {
  const { data } = await api.patch<StockRequisition>(
    `/stock-requisitions/${id}/status`,
    dto
  );
  return data;
}

export async function deleteStockRequisition(id: number): Promise<void> {
  await api.delete(`/stock-requisitions/${id}`);
}

export async function restoreStockRequisition(
  id: number
): Promise<StockRequisition> {
  const { data } = await api.post<StockRequisition>(
    `/stock-requisitions/${id}/restore`
  );
  return data;
}