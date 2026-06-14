import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";
import type { Role } from "@/api/users";
import type { Department } from "@/api/departments";

export function getUserFilterConfig(
  roles: Role[] = [],
  departments: Department[] = [],
): DataTableFilterConfigItem[] {
  return [
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
      id: "departmentId",
      label: "Departamento",
      variant: "select",
      placeholder: "Selecione um departamento",
      options: departments.map((dept) => ({
        label: dept.name,
        value: String(dept.id),
      })),
    },
    {
      id: "roleId",
      label: "Perfil",
      variant: "select",
      placeholder: "Selecione um perfil",
      options: roles.map((role) => ({
        label: role.name,
        value: String(role.id),
      })),
    },
  ];
}
