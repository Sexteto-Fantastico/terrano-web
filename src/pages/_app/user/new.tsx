import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateView } from "@/components/views/create-view";
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

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate({ to: "/user" });
    },
  });

  async function handleSubmit(values: {
    name: string;
    email: string;
    username: string;
    cpf?: string;
    phone?: string;
  }) {
    await createMutation.mutateAsync(values);
  }

  return (
    <CreateView formId="user-form">
      <UserForm onSubmit={handleSubmit} />
    </CreateView>
  );
}
