import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";
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
  const feedback = useFeedbackDialog();

  const createMutation = useMutation({
    mutationFn: createMeasurementUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurement-units"] });
      feedback.success("Unidade de medida criada com sucesso!", () =>
        navigate({ to: "/unit" })
      );
    },
    onError: (error) => {
      feedback.error(getApiErrorMessage(error));
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
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  );
}
