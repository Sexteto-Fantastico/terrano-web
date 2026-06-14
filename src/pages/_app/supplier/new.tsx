import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";

import {
  SupplierForm,
  type SupplierFormValues,
} from "./-components/supplier-form";

import { createSupplier } from "@/api/supplier";

export const Route = createFileRoute(
  "/_app/supplier/new"
)({
  component: SupplierNewPage,
});

function SupplierNewPage() {
  const navigate = useNavigate();

  const queryClient =
    useQueryClient();

  const feedback =
    useFeedbackDialog();

  const createMutation =
    useMutation({
      mutationFn:
        createSupplier,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["suppliers"],
        });

        feedback.success(
          "Fornecedor criado com sucesso!",
          () =>
            navigate({
              to: "/supplier",
            })
        );
      },

      onError: (error) => {
        feedback.error(
          getApiErrorMessage(error)
        );
      },
    });

  async function handleSubmit(
    values: SupplierFormValues
  ) {
    await createMutation.mutateAsync({
      corporateName:
        values.corporateName,

      tradeName:
        values.tradeName,

      cnpj: values.cnpj,

      email: values.email,

      phone: values.phone,
    });
  }

  return (
    <CreateView formId="supplier-form">
      <SupplierForm
        onSubmit={handleSubmit}
      />

      <FeedbackDialog
        {...feedback.props}
      />
    </CreateView>
  );
}