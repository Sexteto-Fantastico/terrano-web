import {
  useSearch,
  useNavigate,
  createFileRoute,
} from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { CreateView } from "@/components/views/create-view";
import { ProductBrandForm } from "./-components/product-brand-form";
import {
  fetchProductBrandById,
  updateProductBrand,
  type UpdateProductBrandRequest,
} from "@/api/product-brands";

export const Route = createFileRoute("/_app/product-brand/edit")({
  component: BrandComponent,
  validateSearch: z.object({ id: z.number() }),
  head: () => ({
    meta: [
      {
        title: "Editar marca",
      },
    ],
  }),
});

function BrandComponent() {
  const search = useSearch({ from: "/_app/product-brand/edit" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const brandQuery = useQuery({
    queryKey: ["product-brand", search.id],
    queryFn: () => fetchProductBrandById(search.id),
    enabled: Boolean(search.id),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateProductBrandRequest) => {
      const response = await updateProductBrand(data);
      toast.success("Marca atualizada com sucesso");
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-brands"] });
      navigate({ to: "/product-brand" });
    },
    onError: () => {
      toast.error("Erro ao processar operação!");
    },
  });

  if (!search.id) {
    return <div>Marca inválida</div>;
  }

  if (brandQuery.isLoading) {
    return <div>Carregando...</div>;
  }

  if (!brandQuery.data) {
    return <div>Marca não encontrada</div>;
  }

  return (
    <CreateView formId="product-brand-form">
      <ProductBrandForm
        initialName={brandQuery.data.name}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync({
            id: brandQuery.data.id,
            name: values.name,
          });
        }}
      />
    </CreateView>
  );
}
