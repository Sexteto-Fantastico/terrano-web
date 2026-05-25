import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import type { Filters, PaginatedData } from "@/components/ui/data-table/@types";

export type ProductBrand = {
  id: number;
  name: string;
  isActive?: boolean;
  deletedAt?: string | null;
};

export type CreateProductBrandRequestDTO = {
  name: string;
};

export type UpdateProductBrandRequestDTO = {
  id: number;
  name?: string;
  isActive?: boolean;
};

type ProductBrandQuery = {
  name?: string;
  activeOnly?: string;
};

export type ProductBrandFilters = Filters<ProductBrandQuery>;

export async function fetchAllProductBrands(): Promise<ProductBrand[]> {
  const { data } = await api.get<ProductBrand[]>("/product-brands");
  return data;
}

export async function fetchProductBrands(
  filters: ProductBrandFilters
): Promise<PaginatedData<ProductBrand>> {
  return fetchPaginated<ProductBrand>("/product-brands", filters);
}

export async function fetchProductBrandById(id: number): Promise<ProductBrand> {
  const { data } = await api.get<ProductBrand>(`/product-brands/${id}`);
  return data;
}

export async function createProductBrand(
  data: CreateProductBrandRequestDTO
): Promise<ProductBrand> {
  const { data: response } = await api.post<ProductBrand>(
    "/product-brands",
    data
  );
  return response;
}

export async function updateProductBrand(
  data: UpdateProductBrandRequestDTO
): Promise<ProductBrand> {
  const { data: response } = await api.put<ProductBrand>(
    `/product-brands/${data.id}`,
    data
  );
  return response;
}

export async function deleteProductBrand(id: number): Promise<void> {
  await api.delete(`/product-brands/${id}`);
}

export async function restoreProductBrand(id: number): Promise<ProductBrand> {
  const { data } = await api.post<ProductBrand>(
    `/product-brands/${id}/restore`
  );
  return data;
}
