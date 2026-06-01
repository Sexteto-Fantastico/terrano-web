import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateView } from "@/components/views/create-view";
import { UserForm } from "./-components/user-form";
import { createUser, type CreateUserRequest } from "@/api/users";

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
    mutationFn: async (user: CreateUserRequest) => {
      const data = await createUser(user);
      toast.success("Usuário criado com sucesso");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate({ to: "/user" });
    },
    onError: () => {
      toast.error("Erro ao processar operação!");
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
