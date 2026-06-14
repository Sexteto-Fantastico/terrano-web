import { useSearch, useNavigate, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CreateView } from "@/components/views/create-view";
import { Separator } from "@/components/ui/separator";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";
import {
  AccessProfileForm,
  type AccessProfileFormValues,
} from "./-components/access-profile-form";
import { AccessProfilePolicies } from "./-components/access-profile-policies";
import {
  fetchRoleById,
  updateRole,
  deleteRole,
  restoreRole,
  assignPolicies,
} from "@/api/roles";

export const Route = createFileRoute("/_app/access-profile/edit")({
  component: AccessProfileEditComponent,
  validateSearch: z.object({ id: z.string().min(1) }),
  head: () => ({
    meta: [{ title: "Editar perfil de acesso" }],
  }),
});

function AccessProfileEditComponent() {
  const search = useSearch({ from: "/_app/access-profile/edit" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const feedback = useFeedbackDialog();
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<number[]>([]);
  const [initialized, setInitialized] = useState(false);

  const roleQuery = useQuery({
    queryKey: ["role", search.id],
    queryFn: () => fetchRoleById(Number(search.id)),
    enabled: Boolean(search.id),
  });

  useEffect(() => {
    if (roleQuery.data && !initialized) {
      setSelectedPolicyIds(roleQuery.data.policies.map((p) => p.id));
      setInitialized(true);
    }
  }, [roleQuery.data, initialized]);

  const updateMutation = useMutation({ mutationFn: updateRole });

  const policiesMutation = useMutation({
    mutationFn: (policyIds: number[]) =>
      assignPolicies(Number(search.id), policyIds),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({
      id,
      value,
    }: {
      id: number;
      value: boolean;
    }) => {
      if (value) {
        await restoreRole(id);
      } else {
        await deleteRole(id);
      }
    },
    onSuccess: (_data, { id, value }) => {
      queryClient.invalidateQueries({ queryKey: ["role", String(id)] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success(
        value
          ? "Perfil de acesso ativado com sucesso!"
          : "Perfil de acesso desativado com sucesso!"
      );
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  if (!search.id) return <div>Perfil inválido</div>;
  if (roleQuery.isLoading) return <div>Carregando...</div>;
  if (!roleQuery.data) return <div>Perfil não encontrado</div>;

  const role = roleQuery.data;

  async function handleSubmit(values: AccessProfileFormValues) {
    try {
      await updateMutation.mutateAsync({
        id: role.id,
        name: values.name,
        description: values.description,
      });

      await policiesMutation.mutateAsync(selectedPolicyIds);

      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role", search.id] });

      feedback.success("Perfil de acesso atualizado com sucesso!", () =>
        navigate({ to: "/access-profile" })
      );
    } catch (error) {
      feedback.error(getApiErrorMessage(error));
    }
  }

  return (
    <CreateView
      formId="access-profile-form"
      recordId={role.id}
      logEntity="access-profile"
      active={role.isActive}
      onActiveChange={(value) =>
        toggleActiveMutation.mutate({ id: role.id, value })
      }
    >
      <AccessProfileForm
        initialName={role.name}
        initialDescription={role.description}
        onSubmit={handleSubmit}
      />
      <Separator className="my-8" />
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Permissões</h2>
        <AccessProfilePolicies
          selectedIds={selectedPolicyIds}
          onChange={setSelectedPolicyIds}
          disabled={!role.isActive}
        />
      </div>
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  );
}
