import {
  type PaginatedData,
} from "@/components/ui/data-table/@types";

import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from "@/components/ui/data-table/data-table-pagination";

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
};

export type ProductBrandFilters = {
  name?: string;
  activeOnly?: string;
  pageIndex?: number;
  pageSize?: number;
};

export async function fetchProductBrands(
  filters: ProductBrandFilters
): Promise<PaginatedData<ProductBrand>> {
  const params = new URLSearchParams();

  if (filters.name?.trim()) {
    params.set("name", filters.name.trim());
  }

  if (filters.activeOnly !== undefined) {
    params.set("activeOnly", filters.activeOnly);
  }

  const pageIndex = filters.pageIndex ?? DEFAULT_PAGE_INDEX;
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  params.set("pageIndex", String(pageIndex));
  params.set("pageLimit", String(pageSize));

  const url = `http://localhost:3000/api/product-brands?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch product brands");
  }

  const brands: ProductBrand[] = await response.json();
  const total = Number(response.headers.get("x-total-count") ?? brands.length);

  return {
    result: brands,
    rowCount: total,
  };
}

export async function fetchProductBrandById(id: number): Promise<ProductBrand> {
  const response = await fetch(`http://localhost:3000/api/product-brands/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product brand");
  }

  return response.json();
}

export async function createProductBrand(
  data: CreateProductBrandRequestDTO
): Promise<ProductBrand> {
  const response = await fetch("http://localhost:3000/api/product-brands", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create product brand");
  }

  return response.json();
}

export async function updateProductBrand(
  data: UpdateProductBrandRequestDTO
): Promise<ProductBrand> {
  const response = await fetch(
    `http://localhost:3000/api/product-brands/${data.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update product brand");
  }

  return response.json();
}

export async function deleteProductBrand(id: number): Promise<void> {
  const response = await fetch(`http://localhost:3000/api/product-brands/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product brand");
  }
}

export async function restoreProductBrand(id: number): Promise<ProductBrand> {
  const response = await fetch(
    `http://localhost:3000/api/product-brands/${id}/restore`,
    { method: "PATCH" }
  );

  if (!response.ok) {
    throw new Error("Failed to restore product brand");
  }

  return response.json();
}
