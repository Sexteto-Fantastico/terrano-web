import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";
import { ProductBrandForm } from "./-components/product-brand-form";
import { createProductBrand } from "@/api/product-brands";

export const Route = createFileRoute("/_app/product-brand/new")({
  component: BrandNewPage,
  head: () => ({
    meta: [
      {
        title: "Nova marca",
      },
    ],
  }),
});

function BrandNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const feedback = useFeedbackDialog();

  const createMutation = useMutation({
    mutationFn: createProductBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-brands"] });
      feedback.success("Marca criada com sucesso!", () =>
        navigate({ to: "/product-brand" })
      );
    },
    onError: (error) => {
      feedback.error(getApiErrorMessage(error));
    },
  });

  async function handleSubmit(values: { name: string }) {
    await createMutation.mutateAsync(values);
  }

  return (
    <CreateView formId="product-brand-form">
      <ProductBrandForm onSubmit={handleSubmit} />
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  );
}
