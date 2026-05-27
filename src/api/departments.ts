import api from "@/lib/axios";

export type Department = {
  id: number;
  name: string;
};

export async function getAllDepartments(): Promise<Department[]> {
  const { data } = await api.get<Department[]>("/departments");
  return data;
}
