import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import type { Filters, PaginatedData } from "@/components/ui/data-table/@types";

export type Policy = {
  id: number;
  name: string;
  description?: string;
  resource: string;
  module: string;
  action: string;
};

export type Role = {
  id: number;
  name: string;
  description?: string;
  policies: Policy[];
  isActive: boolean;
};

type RoleQuery = {
  name: string;
  activeOnly: string;
};

export type RoleFilters = Filters<RoleQuery>;

export type CreateRoleBody = {
  name: string;
  description?: string;
  policyIds?: number[];
};

export type UpdateRoleBody = {
  id: number;
  name?: string;
  description?: string;
};

export async function fetchRoles(
  filters: RoleFilters
): Promise<PaginatedData<Role>> {
  return fetchPaginated<Role>("/roles", filters);
}

export async function fetchRoleById(id: number): Promise<Role> {
  const { data } = await api.get<Role>(`/roles/${id}`);
  return data;
}

export async function createRole(
  body: CreateRoleBody
): Promise<Role> {
  const { data } = await api.post<Role>("/roles", body);
  return data;
}

export async function updateRole(
  body: UpdateRoleBody
): Promise<Role> {
  const { id, ...rest } = body;
  const { data } = await api.put<Role>(`/roles/${id}`, rest);
  return data;
}

export async function deleteRole(id: number): Promise<void> {
  await api.delete(`/roles/${id}`);
}

export async function restoreRole(id: number): Promise<Role> {
  const { data } = await api.patch<Role>(`/roles/${id}/restore`);
  return data;
}

export async function fetchPolicies(): Promise<Policy[]> {
  const { data } = await api.get<Policy[]>("/policies");
  return data;
}

export async function assignPolicies(
  roleId: number,
  policyIds: number[]
): Promise<Role> {
  const { data } = await api.put<Role>(`/roles/${roleId}/policies`, {
    policyIds,
  });
  return data;
}
