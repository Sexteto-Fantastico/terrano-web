import {
  useSearch,
  useNavigate,
  createFileRoute,
} from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { CreateView } from "@/components/views/create-view";
import { MeasurementUnitForm } from "./-components/measurement-unit-form";
import {
  fetchMeasurementUnitById,
  updateMeasurementUnit,
  typeFromSymbol,
} from "@/api/measurement-units";

export const Route = createFileRoute("/_app/unit/edit")({
  component: MeasurementUnitEditPage,
  validateSearch: z.object({ id: z.string().min(1) }),
  head: () => ({
    meta: [
      {
        title: "Editar unidade de medida",
      },
    ],
  }),
});

function MeasurementUnitEditPage() {
  const search = useSearch({ from: "/_app/unit/edit" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const unitQuery = useQuery({
    queryKey: ["measurement-unit", search.id],
    queryFn: () => fetchMeasurementUnitById(Number(search.id)),
    enabled: Boolean(search.id),
  });

  const updateMutation = useMutation({
    mutationFn: updateMeasurementUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurement-units"] });
      navigate({ to: "/unit" });
    },
  });

  if (!search.id) {
    return <div>Unidade de medida inválida</div>;
  }

  if (unitQuery.isLoading) {
    return <div>Carregando...</div>;
  }

  if (!unitQuery.data) {
    return <div>Unidade de medida não encontrada</div>;
  }

  return (
    <CreateView formId="measurement-unit-form">
      <MeasurementUnitForm
        initialName={unitQuery.data.name}
        initialSymbol={unitQuery.data.symbol}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync({
            id: unitQuery.data.id,
            name: values.name,
            symbol: values.symbol,
            type: typeFromSymbol(values.symbol),
          });
        }}
      />
    </CreateView>
  );
}
