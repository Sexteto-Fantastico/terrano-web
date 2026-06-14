import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";
import { PurchaseForm, type PurchaseFormValues } from "./-components/purchase-form";
import { createPurchase } from "@/api/purchases";

export const Route = createFileRoute("/_app/purchase/new")({
  component: PurchaseNewPage,
  head: () => ({
    meta: [
      {
        title: "Nova compra",
      },
    ],
  }),
});

function PurchaseNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const feedback = useFeedbackDialog();

  const createMutation = useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      feedback.success("Compra criada com sucesso!", () =>
        navigate({ to: "/purchase" })
      );
    },
    onError: (error) => {
      feedback.error(getApiErrorMessage(error));
    },
  });

  async function handleSubmit(values: PurchaseFormValues) {
    await createMutation.mutateAsync(values);
  }

  return (
    <CreateView formId="purchase-form">
      <PurchaseForm onSubmit={handleSubmit} />
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  );
}
