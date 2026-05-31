import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import type { Filters, PaginatedData } from "@/components/ui/data-table/@types";

export type DepartmentManager = {
  id: number;
  name: string;
};

export type Department = {
  id: number;
  name: string;
  manager?: DepartmentManager | null;
  isActive?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type CreateDepartmentRequest = {
  name: string;
  managerId?: number | null;
};

export type UpdateDepartmentRequest = {
  id: number;
  name?: string;
  manager?: DepartmentManager | null;
  isActive?: boolean;
};

type DepartmentQuery = {
  name?: string;
  activeOnly?: string;
};

export type DepartmentFilters = Filters<DepartmentQuery>;

function withIsActive(department: Department): Department {
  return {
    ...department,
    isActive: !department.deletedAt,
  };
}

export async function fetchAllDepartments(): Promise<Department[]> {
  const { data } = await api.get<Department[]>("/departments");
  return data.map(withIsActive);
}

export async function fetchDepartments(
  filters: DepartmentFilters
): Promise<PaginatedData<Department>> {
  const response = await fetchPaginated<Department, DepartmentQuery>(
    "/departments",
    filters
  );

  return {
    ...response,
    result: response.result.map(withIsActive),
  };
}

export async function fetchDepartmentById(id: number): Promise<Department> {
  const { data } = await api.get<Department>(`/departments/${id}`);
  return withIsActive(data);
}

export async function createDepartment(
  data: CreateDepartmentRequest
): Promise<Department> {
  const { data: response } = await api.post<Department>("/departments", data);
  return response;
}

export async function updateDepartment(
  data: UpdateDepartmentRequest
): Promise<Department> {
  const { data: response } = await api.put<Department>(
    `/departments/${data.id}`,
    data
  );
  return response;
}

export async function deleteDepartment(id: number): Promise<void> {
  await api.delete(`/departments/${id}`);
}

export async function restoreDepartment(id: number): Promise<Department> {
  const { data } = await api.patch<Department>(`/departments/${id}/restore`);
  return data;
}
