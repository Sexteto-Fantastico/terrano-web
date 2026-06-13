import api from "@/lib/axios";

export interface HomeIndicator {
  total: number;
  percentage: number;
}

export interface HomeAlert {
  total: number;
  newCount: number;
}

export interface HomeResponse {
  purchases: HomeIndicator;
  entries: HomeIndicator;
  exits: HomeIndicator;
  alerts: HomeAlert;
}

export async function fetchHomeSummary(): Promise<HomeResponse> {
  const { data } = await api.get<HomeResponse>("/home/summary");
  return data;
}
