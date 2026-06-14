import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CreateView } from "@/components/views/create-view";
import { Separator } from "@/components/ui/separator";
import {
  AccessProfileForm,
  type AccessProfileFormValues,
} from "./-components/access-profile-form";
import { AccessProfilePolicies } from "./-components/access-profile-policies";
import { createRole } from "@/api/roles";

export const Route = createFileRoute("/_app/access-profile/new")({
  component: AccessProfileNewPage,
  head: () => ({
    meta: [{ title: "Novo perfil de acesso" }],
  }),
});

function AccessProfileNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<number[]>([]);

  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      navigate({ to: "/access-profile" });
    },
  });

  async function handleSubmit(values: AccessProfileFormValues) {
    await createMutation.mutateAsync({
      ...values,
      policyIds: selectedPolicyIds.length > 0 ? selectedPolicyIds : undefined,
    });
  }

  return (
    <CreateView formId="access-profile-form">
      <AccessProfileForm onSubmit={handleSubmit} />
      <Separator className="my-8" />
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Permissões</h2>
        <AccessProfilePolicies
          selectedIds={selectedPolicyIds}
          onChange={setSelectedPolicyIds}
        />
      </div>
    </CreateView>
  );
}
