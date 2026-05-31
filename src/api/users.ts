import api from "@/lib/axios";
import { fetchPaginated } from "@/utils/pagination";
import type { Filters } from "@/components/ui/data-table/@types";
import type { Department } from "./departments";

export type Role = {
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
  cpf?: string;
  departmentId?: string;
  role?: string;
  onlyActive: string;
};

export type UserFilters = Filters<UserQuery>;

export async function fetchAllUsers() {
  const { data } = await api.get<User[]>("/users");
  return data;
}

export async function fetchUsers(filters: UserFilters) {
  return fetchPaginated<User, UserQuery>("/users", filters);
}

export async function getUserById(id: number): Promise<User> {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export type CreateUserRequest = {
  name: string;
  email: string;
  username: string;
  phone?: string;
  cpf?: string;
  isActive?: boolean;
};

export type UpdateUserRequest = {
  id: number;
  name?: string;
  phone?: string;
  cpf?: string;
  email?: string;
  username?: string;
  isActive?: boolean;
};

export async function createUser(user: CreateUserRequest): Promise<User> {
  const { data } = await api.post("/users", user);
  return data;
}

export async function updateUser(data: UpdateUserRequest): Promise<User> {
  const { data: response } = await api.put<User>(`/users/${data.id}`, data);
  return response;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}

export async function restoreUser(id: number): Promise<User> {
  const { data } = await api.patch<User>(`/users/${id}/restore`);
  return data;
}
