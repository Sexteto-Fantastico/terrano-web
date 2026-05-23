import api from "@/lib/axios";

export type ProductCategory = {
  id: number;
  name: string;
};

export async function fetchProductCategories(): Promise<ProductCategory[]> {
  const { data } = await api.get<ProductCategory[]>("/product-categories");
  return data;
}
