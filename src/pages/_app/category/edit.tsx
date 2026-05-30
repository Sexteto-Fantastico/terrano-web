import {
  useSearch,
  useNavigate,
  createFileRoute,
} from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { CreateView } from "@/components/views/create-view";
import { CategoryForm } from "./-components/category-form";
import {
  fetchProductCategoryById,
  updateProductCategory,
} from "@/api/product-categories";

export const Route = createFileRoute("/_app/category/edit")({
  component: CategoryEditComponent,
  validateSearch: z.object({ id: z.number() }),
  head: () => ({
    meta: [
      {
        title: "Editar categoria",
      },
    ],
  }),
});

function CategoryEditComponent() {
  const search = useSearch({ from: "/_app/category/edit" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const categoryQuery = useQuery({
    queryKey: ["category", search.id],
    queryFn: () => fetchProductCategoryById(Number(search.id)),
    enabled: Boolean(search.id),
  });

  const updateMutation = useMutation({
    mutationFn: updateProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria atualizada com sucesso");
      navigate({ to: "/category" });
    },
  });

  if (!search.id) {
    return <div>Categoria inválida</div>;
  }

  if (categoryQuery.isLoading) {
    return <div>Carregando...</div>;
  }

  if (!categoryQuery.data) {
    return <div>Categoria não encontrada</div>;
  }

  return (
    <CreateView formId="category-form">
      <CategoryForm
        initialName={categoryQuery.data.name}
        initialDescription={categoryQuery.data.description}
        initialParentId={categoryQuery.data.parent?.id}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync({
            id: categoryQuery.data.id,
            name: values.name,
            description: values.description,
            parentId: values.parentId,
          });
        }}
      />
    </CreateView>
  );
}
