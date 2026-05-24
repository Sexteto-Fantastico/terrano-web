import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import type { Filters, PaginatedData } from "@/components/ui/data-table/@types";

export type Role = {
  id: number;
  name: string;
};

export type Department = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  name: string;
  phone?: string;
  cpf?: string;
  email: string;
  username: string;
  role?: Role;
  department?: Department;
  managedDepartments?: Department[];
  isActive: boolean;
  requiresPasswordReset?: boolean;
};

type UserQuery = {
  name: string;
  onlyActive: string;
};

export type UserFilters = Filters<UserQuery>;

export async function fetchUsers(
  filters: UserFilters
): Promise<PaginatedData<User>> {
  return fetchPaginated<User>("/users", filters);
}

export async function getUserById(id: number): Promise<User> {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export type CreateUserRequestDTO = {
  name: string;
  email: string;
  username: string;
  phone?: string;
  cpf?: string;
  isActive?: boolean;
};

export type UpdateUserRequestDTO = {
  id: number;
  name?: string;
  phone?: string;
  cpf?: string;
  email?: string;
  username?: string;
  isActive?: boolean;
};

export async function createUser(user: CreateUserRequestDTO): Promise<User> {
  const { data } = await api.post("/users", user);
  return data;
}

export async function updateUser(data: UpdateUserRequestDTO): Promise<User> {
  const { data: response } = await api.put<User>(`/users/${data.id}`, data);
  return response;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}

export async function restoreUser(id: number): Promise<User> {
  const { data } = await api.post<User>(`/users/${id}/restore`);
  return data;
}
