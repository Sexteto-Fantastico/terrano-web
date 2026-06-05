import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import type { Filters, PaginatedData } from "@/components/ui/data-table/@types";

export type PurchasePaymentMethod =
  | "CASH"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "BANK_TRANSFER"
  | "PIX";

export type PurchaseProduct = {
  id?: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type PurchasePayment = {
  id?: number;
  paymentMethod: PurchasePaymentMethod;
  total: number;
};

export type PurchaseSupplier = {
  id: number;
  tradeName: string;
  name?: string;
};

export type Purchase = {
  id: number;
  total: number;
  purchaseDate: string;
  estimatedDeliveryDate?: string | null;
  supplier?: PurchaseSupplier | null;
  nfNumber?: string;
  nfSerie?: string;
  usedNfXmlDocument?: boolean;
  internalNotes?: string;
  payments: PurchasePayment[];
  products: PurchaseProduct[];
  deletedAt?: string | null;
  isActive: boolean;
};

export type PurchaseFilters = Filters<{
  supplierId?: string;
  purchaseDate?: string;
  estimatedDeliveryDate?: string;
  nfNumber?: string;
  nfSerie?: string;
  activeOnly?: string;
}>;

export type PurchasePaymentRequest = {
  id?: number;
  paymentMethod: PurchasePaymentMethod;
  total: number;
};

export type PurchaseProductRequest = {
  id?: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type CreatePurchaseRequest = {
  total: number;
  purchaseDate: string;
  estimatedDeliveryDate?: string | null;
  supplierId?: number | null;
  nfNumber?: string;
  nfSerie?: string;
  usedNfXmlDocument?: boolean;
  internalNotes?: string;
  payments: PurchasePaymentRequest[];
  products: PurchaseProductRequest[];
};

export type UpdatePurchaseRequest = CreatePurchaseRequest & {
  id: number;
};

export async function fetchPurchases(
  filters: PurchaseFilters
): Promise<PaginatedData<Purchase>> {
  return fetchPaginated<Purchase>("/purchases", filters);
}

export async function getPurchaseById(id: number): Promise<Purchase> {
  const { data } = await api.get<Purchase>(`/purchases/${id}`);
  return data;
}

export async function createPurchase(
  data: CreatePurchaseRequest
): Promise<Purchase> {
  const { data: response } = await api.post<Purchase>("/purchases", data);
  return response;
}

export async function updatePurchase(
  data: UpdatePurchaseRequest
): Promise<Purchase> {
  const { data: response } = await api.put<Purchase>(
    `/purchases/${data.id}`,
    data
  );
  return response;
}

export async function deletePurchase(id: number): Promise<void> {
  await api.delete(`/purchases/${id}`);
}

export async function restorePurchase(id: number): Promise<Purchase> {
  const { data } = await api.post<Purchase>(`/purchases/${id}/restore`);
  return data;
}
