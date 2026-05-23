import api from "@/lib/axios";

export type MeasurementUnit = {
  id: number;
  name: string;
  symbol: string;
  type: string;
};

export async function fetchMeasurementUnits(): Promise<MeasurementUnit[]> {
  const { data } = await api.get<MeasurementUnit[]>("/measurement-units");
  return data;
}
