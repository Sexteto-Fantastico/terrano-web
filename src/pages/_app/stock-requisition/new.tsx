import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";

import {
  StockRequisitionForm,
  type StockRequisitionFormValues,
} from "./-components/stock-requisition-form";

import { createStockRequisition } from "@/api/stock-requisition";
import { getMe } from "@/api/auth";

export const Route = createFileRoute("/_app/stock-requisition/new")({
  component: StockRequisitionNewPage,
});

function StockRequisitionNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const feedback = useFeedbackDialog();

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: getMe,
  });

  const createMutation = useMutation({
    mutationFn: createStockRequisition,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stock-requisitions"],
      });
      feedback.success("Solicitação criada com sucesso!", () =>
        navigate({ to: "/stock-requisition" })
      );
    },
    onError: (error) => {
      feedback.error(getApiErrorMessage(error));
    },
  });

  async function handleSubmit(values: StockRequisitionFormValues) {
    await createMutation.mutateAsync({
      departmentId: currentUser?.department?.id,
      requesterJustification: values.requesterJustification,
      items: values.items,
    });
  }

  return (
    <CreateView formId="stock-requisition-form">
      <StockRequisitionForm onSubmit={handleSubmit} />
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  );
}