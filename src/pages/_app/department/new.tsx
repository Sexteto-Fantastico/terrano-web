import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateView } from "@/components/views/create-view";
import {
  DepartmentForm,
  type DepartmentFormValues,
} from "./-components/department-form";
import { createDepartment, type CreateDepartmentRequest } from "@/api/departments";

export const Route = createFileRoute("/_app/department/new")({
  component: DepartmentNewPage,
  head: () => ({
    meta: [
      {
        title: "Novo departamento",
      },
    ],
  }),
});

function DepartmentNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: CreateDepartmentRequest) => {
      const response = await createDepartment(data);
      toast.success("Departamento criado com sucesso");
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      navigate({ to: "/department" });
    },
    onError: () => {
      toast.error("Erro ao processar operação!");
    },
  });

  async function handleSubmit(values: DepartmentFormValues) {
    await createMutation.mutateAsync({
      name: values.name,
      managerId: values.managerId ?? null,
    });
  }

  return (
    <CreateView formId="department-form">
      <DepartmentForm onSubmit={handleSubmit} />
    </CreateView>
  );
}
