import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateView } from "@/components/views/create-view";
import { ProductForm, type ProductFormValues } from "./-components/product-form";
import { createProduct, type CreateProductRequest } from "@/api/products";

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
    mutationFn: async (data: CreateProductRequest) => {
      const response = await createProduct(data);
      toast.success("Produto criado com sucesso");
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate({ to: "/product" });
    },
    onError: () => {
      toast.error("Erro ao processar operação!");
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
