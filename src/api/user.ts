import type { ColumnFiltersState } from "@tanstack/react-table";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  age: number;
};

type FetchUsersParams = {
  search?: string;
  filters?: ColumnFiltersState;
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
];

export async function fetchUsers({ search, filters }: FetchUsersParams = {}) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  let result = [...MOCK_USERS];
  
  if (search) {
    result = result.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (filters && filters.length > 0) {
    for (const filter of filters) {
      const value = filter.value;
      
      switch (filter.id) {
        case "id":
          if (typeof value === "string") {
            result = result.filter((user) => user.id.toString().includes(value));
          }
          break;
        case "name":
          if (typeof value === "string") {
            result = result.filter((user) =>
              user.name.toLowerCase().includes(value.toLowerCase())
            );
          }
          break;
        case "email":
          if (typeof value === "string") {
            result = result.filter((user) =>
              user.email.toLowerCase().includes(value.toLowerCase())
            );
          }
          break;
        case "role":
          if (typeof value === "string") {
            result = result.filter((user) =>
              user.role.toLowerCase().includes(value.toLowerCase())
            );
          }
          break;
        case "age":
          if (typeof value === "string") {
            const ageNum = parseInt(value, 10);
            if (!Number.isNaN(ageNum)) {
              result = result.filter((user) => user.age === ageNum);
            }
          }
          break;
      }
    }
  }
  
  return result;
}
