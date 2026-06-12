import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateView } from "@/components/views/create-view";

import {
  StockRequisitionForm,
  type StockRequisitionFormValues,
} from "./-components/stock-requisition-form";

import { createStockRequisition } from "@/api/stock-requisition";

export const Route = createFileRoute(
  "/_app/stock-requisition/new"
)({
  component: StockRequisitionNewPage,
});

function StockRequisitionNewPage() {
  const navigate = useNavigate();

  const queryClient =
    useQueryClient();

  const createMutation =
    useMutation({
      mutationFn:
        createStockRequisition,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "stock-requisitions",
          ],
        });

        navigate({
          to: "/stock-requisition",
        });
      },
    });

  async function handleSubmit(
    values: StockRequisitionFormValues
  ) {
    await createMutation.mutateAsync({
      requesterJustification:
        values.requesterJustification,

      items: values.items,
    });
  }

  return (
    <CreateView formId="stock-requisition-form">
      <StockRequisitionForm
        onSubmit={handleSubmit}
      />
    </CreateView>
  );
}