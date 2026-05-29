import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import type { Filters, PaginatedData } from "@/components/ui/data-table/@types";

export type ProductCategoryParent = {
  id: number;
  name: string;
  description?: string;
  deletedAt?: string | null;
};

export type ProductCategory = {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
  deletedAt?: string | null;
  parent?: ProductCategoryParent | null;
};

export type CreateProductCategoryRequest = {
  name: string;
  description?: string;
  parentId?: number;
};

export type UpdateProductCategoryRequest = {
  id: number;
  name?: string;
  description?: string;
  parentId?: number | null;
  isActive?: boolean;
};

type ProductCategoryQuery = {
  name?: string;
  activeOnly?: string;
};

export type ProductCategoryFilters = Filters<ProductCategoryQuery>;

export async function fetchAllProductCategories(): Promise<ProductCategory[]> {
  const { data } = await api.get<ProductCategory[]>("/product-categories");

  return data.map((category) => ({
    ...category,
    isActive: !category.deletedAt,
  }));
}

export async function fetchProductCategories(
  filters: ProductCategoryFilters
): Promise<PaginatedData<ProductCategory>> {
  const response = await fetchPaginated<ProductCategory, ProductCategoryQuery>(
    "/product-categories",
    filters
  );

  return {
    ...response,
    result: response.result.map((category) => ({
      ...category,
      isActive: !category.deletedAt,
    })),
  };
}

export async function fetchProductCategoryById(
  id: number
): Promise<ProductCategory> {
  const { data } = await api.get<ProductCategory>(`/product-categories/${id}`);

  return {
    ...data,
    isActive: !data.deletedAt,
  };
}

export async function createProductCategory(
  data: CreateProductCategoryRequest
): Promise<ProductCategory> {
  const { data: response } = await api.post<ProductCategory>(
    "/product-categories",
    data
  );
  return response;
}

export async function updateProductCategory(
  data: UpdateProductCategoryRequest
): Promise<ProductCategory> {
  const { data: response } = await api.put<ProductCategory>(
    `/product-categories/${data.id}`,
    data
  );
  return response;
}

export async function deleteProductCategory(id: number): Promise<void> {
  await api.delete(`/product-categories/${id}`);
}

export async function restoreProductCategory(
  id: number
): Promise<ProductCategory> {
  const { data } = await api.patch<ProductCategory>(
    `/product-categories/${id}/restore`
  );
  return data;
}
