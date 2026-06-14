import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";
import { StockOutForm, type StockOutFormValues } from "./-components/stock-out-form";
import { createMovementExit } from "@/api/movement-exit";
import { fetchStockLocations } from "@/api/stock-locations";

export const Route = createFileRoute("/_app/stock-out/new")({
  component: StockOutNewPage,
  head: () => ({
    meta: [
      {
        title: "Nova Saída de Estoque",
      },
    ],
  }),
});

function StockOutNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const feedback = useFeedbackDialog();

  const { data: stockLocationsData } = useQuery({
    queryKey: ["stock-locations"],
    queryFn: () => fetchStockLocations({}),
  });

  const stockLocations = stockLocationsData?.result ?? [];

  const createMutation = useMutation({
    mutationFn: createMovementExit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movement-exits"] });
      feedback.success("Saída de estoque registrada com sucesso!", () =>
        navigate({ to: "/stock-out" })
      );
    },
    onError: (error) => {
      feedback.error(
        getApiErrorMessage(
          error,
          "Erro ao registrar saída de estoque. Verifique o saldo disponível."
        )
      );
    },
  });

  async function handleSubmit(values: StockOutFormValues) {
    await createMutation.mutateAsync(values);
  }

  return (
    <CreateView formId="stock-out-form">
      <StockOutForm
        stockLocations={stockLocations}
        onSubmit={handleSubmit}
      />
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  );
}
