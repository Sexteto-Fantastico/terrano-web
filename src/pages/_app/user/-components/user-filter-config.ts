import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";
import type { Role } from "@/api/users";

export function getUserFilterConfig(roles: Role[] = []): DataTableFilterConfigItem[] {
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
