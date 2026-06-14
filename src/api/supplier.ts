import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import type {
  Filters,
  PaginatedData,
} from "@/components/ui/data-table/@types";

export type Supplier = {
  id: number;
  corporateName: string;
  tradeName: string;
  cnpj: string;
  email: string;
  phone: string;
  address?: unknown;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type CreateSupplierDTO = {
  corporateName: string;
  tradeName: string;
  cnpj: string;
  email: string;
  phone: string;
};

export type UpdateSupplierDTO = {
  id: number;
  corporateName?: string;
  tradeName?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
};

export type SupplierFilters = Filters<{
  corporateName?: string;
  tradeName?: string;
  cnpj?: string;
  activeOnly?: "true" | "false";
  pageIndex?: number;
  pageSize?: number;
}>;

export async function fetchSuppliers(
  filters: SupplierFilters
): Promise<PaginatedData<Supplier>> {
  return fetchPaginated<Supplier>("/suppliers", filters);
}

export async function fetchAllSuppliers(): Promise<Supplier[]> {
  const { data } = await api.get<Supplier[]>("/suppliers");
  return data;
}

export async function fetchSupplierById(
  id: number
): Promise<Supplier> {
  const { data } = await api.get<Supplier>(
    `/suppliers/${id}`
  );

  return data;
}

export async function createSupplier(
  dto: CreateSupplierDTO
): Promise<Supplier> {
  const { data } = await api.post<Supplier>(
    "/suppliers",
    dto
  );

  return data;
}

export async function updateSupplier(
  dto: UpdateSupplierDTO
): Promise<Supplier> {
  const { id, ...payload } = dto;

  const { data } = await api.put<Supplier>(
    `/suppliers/${id}`,
    payload
  );

  return data;
}

export async function deleteSupplier(
  id: number
): Promise<void> {
  await api.delete(`/suppliers/${id}`);
}

export async function restoreSupplier(
  id: number
): Promise<Supplier> {
  const { data } = await api.post<Supplier>(
    `/suppliers/${id}/restore`
  );

  return data;
}