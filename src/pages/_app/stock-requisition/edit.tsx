import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { z } from "zod";

import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";

import { StockRequisitionForm } from "./-components/stock-requisition-form";

import {
  fetchStockRequisitionById,
  updateStockRequisition,
} from "@/api/stock-requisition";

export const Route = createFileRoute(
  "/_app/stock-requisition/edit"
)({
  component: StockRequisitionEditPage,

  validateSearch: z.object({
    id: z.string().min(1),
  }),

  head: () => ({
    meta: [
      {
        title: "Editar Solicitação de Material",
      },
    ],
  }),
});

function StockRequisitionEditPage() {
  const search = useSearch({
    from: "/_app/stock-requisition/edit",
  });

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const feedback = useFeedbackDialog();

  const requisitionQuery = useQuery({
    queryKey: ["stock-requisition", search.id],

    queryFn: () =>
      fetchStockRequisitionById(Number(search.id)),

    enabled: Boolean(search.id),
  });

  const updateMutation = useMutation({
    mutationFn: updateStockRequisition,

   onSuccess: async () => {
  await queryClient.invalidateQueries({
    queryKey: ["stock-requisitions"],
  });

  await queryClient.invalidateQueries({
    queryKey: ["stock-requisition", search.id],
  });

  await queryClient.refetchQueries({
    queryKey: ["stock-requisition", search.id],
  });

  feedback.success("Solicitação atualizada com sucesso!", () =>
    navigate({ to: "/stock-requisition" })
  );
    },

    onError: (error) => {
      feedback.error(getApiErrorMessage(error));
    },
  });

  if (!search.id) {
    return <div>Solicitação inválida</div>;
  }

  if (requisitionQuery.isLoading) {
    return <div>Carregando...</div>;
  }

  if (!requisitionQuery.data) {
    return <div>Solicitação não encontrada</div>;
  }

  return (
    <CreateView formId="stock-requisition-form">
      <StockRequisitionForm
  key={requisitionQuery.data.id}
  initialJustification={
    requisitionQuery.data.requesterJustification
  }
  initialItems={requisitionQuery.data.items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
  }))}
  onSubmit={async (values) => {
  await updateMutation.mutateAsync({
    id: requisitionQuery.data.id,
    requesterJustification: values.requesterJustification,
    items: values.items.map(item => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
    })),
  });
}}
/>
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  );
}