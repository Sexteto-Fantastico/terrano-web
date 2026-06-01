import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateView } from "@/components/views/create-view";
import { CategoryForm, type CategoryFormValues } from "./-components/category-form";
import { createProductCategory, type CreateProductCategoryRequest } from "@/api/product-categories";

export const Route = createFileRoute("/_app/category/new")({
  component: CategoryNewPage,
  head: () => ({
    meta: [
      {
        title: "Nova categoria",
      },
    ],
  }),
});

function CategoryNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: CreateProductCategoryRequest) => {
      const response = await createProductCategory(data);
      toast.success("Categoria criada com sucesso");
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate({ to: "/category" });
    },
    onError: () => {
      toast.error("Erro ao processar operação!");
    },
  });

  async function handleSubmit(values: CategoryFormValues) {
    await createMutation.mutateAsync({
      name: values.name,
      description: values.description,
      parentId: values.parentId || undefined,
    });
  }

  return (
    <CreateView formId="category-form">
      <CategoryForm onSubmit={handleSubmit} />
    </CreateView>
  );
}