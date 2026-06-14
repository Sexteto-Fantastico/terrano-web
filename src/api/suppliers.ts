import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import type { Filters, PaginatedData } from "@/components/ui/data-table/@types";

export type SupplierAddress = {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  complement?: string;
};

export type Supplier = {
  id: number;
  corporateName: string;
  tradeName: string;
  cnpj: string;
  email: string;
  phone: string;
  address?: SupplierAddress | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type CreateSupplierRequestDTO = {
  corporateName: string;
  tradeName: string;
  cnpj: string;
  email: string;
  phone: string;
  address?: SupplierAddress;
};

export type UpdateSupplierRequestDTO = {
  id: number;
  corporateName?: string;
  tradeName?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  address?: Partial<SupplierAddress>;
};

type SupplierQuery = {
  corporateName?: string;
  tradeName?: string;
  cnpj?: string;
  activeOnly?: string;
};

export type SupplierFilters = Filters<SupplierQuery>;

type SupplierApiResponse = Omit<Supplier, "isActive"> & {
  isActive?: boolean;
};

function withIsActive(supplier: SupplierApiResponse): Supplier {
  return {
    ...supplier,
    isActive: supplier.isActive ?? supplier.deletedAt == null,
  };
}

export async function fetchSuppliers(
  filters: SupplierFilters
): Promise<PaginatedData<Supplier>> {
  const response = await fetchPaginated<SupplierApiResponse>(
    "/suppliers",
    filters
  );

  return {
    ...response,
    result: response.result.map(withIsActive),
  };
}

export async function fetchAllSuppliers(): Promise<Supplier[]> {
  const response = await fetchPaginated<SupplierApiResponse>("/suppliers", {
    pageIndex: 0,
    pageSize: 50,
  });

  return response.result.map(withIsActive);
}

export async function fetchSupplierById(id: number): Promise<Supplier> {
  const { data } = await api.get<SupplierApiResponse>(`/suppliers/${id}`);
  return withIsActive(data);
}

export async function createSupplier(
  data: CreateSupplierRequestDTO
): Promise<Supplier> {
  const { data: response } = await api.post<SupplierApiResponse>(
    "/suppliers",
    data
  );
  return withIsActive(response);
}

export async function updateSupplier(
  data: UpdateSupplierRequestDTO
): Promise<Supplier> {
  const { id, ...body } = data;
  const { data: response } = await api.put<SupplierApiResponse>(
    `/suppliers/${id}`,
    body
  );
  return withIsActive(response);
}

export async function deleteSupplier(id: number): Promise<void> {
  await api.delete(`/suppliers/${id}`);
}

export async function restoreSupplier(id: number): Promise<Supplier> {
  const { data } = await api.patch<SupplierApiResponse>(
    `/suppliers/${id}/restore`
  );
  return withIsActive(data);
}