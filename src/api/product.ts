import { type Filters, type PaginatedData } from "@/types/data-table";

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

export type Product = {
  id: number;
  name: string;
  code: string;
  description?: string;
  category: {
    id: number;
    name: string;
  };
  min_stock?: number;
  brand?: {
    id: number;
    name: string;
  };
  unitOfMeasure?: string;
  maxStock?: number;
  internalNotes?: string;
  deleted_at?: string | null;
};

export type CreateProductRequestDTO = {
  name: string;
  code: string;
  description?: string;
  categoryId: number;
  brandId?: number;
  min_stock?: number;
};

export type ProductUpdateRequestDTO = {
  id: number;
  name?: string;
  code?: string;
  description?: string;
  categoryId?: number;
  brandId?: number;
  min_stock?: number;
  deleted_at?: string | null;
};

export async function fetchProducts(
  filters: Filters<Product>
): Promise<PaginatedData<Product>> {
  const response = await fetch("http://localhost:3000/api/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const allProducts: Product[] = await response.json();

  const pageIndex = filters.pageIndex ?? DEFAULT_PAGE_INDEX;
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;

  const start = pageIndex * pageSize;
  const end = start + pageSize;

  const paginatedProducts = allProducts.slice(start, end);

  return {
    result: paginatedProducts,
    rowCount: allProducts.length,
  };
}

export async function createProduct(data: CreateProductRequestDTO): Promise<Product> {
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

export async function updateProduct(data: ProductUpdateRequestDTO): Promise<Product> {
  const response = await fetch(`http://localhost:3000/api/products/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

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
