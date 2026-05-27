import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateView } from "@/components/views/create-view";
import { ProductForm, type ProductFormValues } from "./-components/product-form";
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

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate({ to: "/product" });
    },
  });

  async function handleSubmit(values: ProductFormValues) {
    await createMutation.mutateAsync(values);
  }

  return (
    <CreateView formId="product-form">
      <ProductForm onSubmit={handleSubmit} />
    </CreateView>
  );
}
