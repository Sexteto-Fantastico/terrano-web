import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";
import {
  SupplierForm,
  type SupplierFormValues,
} from "./-components/supplier-form";
import {
  deleteSupplier,
  fetchSupplierById,
  restoreSupplier,
  updateSupplier,
} from "@/api/suppliers";

export const Route = createFileRoute("/_app/supplier/edit")({
  component: SupplierEditPage,
  validateSearch: z.object({ id: z.string().min(1) }),
  head: () => ({
    meta: [
      {
        title: "Editar fornecedor",
      },
    ],
  }),
});

function SupplierEditPage() {
  const search = useSearch({ from: "/_app/supplier/edit" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const feedback = useFeedbackDialog();

  const supplierQuery = useQuery({
    queryKey: ["supplier", search.id],
    queryFn: () => fetchSupplierById(Number(search.id)),
    enabled: Boolean(search.id),
  });

  const updateMutation = useMutation({
    mutationFn: updateSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      feedback.success("Fornecedor atualizado com sucesso!", () =>
        navigate({ to: "/supplier" })
      );
    },
    onError: (error) => {
      feedback.error(getApiErrorMessage(error));
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, value }: { id: number; value: boolean }) => {
      if (value) {
        await restoreSupplier(id);
      } else {
        await deleteSupplier(id);
      }
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["supplier", String(id)] });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  if (!search.id) {
    return <div>Fornecedor inválido</div>;
  }

  if (supplierQuery.isLoading) {
    return <div>Carregando...</div>;
  }

  if (!supplierQuery.data) {
    return <div>Fornecedor não encontrado</div>;
  }

  return (
    <CreateView
      formId="supplier-form"
      recordId={supplierQuery.data.id}
      active={
        supplierQuery.data.isActive ??
        supplierQuery.data.deletedAt == null
      }
      onActiveChange={(value) =>
        toggleActiveMutation.mutate({
          id: supplierQuery.data.id,
          value,
        })
      }
    >
      <SupplierForm
        initialCorporateName={supplierQuery.data.corporateName}
        initialTradeName={supplierQuery.data.tradeName}
        initialCnpj={supplierQuery.data.cnpj}
        initialEmail={supplierQuery.data.email}
        initialPhone={supplierQuery.data.phone}
        initialAddress={supplierQuery.data.address}
        onSubmit={async (values: SupplierFormValues) => {
          await updateMutation.mutateAsync({
            id: supplierQuery.data.id,
            ...values,
          });
        }}
      />
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  );
}