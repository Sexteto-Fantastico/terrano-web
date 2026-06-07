import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import {
  type Filters,
  type PaginatedData,
} from "@/components/ui/data-table/@types";
import type { MeasurementUnit } from "./measurement-units";
import type { ProductBrand } from "./product-brands";
import type { ProductCategory } from "./product-categories";

export type Product = {
  id: number;
  name: string;
  code: string;
  description?: string;
  category: ProductCategory;
  measurementUnit: MeasurementUnit;
  brand: ProductBrand;
  minStock?: number;
  maxStock?: number;
  deletedAt?: string | null;
};

export type CreateProductRequest = {
  name?: string;
  code?: string;
  description?: string;
  categoryId?: number;
  measurementUnitId?: number;
  brandId?: number;
  minStock?: number;
  maxStock?: number;
};

export type ProductUpdateRequest = {
  id: number;
  name?: string;
  code?: string;
  description?: string;
  categoryId?: number;
  measurementUnitId?: number;
  brandId?: number;
  minStock?: number;
  maxStock?: number;
  deletedAt?: string | null;
};

export type ProductFilters = {
  name?: string;
  code?: string;
  brandId?: string;
  categoryId?: string;
  activeOnly?: string;
} & Filters<Product>;

export async function fetchProducts(
  filters: ProductFilters
): Promise<PaginatedData<Product>> {
  return fetchPaginated<Product>("/products", filters);
}

export async function fetchProductById(id: number): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export async function createProduct(
  data: CreateProductRequest
): Promise<Product> {
  const { data: response } = await api.post<Product>("/products", data);
  return response;
}

export async function updateProduct(
  data: ProductUpdateRequest
): Promise<Product> {
  const { data: response } = await api.put<Product>(
    `/products/${data.id}`,
    data
  );
  return response;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}

export async function restoreProduct(id: number): Promise<Product> {
  const { data: response } = await api.post<Product>(`/products/${id}/restore`);
  return response;
}
