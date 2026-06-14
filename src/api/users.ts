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
  profilePicture?: string;
};

type UserQuery = {
  name: string;
  onlyActive: string;
  roleId: string;
  departmentId: string;
};

export type CreateUserRequestDTO = {
  name: string;
  email: string;
  username: string;
  roleId: number;
  departmentId: number;
  password: string;
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
  roleId?: number;
  departmentId?: number;
  isActive?: boolean;
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

export async function fetchAllUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>("/users");
  return data;
}

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

export async function getMyPermissions(): Promise<
  Record<string, Array<Record<string, string[]>>>
> {
  const { data } = await api.get("/users/me/permissions");
  return data;
}

export async function uploadAvatar(userId: number, file: File): Promise<User> {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.patch<User>(`/users/${userId}/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}
