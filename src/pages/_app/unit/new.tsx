import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateView } from "@/components/views/create-view";
import { MeasurementUnitForm } from "./-components/measurement-unit-form";
import { createMeasurementUnit, typeFromSymbol } from "@/api/measurement-units";

export const Route = createFileRoute("/_app/unit/new")({
  component: MeasurementUnitNewPage,
  head: () => ({
    meta: [
      {
        title: "Nova unidade de medida",
      },
    ],
  }),
});

function MeasurementUnitNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createMeasurementUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurement-units"] });
      navigate({ to: "/unit" });
    },
  });

  return (
    <CreateView formId="measurement-unit-form">
      <MeasurementUnitForm
        onSubmit={async (values) => {
          await createMutation.mutateAsync({
            name: values.name,
            symbol: values.symbol,
            type: typeFromSymbol(values.symbol),
          });
        }}
      />
    </CreateView>
  );
}
