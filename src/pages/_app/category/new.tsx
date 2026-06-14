import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";
import { CategoryForm, type CategoryFormValues } from "./-components/category-form";
import { createProductCategory } from "@/api/product-categories";

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
  const feedback = useFeedbackDialog();

  const createMutation = useMutation({
    mutationFn: createProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      feedback.success("Categoria criada com sucesso!", () =>
        navigate({ to: "/category" })
      );
    },
    onError: (error) => {
      feedback.error(getApiErrorMessage(error));
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
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  );
}