import api from "@/lib/axios";

export type ProductBrand = {
  id: number;
  name: string;
};

export async function fetchProductBrands(): Promise<ProductBrand[]> {
  const { data } = await api.get<ProductBrand[]>("/product-brands");
  return data;
}
