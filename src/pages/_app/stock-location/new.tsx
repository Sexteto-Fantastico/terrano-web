import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateView } from "@/components/views/create-view";
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

  const createMutation = useMutation({
    mutationFn: createStockLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-locations"] });
      navigate({ to: "/stock-location" });
    },
  });

  async function handleSubmit(values: StockLocationFormValues) {
    await createMutation.mutateAsync(values);
  }

  return (
    <CreateView formId="stock-location-form">
      <StockLocationForm onSubmit={handleSubmit} />
    </CreateView>
  );
}