import type { Filters } from "@/components/data-table";

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
];

export async function fetchUsers(filtersAndPagination: Filters<User>) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_USERS;
}
