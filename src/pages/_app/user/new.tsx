import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";
import { UserForm } from "./-components/user-form";
import { createUser } from "@/api/users";

export const Route = createFileRoute("/_app/user/new")({
  component: UserNewPage,
  head: () => ({
    meta: [{ title: "Usuário" }],
  }),
});

function UserNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const feedback = useFeedbackDialog();

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      feedback.success("Usuário criado com sucesso!", () =>
        navigate({ to: "/user" })
      );
    },
    onError: (error) => {
      feedback.error(getApiErrorMessage(error));
    },
  });

  async function handleSubmit(values: {
    name: string;
    email: string;
    username: string;
    roleId: number;
    cpf?: string;
    phone?: string;
  }) {
    await createMutation.mutateAsync(values);
  }

  return (
    <CreateView formId="user-form">
      <UserForm onSubmit={handleSubmit} />
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  );
}
