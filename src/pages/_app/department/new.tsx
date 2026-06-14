import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";
import {
  DepartmentForm,
  type DepartmentFormValues,
} from "./-components/department-form";
import { createDepartment } from "@/api/departments";

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
  const feedback = useFeedbackDialog();

  const createMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      feedback.success("Departamento criado com sucesso!", () =>
        navigate({ to: "/department" })
      );
    },
    onError: (error) => {
      feedback.error(getApiErrorMessage(error));
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
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  );
}
