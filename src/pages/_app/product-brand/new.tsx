import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateView } from "@/components/views/create-view";
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

  const createMutation = useMutation({
    mutationFn: createProductBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-brands"] });
      navigate({ to: "/product-brand" });
    },
  });

  async function handleSubmit(values: { name: string }) {
    await createMutation.mutateAsync(values);
  }

  return (
    <CreateView formId="product-brand-form">
      <ProductBrandForm onSubmit={handleSubmit} />
    </CreateView>
  );
}
