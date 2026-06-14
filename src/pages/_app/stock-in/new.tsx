import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";
import { createMovementEntry, type CreateMovementEntryRequest } from "@/api/movement-entry";
import { MovementEntryForm } from "./-components/movement-entry-form";

export const Route = createFileRoute("/_app/stock-in/new")({
  component: StockInNewPage,
  head: () => ({
    meta: [{ title: "Nova Entrada de Estoque" }],
  }),
});

function StockInNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const feedback = useFeedbackDialog();

  const createMutation = useMutation({
    mutationFn: createMovementEntry,
    onSuccess: (entry) => {
      queryClient.invalidateQueries({ queryKey: ["movement-entries"] });
      feedback.success("Entrada registrada com sucesso!", () =>
        navigate({ to: "/stock-in/$id", params: { id: String(entry.id) } })
      );
    },
    onError: (error) => {
      feedback.error(
        getApiErrorMessage(error, "Erro ao registrar entrada de estoque.")
      );
    },
  });

  async function handleSubmit(values: CreateMovementEntryRequest) {
    await createMutation.mutateAsync(values);
  }

  return (
    <CreateView formId="stock-in-form">
      <MovementEntryForm onSubmit={handleSubmit} />
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  );
}
