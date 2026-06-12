import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { CreateView } from "@/components/views/create-view";
import {
  StockLocationForm,
  type StockLocationFormValues,
} from "./-components/stock-location-form";
import {
  deleteStockLocation,
  fetchStockLocationById,
  restoreStockLocation,
  updateStockLocation,
} from "@/api/stock-locations";

export const Route = createFileRoute("/_app/stock-location/edit")({
  component: StockLocationEditPage,
  validateSearch: z.object({ id: z.string().min(1) }),
  head: () => ({
    meta: [
      {
        title: "Editar estoque",
      },
    ],
  }),
});

function StockLocationEditPage() {
  const search = useSearch({ from: "/_app/stock-location/edit" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const stockLocationQuery = useQuery({
    queryKey: ["stock-location", search.id],
    queryFn: () => fetchStockLocationById(Number(search.id)),
    enabled: Boolean(search.id),
  });

  const updateMutation = useMutation({
    mutationFn: updateStockLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-locations"] });
      navigate({ to: "/stock-location" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, value }: { id: number; value: boolean }) => {
      if (value) {
        await restoreStockLocation(id);
      } else {
        await deleteStockLocation(id);
      }
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["stock-location", String(id)] });
      queryClient.invalidateQueries({ queryKey: ["stock-locations"] });
    },
  });

  if (!search.id) {
    return <div>Estoque inválido</div>;
  }

  if (stockLocationQuery.isLoading) {
    return <div>Carregando...</div>;
  }

  if (!stockLocationQuery.data) {
    return <div>Estoque não encontrado</div>;
  }

  return (
    <CreateView
      formId="stock-location-form"
      recordId={stockLocationQuery.data.id}
      active={
        stockLocationQuery.data.isActive ??
        stockLocationQuery.data.deletedAt == null
      }
      onActiveChange={(value) =>
        toggleActiveMutation.mutate({
          id: stockLocationQuery.data.id,
          value,
        })
      }
    >
      <StockLocationForm
        initialName={stockLocationQuery.data.name}
        initialDescription={stockLocationQuery.data.description}
        initialAddress={stockLocationQuery.data.address}
        onSubmit={async (values: StockLocationFormValues) => {
          await updateMutation.mutateAsync({
            id: stockLocationQuery.data.id,
            name: values.name,
            description: values.description,
            address: values.address,
          });
        }}
      />
    </CreateView>
  );
}