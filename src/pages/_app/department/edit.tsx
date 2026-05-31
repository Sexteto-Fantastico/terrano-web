import { useSearch, useNavigate, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { CreateView } from "@/components/views/create-view";
import { DepartmentForm } from "./-components/department-form";
import { fetchDepartmentById, updateDepartment } from "@/api/departments";

export const Route = createFileRoute("/_app/department/edit")({
  component: DepartmentEditPage,
  validateSearch: z.object({ id: z.string().min(1) }),
  head: () => ({
    meta: [
      {
        title: "Editar departamento",
      },
    ],
  }),
});

function DepartmentEditPage() {
  const search = useSearch({ from: "/_app/department/edit" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const departmentQuery = useQuery({
    queryKey: ["department", search.id],
    queryFn: () => fetchDepartmentById(Number(search.id)),
    enabled: Boolean(search.id),
  });

  const updateMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      navigate({ to: "/department" });
    },
  });

  if (!search.id) {
    return <div>Departamento inválido</div>;
  }

  if (departmentQuery.isLoading) {
    return <div>Carregando...</div>;
  }

  if (!departmentQuery.data) {
    return <div>Departamento não encontrado</div>;
  }
  return (
    <CreateView formId="department-form">
      <DepartmentForm
        initialName={departmentQuery.data.name}
        initialManager={departmentQuery.data.manager ?? null}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync({
            id: departmentQuery.data.id,
            name: values.name,
            manager: { id: values.managerId, name: values.managerName},
          });
        }}
      />
    </CreateView>
  );
}
