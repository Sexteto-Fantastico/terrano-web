import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";

export const userFilterConfig: DataTableFilterConfigItem[] = [
  {
    id: "name",
    label: "Nome",
    variant: "text",
    placeholder: "Filtrar por nome",
  },
  {
    id: "cpf",
    label: "CPF",
    variant: "text",
    placeholder: "Filtrar por CPF",
  },
  {
    id: "department",
    label: "Departamento",
    variant: "select",
    placeholder: "Selecione um departamento",
    options: [
      { label: "TI", value: "TI" },
      { label: "RH", value: "RH" },
      { label: "Financeiro", value: "Financeiro" },
    ],
  },
  {
    id: "role",
    label: "Perfil",
    variant: "select",
    placeholder: "Selecione um perfil",
    options: [
      { label: "Admin", value: "Admin" },
      { label: "User", value: "User" },
      { label: "Manager", value: "Manager" },
    ],
  },
];
