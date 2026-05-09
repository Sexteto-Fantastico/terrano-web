import {
  type PaginatedData,
} from "@/components/ui/data-table/@types";

import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from "@/components/ui/data-table/data-table-pagination";

export type ProductCategory = {
  id: number;
  name: string;
};

export type ProductBrand = {
  id: number;
  name: string;
};

export type MeasurementUnit = {
  id: number;
  name: string;
  symbol: string;
  type: string;
};

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

export type CreateProductRequestDTO = {
  name: string;
  code: string;
  description?: string;
  categoryId: number;
  measurementUnitId: number;
  brandId: number;
  minStock?: number;
  maxStock?: number;
};

export type ProductUpdateRequestDTO = {
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
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
};

export async function fetchProducts(
  filters: ProductFilters
): Promise<PaginatedData<Product>> {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.code) params.set("code", filters.code);
  if (filters.brandId) params.set("brandId", filters.brandId);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);

  const activeOnly = filters.activeOnly === "false" ? "false" : "true";
  params.set("activeOnly", activeOnly);

  const pageIndex = filters.pageIndex ?? DEFAULT_PAGE_INDEX;
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;

  const url = `http://localhost:3000/api/products?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const allProducts: Product[] = await response.json();

  const start = pageIndex * pageSize;
  const end = start + pageSize;

  const paginatedProducts = allProducts.slice(start, end);

  return {
    result: paginatedProducts,
    rowCount: allProducts.length,
  };
}

export async function createProduct(
  data: CreateProductRequestDTO
): Promise<Product> {
  const response = await fetch("http://localhost:3000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  return response.json();
}

export async function updateProduct(
  data: ProductUpdateRequestDTO
): Promise<Product> {
  const response = await fetch(
    `http://localhost:3000/api/products/${data.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return response.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`http://localhost:3000/api/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
}

export async function restoreProduct(id: number): Promise<Product> {
  const response = await fetch(
    `http://localhost:3000/api/products/${id}/restore`,
    { method: "POST" }
  );

  if (!response.ok) {
    throw new Error("Failed to restore product");
  }

  return response.json();
}

export async function fetchProductCategories(): Promise<ProductCategory[]> {
  const response = await fetch("http://localhost:3000/api/product-categories");
  if (!response.ok) {
    throw new Error("Failed to fetch product categories");
  }
  return response.json();
}

export async function fetchProductBrands(): Promise<ProductBrand[]> {
  const response = await fetch("http://localhost:3000/api/product-brands");
  if (!response.ok) {
    throw new Error("Failed to fetch product brands");
  }
  return response.json();
}

export async function fetchMeasurementUnits(): Promise<MeasurementUnit[]> {
  const response = await fetch("http://localhost:3000/api/measurement-units");
  if (!response.ok) {
    throw new Error("Failed to fetch measurement units");
  }
  return response.json();
}
