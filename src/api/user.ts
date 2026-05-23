import api from "@/lib/axios";
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

export type UserFilters = Partial<
  {
    name?: string;
    onlyActive?: string;
  } & Filters<User>
>;

export async function fetchUsers(
  filters: UserFilters
): Promise<PaginatedData<User>> {
  const { data } = await api.get("/users", { params: filters });
  return data;
}

export async function getUserById(id: number): Promise<User> {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
  const { data } = await api.post("/users", user);
  return data;
}
