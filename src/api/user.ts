import {
  type Filters,
  type PaginatedData,
} from "@/components/ui/data-table/@types";

import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from "@/components/ui/data-table/data-table-pagination";

import { createMockList, oneOf, withNetworkDelay } from "@/utils/mock-factory";

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

const ROLES = ["Admin", "User", "Manager"];

const MOCK_USERS: User[] = createMockList(
  (id) => ({
    id,
    name: `Usuário ${id}`,
    email: `usuario${id}@terrano.com.br`,
    username: `user${id}`,
    role: { id, name: oneOf(ROLES) },
    isActive: true,
  }),
  50
);

export async function fetchUsers(
  filters: Record<string, unknown>
): Promise<PaginatedData<User>> {
  const {
    pageIndex = DEFAULT_PAGE_INDEX,
    pageSize = DEFAULT_PAGE_SIZE,
    sortBy,
  } = filters as Filters<User>;

  const name = filters.name as string | undefined;
  const cpf = filters.cpf as string | undefined;
  const department = filters.department as string | undefined;
  const role = filters.role as string | undefined;

  let result = [...MOCK_USERS];

  if (name) {
    const term = name.toLowerCase();
    result = result.filter((user) => user.name.toLowerCase().includes(term));
  }

  if (cpf) {
    const term = cpf.toLowerCase();
    result = result.filter((user) => user.cpf?.toLowerCase().includes(term));
  }

  if (department) {
    result = result.filter((user) => user.department?.name === department);
  }

  if (role) {
    result = result.filter((user) => user.role?.name === role);
  }

  if (sortBy) {
    const [rawField, rawDirection] = sortBy.split(".");
    const field = rawField as keyof User;
    const direction = rawDirection === "desc" ? -1 : 1;

    result = [...result].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      if (field === "role") {
        aValue = a.role?.name as unknown as User[keyof User];
        bValue = b.role?.name as unknown as User[keyof User];
      }

      if (field === "department") {
        aValue = a.department?.name as unknown as User[keyof User];
        bValue = b.department?.name as unknown as User[keyof User];
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * direction;
      }

      return (
        String(aValue ?? "").localeCompare(String(bValue ?? "")) * direction
      );
    });
  }

  const start = pageIndex * pageSize;
  const end = start + pageSize;

  return withNetworkDelay({
    result: result.slice(start, end),
    rowCount: result.length,
  });
}
