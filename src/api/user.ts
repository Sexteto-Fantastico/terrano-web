import {
  type Filters,
  type PaginatedData,
} from "@/components/ui/data-table/@types";

import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from "@/components/ui/data-table/data-table-pagination";
import {
  createMockList,
  oneOf,
  randomInt,
  withNetworkDelay,
} from "@/utils/mock-factory";
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  age: number;
};

const ROLES = ["Admin", "User", "Manager"];

const MOCK_USERS: User[] = createMockList(
  (id) => ({
    id,
    name: `Usuário ${id}`,
    email: `usuario${id}@terrano.com.br`,
    role: oneOf(ROLES),
    age: randomInt(18, 65),
  }),
  50
);

export async function fetchUsers(
  filters: Filters<User>
): Promise<PaginatedData<User>> {
  const {
    pageIndex = DEFAULT_PAGE_INDEX,
    pageSize = DEFAULT_PAGE_SIZE,
    sortBy,
    id,
    name,
    email,
    role,
    age,
  } = filters;

  let result = [...MOCK_USERS];

  if (id !== undefined && id !== null && String(id) !== "") {
    const idValue = String(id);
    result = result.filter((user) => user.id.toString().includes(idValue));
  }

  if (name) {
    const term = name.toLowerCase();
    result = result.filter((user) => user.name.toLowerCase().includes(term));
  }

  if (email) {
    const term = email.toLowerCase();
    result = result.filter((user) => user.email.toLowerCase().includes(term));
  }

  if (role) {
    const term = role.toLowerCase();
    result = result.filter((user) => user.role.toLowerCase() === term);
  }

  if (age !== undefined && age !== null && String(age) !== "") {
    const parsedAge = Number(age);
    if (!Number.isNaN(parsedAge)) {
      result = result.filter((user) => user.age === parsedAge);
    }
  }

  if (sortBy) {
    const [rawField, rawDirection] = sortBy.split(".");
    const field = rawField as keyof User;
    const direction = rawDirection === "desc" ? -1 : 1;

    result = [...result].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * direction;
      }

      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }

  const start = pageIndex * pageSize;
  const end = start + pageSize;

  return withNetworkDelay({
    result: result.slice(start, end),
    rowCount: result.length,
  });
}
