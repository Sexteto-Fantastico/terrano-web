import { useSearch, useNavigate, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { CreateView } from "@/components/views/create-view";
import { UserForm } from "./-components/user-form";
import { getUserById, updateUser, type UpdateUserRequest } from "@/api/users";

export const Route = createFileRoute("/_app/user/edit")({
  component: UserEditPage,
  validateSearch: z.object({ id: z.string().min(1) }),
  head: () => ({
    meta: [
      {
        title: "Editar usuário",
      },
    ],
  }),
});

function UserEditPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["user", search.id],
    queryFn: () => getUserById(Number(search.id)),
    enabled: Boolean(search.id),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateUserRequest) => {
      const response = await updateUser(data);
      toast.success("Usuário atualizado com sucesso");
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate({ to: "/user" });
    },
    onError: () => {
      toast.error("Erro ao processar operação!");
    },
  });

  if (!search.id) {
    return <div>Usuário inválido</div>;
  }

  if (userQuery.isLoading) {
    return <div>Carregando...</div>;
  }

  if (!userQuery.data) {
    return <div>Usuário não encontrado</div>;
  }

  return (
    <CreateView formId="user-form">
      <UserForm
        initialValues={{
          name: userQuery.data.name,
          email: userQuery.data.email,
          username: userQuery.data.username,
          cpf: userQuery.data.cpf,
          phone: userQuery.data.phone,
        }}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync({
            id: userQuery.data.id,
            ...values,
          });
        }}
      />
    </CreateView>
  );
}
