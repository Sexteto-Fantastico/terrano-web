import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import type { Filters, PaginatedData } from "@/components/ui/data-table/@types";

export type ProductBrand = {
  id: number;
  name: string;
  isActive?: boolean;
  deletedAt?: string | null;
};

export type CreateProductBrandRequest = {
  name: string;
};

export type UpdateProductBrandRequest = {
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
  return fetchPaginated<ProductBrand, ProductBrandQuery>("/product-brands", filters);
}

export async function fetchProductBrandById(id: number): Promise<ProductBrand> {
  const { data } = await api.get<ProductBrand>(`/product-brands/${id}`);
  return data;
}

export async function createProductBrand(
  data: CreateProductBrandRequest
): Promise<ProductBrand> {
  const { data: response } = await api.post<ProductBrand>(
    "/product-brands",
    data
  );
  return response;
}

export async function updateProductBrand(
  data: UpdateProductBrandRequest
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
  const { data } = await api.patch<ProductBrand>(
    `/product-brands/${id}/restore`
  );
  return data;
}
