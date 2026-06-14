import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";
import { ProductForm } from "./-components/product-form";
import { createProduct } from "@/api/products";

export const Route = createFileRoute("/_app/product/new")({
  component: ProductNewPage,
  head: () => ({
    meta: [
      {
        title: "Novo produto",
      },
    ],
  }),
});

function ProductNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const feedback = useFeedbackDialog();

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      feedback.success("Produto criado com sucesso!", () =>
        navigate({ to: "/product" })
      );
    },
    onError: (error) => {
      feedback.error(getApiErrorMessage(error));
    },
  });

  return (
    <CreateView formId="product-form">
      <ProductForm
        onSubmit={async (values) => {
          await createMutation.mutateAsync(values);
        }}
      />
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  );
}
