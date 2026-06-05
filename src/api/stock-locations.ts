import api from "@/lib/axios";

export type StockLocationAddress = {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  complement?: string;
};

export type StockLocation = {
  id: number;
  name: string;
  description?: string;
  address?: StockLocationAddress;
  isActive: boolean;
  deletedAt?: string | null;
};

type StockLocationApiResponse = Omit<StockLocation, "isActive">;

function withIsActive(location: StockLocationApiResponse): StockLocation {
  return { ...location, isActive: location.deletedAt == null };
}

export async function fetchAllStockLocations(): Promise<StockLocation[]> {
  const { data } = await api.get<StockLocationApiResponse[]>("/stock-locations");
  return data.map(withIsActive);
}
