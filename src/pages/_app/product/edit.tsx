import { useSearch, useNavigate, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";
import { ProductForm } from "./-components/product-form";
import {
  fetchProductById,
  updateProduct,
  deleteProduct,
  restoreProduct,
} from "@/api/products";

export const Route = createFileRoute("/_app/product/edit")({
  component: ProductEditPage,
  validateSearch: z.object({ id: z.string().min(1) }),
  head: () => ({
    meta: [
      {
        title: "Editar produto",
      },
    ],
  }),
});

function ProductEditPage() {
  const search = useSearch({ from: "/_app/product/edit" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const feedback = useFeedbackDialog();

  const productQuery = useQuery({
    queryKey: ["product", search.id],
    queryFn: () => fetchProductById(Number(search.id)),
    enabled: Boolean(search.id),
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      feedback.success("Produto atualizado com sucesso!", () =>
        navigate({ to: "/product" })
      );
    },
    onError: (error) => {
      feedback.error(getApiErrorMessage(error));
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, value }: { id: number; value: boolean }) => {
      if (value) {
        await restoreProduct(id);
      } else {
        await deleteProduct(id);
      }
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["product", String(id)] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  if (!search.id) {
    return <div>Produto inválido</div>;
  }

  if (productQuery.isLoading) {
    return <div>Carregando...</div>;
  }

  if (!productQuery.data) {
    return <div>Produto não encontrado</div>;
  }

  const product = productQuery.data;

  return (
    <CreateView
      formId="product-form"
      recordId={product.id}
      logEntity="product"
      active={product.deletedAt == null}
      onActiveChange={(value) =>
        toggleActiveMutation.mutate({ id: product.id, value })
      }
    >
      <ProductForm
        key={product.id}
        initialValues={{
          name: product.name,
          code: product.code,
          description: product.description,
          categoryId: product.category?.id,
          brandId: product.brand?.id,
          measurementUnitId: product.measurementUnit?.id,
          minStock: product.minStock,
          maxStock: product.maxStock,
        }}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync({ id: product.id, ...values });
        }}
      />
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  );
}
