import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import { type Filters, type PaginatedData } from "@/components/ui/data-table/@types";

export const MovementExitCategory = {
  MATERIAL_REQUEST: "MATERIAL_REQUEST",
  STOCK_LOCATION_TRANSFER: "STOCK_LOCATION_TRANSFER",
  DEFECTIVE: "DEFECTIVE",
  RETURN: "RETURN",
  ADJUSTMENT: "ADJUSTMENT",
} as const;

export type MovementExitCategory = (typeof MovementExitCategory)[keyof typeof MovementExitCategory];

export type MovementExit = {
  id: number;
  exitDate: string;
  exitMovementCategory: MovementExitCategory;
  internalNotes?: string | null;
  purchase?: any;
  stockRequisition?: any;
  isActive?: boolean;
  items?: {
    id: number;
    product: any;
    quantity: number;
    unitCost?: number;
  }[];
};

export type MovementExitQuery = {
  id: number;
};

export type MovementExitFilters = {
  search?: string;
  exitMovementCategory?: string;
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  stockLocationId?: number;
  activeOnly?: boolean;
} & Filters<MovementExit>;

export type CreateMovementExitRequest = {
  stockLocationId: number;
  category: MovementExitCategory;
  internalNotes?: string | null;
  stockRequisitionId?: number;
  items: {
    productId: number;
    quantity: number;
    unitCost: number;
  }[];
};

export async function fetchMovementExits(
  filters: MovementExitFilters
): Promise<PaginatedData<MovementExit>> {
  const finalFilters = { ...filters };
  if (finalFilters.dateRange) {
    try {
      const parsed = JSON.parse(finalFilters.dateRange);
      if (parsed.from) finalFilters.startDate = parsed.from;
      if (parsed.to) finalFilters.endDate = parsed.to;
    } catch {}
    delete finalFilters.dateRange;
  }
  return fetchPaginated<MovementExit>("/movements/exit", finalFilters);
}

export async function fetchAllMovementExits(): Promise<MovementExit[]> {
  const { data } = await api.get<MovementExit[]>("/movements/exit");
  return data;
}

export async function createMovementExit(
  data: CreateMovementExitRequest
): Promise<MovementExit> {
  const { data: response } = await api.post<MovementExit>("/movements/exit", data);
  return response;
}

export async function deleteMovementExit(id: number): Promise<void> {
  await api.delete(`/movements/exit/${id}`);
}
