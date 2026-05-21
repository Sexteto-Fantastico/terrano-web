import api from "@/lib/axios";
import type { Filters, PaginatedData } from "@/components/ui/data-table/@types";

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

export async function fetchUsers(
  filters: Record<string, unknown>
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
