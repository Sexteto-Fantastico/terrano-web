import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import { type Filters, type PaginatedData } from "@/components/ui/data-table/@types";

export const MovementEntryCategory = {
  PURCHASE: "PURCHASE",
  ADJUSTMENT: "ADJUSTMENT",
} as const;

export type MovementEntryCategory = (typeof MovementEntryCategory)[keyof typeof MovementEntryCategory];

export type MovementEntryItem = {
  id: number;
  product: { id: number; name: string } | null;
  quantity: number;
  unitCost: number | null;
};

export type MovementEntryPurchase = {
  id: number;
  nfNumber?: string | null;
  nfSerie?: string | null;
  supplier?: { id: number; tradeName: string } | null;
  products?: {
    id: number;
    productId: number;
    productName?: string;
    quantity: number;
    unitPrice: number;
  }[];
};

export type MovementEntryStockLocation = {
  id: number;
  name: string;
};

export type MovementEntry = {
  id: number;
  entryDate: string;
  entryMovementCategory: MovementEntryCategory;
  internalNotes?: string | null;
  purchase?: MovementEntryPurchase | null;
  stockLocation?: MovementEntryStockLocation | null;
  isActive?: boolean;
  items?: MovementEntryItem[];
};

export type MovementEntryFilters = {
  stockLocationId?: number;
  supplierId?: number;
  nfNumber?: string;
  nfSerie?: string;
  activeOnly?: boolean;
} & Filters<MovementEntry>;

export type CreateMovementEntryRequest = {
  stockLocationId: number;
  category: MovementEntryCategory;
  entryDate?: string;
  purchaseId?: number | null;
  internalNotes?: string | null;
  items: {
    productId: number;
    quantity: number;
    unitCost: number;
  }[];
};

export type CreateMovementExitReturnRequest = {
  stockLocationId: number;
  category: "RETURN";
  movementEntryId: number;
  nfNumber?: string | null;
  nfSerie?: string | null;
  internalNotes?: string | null;
  items: {
    productId: number;
    quantity: number;
    unitCost: number;
  }[];
};

export async function fetchMovementEntries(
  filters: MovementEntryFilters
): Promise<PaginatedData<MovementEntry>> {
  return fetchPaginated<MovementEntry>("/movements/entry", filters);
}

export async function fetchMovementEntryById(id: number): Promise<MovementEntry> {
  const { data } = await api.get<MovementEntry>(`/movements/entry/${id}`);
  return data;
}

export async function createMovementEntry(
  data: CreateMovementEntryRequest
): Promise<MovementEntry> {
  const { data: response } = await api.post<MovementEntry>("/movements/entry", data);
  return response;
}

export async function deleteMovementEntry(id: number): Promise<void> {
  await api.delete(`/movements/entry/${id}`);
}

export async function createMovementExitReturn(
  data: CreateMovementExitReturnRequest
): Promise<void> {
  await api.post("/movements/exit", data);
}
