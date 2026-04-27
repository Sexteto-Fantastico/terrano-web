import {
  type Filters,
  type PaginatedData,
} from "@/components/ui/data-table/data-table";

import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from "@/components/ui/data-table/data-table-pagination";
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  age: number;
};

const MOCK_USERS: User[] = [
  { id: 1, name: "Ana Silva", email: "ana@email.com", role: "Admin", age: 28 },
  {
    id: 2,
    name: "Bruno Costa",
    email: "bruno@email.com",
    role: "User",
    age: 34,
  },
  {
    id: 3,
    name: "Carla Souza",
    email: "carla@email.com",
    role: "Manager",
    age: 41,
  },
  {
    id: 4,
    name: "Daniel Lima",
    email: "daniel@email.com",
    role: "User",
    age: 22,
  },
  {
    id: 5,
    name: "Elena Rocha",
    email: "elena@email.com",
    role: "Admin",
    age: 35,
  },
  {
    id: 6,
    name: "Fernando Alves",
    email: "fernando@email.com",
    role: "User",
    age: 29,
  },
  {
    id: 7,
    name: "Gabriela Dias",
    email: "gabriela@email.com",
    role: "Manager",
    age: 38,
  },
  {
    id: 8,
    name: "Hugo Ferreira",
    email: "hugo@email.com",
    role: "User",
    age: 26,
  },
  {
    id: 9,
    name: "Isabela Martins",
    email: "isabela@email.com",
    role: "Admin",
    age: 32,
  },
  {
    id: 10,
    name: "João Pereira",
    email: "joao@email.com",
    role: "User",
    age: 45,
  },
  {
    id: 11,
    name: "João Pereira",
    email: "joao@email.com",
    role: "User",
    age: 45,
  },
];

export async function fetchUsers(
  filters: Filters<User>
): Promise<PaginatedData<User>> {
  await new Promise((resolve) => setTimeout(resolve, 500));

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

  return { result: result.slice(start, end), rowCount: result.length };
}
