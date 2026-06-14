import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";
import {
  StockLocationForm,
  type StockLocationFormValues,
} from "./-components/stock-location-form";
import { createStockLocation } from "@/api/stock-locations";

export const Route = createFileRoute("/_app/stock-location/new")({
  component: StockLocationNewPage,
  head: () => ({
    meta: [
      {
        title: "Novo estoque",
      },
    ],
  }),
});

function StockLocationNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const feedback = useFeedbackDialog();

  const createMutation = useMutation({
    mutationFn: createStockLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-locations"] });
      feedback.success("Estoque criado com sucesso!", () =>
        navigate({ to: "/stock-location" })
      );
    },
    onError: (error) => {
      feedback.error(getApiErrorMessage(error));
    },
  });

  async function handleSubmit(values: StockLocationFormValues) {
    await createMutation.mutateAsync(values);
  }

  return (
    <CreateView formId="stock-location-form">
      <StockLocationForm onSubmit={handleSubmit} />
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  );
}