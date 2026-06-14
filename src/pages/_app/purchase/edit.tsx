import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";
import { PurchaseForm, type PurchaseFormValues } from "./-components/purchase-form";
import { getPurchaseById, updatePurchase } from "@/api/purchases";

export const Route = createFileRoute("/_app/purchase/edit")({
  component: PurchaseEditPage,
  validateSearch: z.object({ id: z.string().min(1) }),
  head: () => ({
    meta: [
      {
        title: "Editar compra",
      },
    ],
  }),
});

function PurchaseEditPage() {
  const search = useSearch({ from: "/_app/purchase/edit" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const feedback = useFeedbackDialog();

  const purchaseQuery = useQuery({
    queryKey: ["purchase", search.id],
    queryFn: () => getPurchaseById(Number(search.id)),
    enabled: Boolean(search.id),
  });

  const updateMutation = useMutation({
    mutationFn: updatePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      feedback.success("Compra atualizada com sucesso!", () =>
        navigate({ to: "/purchase" })
      );
    },
    onError: (error) => {
      feedback.error(getApiErrorMessage(error));
    },
  });

  if (!search.id) {
    return <div>Compra inválida</div>;
  }

  if (purchaseQuery.isLoading) {
    return <div>Carregando...</div>;
  }

  if (!purchaseQuery.data) {
    return <div>Compra não encontrada</div>;
  }

  const purchase = purchaseQuery.data;

  const initialValues: PurchaseFormValues = {
    total: purchase.total,
    purchaseDate: purchase.purchaseDate.slice(0, 10),
    estimatedDeliveryDate: purchase.estimatedDeliveryDate
      ? purchase.estimatedDeliveryDate.slice(0, 10)
      : undefined,
    supplierId: purchase.supplier?.id,
    nfNumber: purchase.nfNumber ?? "",
    nfSerie: purchase.nfSerie ?? "",
    usedNfXmlDocument: purchase.usedNfXmlDocument ?? false,
    internalNotes: purchase.internalNotes ?? "",
    products: purchase.products.map((product) => ({
      id: product.id,
      productId: product.productId,
      quantity: product.quantity,
      unitPrice: product.unitPrice,
      total: product.total,
    })),
    payments: purchase.payments.map((payment) => ({
      id: payment.id,
      paymentMethod: payment.paymentMethod,
      total: payment.total,
    })),
  };

  async function handleSubmit(values: PurchaseFormValues) {
    await updateMutation.mutateAsync({ id: purchase.id, ...values });
  }

  return (
    <CreateView formId="purchase-form">
      <PurchaseForm initialValues={initialValues} onSubmit={handleSubmit} />
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  );
}
