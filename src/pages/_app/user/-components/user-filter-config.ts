import { useQuery } from "@tanstack/react-query";
import { fetchAllDepartments } from "@/api/departments";
import { useMemo } from "react";
import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";

export function useUserFilterConfig(): DataTableFilterConfigItem[] {
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchAllDepartments,
  });

  const departmentOptions = useMemo(
    () => departments.map((d) => ({ label: d.name, value: String(d.id) })),
    [departments]
  );

  return useMemo(
    () => [
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
        options: departmentOptions,
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
      {
        id: "activeOnly",
        label: "Ativo",
        variant: "checkbox",
        defaultValue: "true",
      },
    ],
    [departmentOptions]
  );
}
