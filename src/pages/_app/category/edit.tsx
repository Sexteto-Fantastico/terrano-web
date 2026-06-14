import { useSearch, useNavigate, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { CreateView } from '@/components/views/create-view'
import { FeedbackDialog } from '@/components/ui/feedback-dialog'
import { useFeedbackDialog } from '@/hooks/use-feedback-dialog'
import { getApiErrorMessage } from '@/lib/errors'
import { CategoryForm } from './-components/category-form'
import {
  fetchProductCategoryById,
  updateProductCategory,
  deleteProductCategory,
  restoreProductCategory,
} from '@/api/product-categories'

export const Route = createFileRoute('/_app/category/edit')({
  component: CategoryEditComponent,
  validateSearch: z.object({ id: z.string().min(1) }),
  head: () => ({
    meta: [
      {
        title: "Editar categoria",
      },
    ],
  }),
});

function CategoryEditComponent() {
  const search = useSearch({ from: '/_app/category/edit' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const feedback = useFeedbackDialog()

  const categoryQuery = useQuery({
    queryKey: ['category', search.id],
    queryFn: () => fetchProductCategoryById(Number(search.id)),
    enabled: Boolean(search.id),
  })

  const updateMutation = useMutation({
    mutationFn: updateProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      feedback.success('Categoria atualizada com sucesso!', () =>
        navigate({ to: '/category' })
      )
    },
    onError: (error) => {
      feedback.error(getApiErrorMessage(error))
    },
  })

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, value }: { id: number; value: boolean }) => {
      if (value) {
        await restoreProductCategory(id)
      } else {
        await deleteProductCategory(id)
      }
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['category', String(id)] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  if (!search.id) {
    return <div>Categoria inválida</div>
  }

  if (categoryQuery.isLoading) {
    return <div>Carregando...</div>
  }

  if (!categoryQuery.data) {
    return <div>Categoria não encontrada</div>
  }

  return (
    <CreateView
      formId="category-form"
      recordId={categoryQuery.data.id}
      logEntity="product-category"
      active={categoryQuery.data.isActive ?? categoryQuery.data.deletedAt == null}
      onActiveChange={(value) =>
        toggleActiveMutation.mutate({ id: categoryQuery.data.id, value })
      }
    >
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
          })
        }}
      />
      <FeedbackDialog {...feedback.props} />
    </CreateView>
  )
}