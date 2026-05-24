import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateView } from "@/components/views/create-view";
import { BrandForm } from "./-components/brand-form";
import { createProductBrand } from "@/api/brand";

export const Route = createFileRoute("/_app/brand/new")({
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
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      navigate({ to: "/brand" });
    },
  });

  async function handleSubmit(values: { name: string }) {
    await createMutation.mutateAsync(values);
  }

  return (
    <CreateView formId="brand-form">
      <BrandForm onSubmit={handleSubmit} />
    </CreateView>
  );
}
