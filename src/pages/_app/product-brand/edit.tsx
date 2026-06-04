import { useSearch, useNavigate, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { CreateView } from '@/components/views/create-view'
import { ProductBrandForm } from './-components/product-brand-form'
import {
  fetchProductBrandById,
  updateProductBrand,
  deleteProductBrand,
  restoreProductBrand,
} from '@/api/product-brands'

export const Route = createFileRoute('/_app/product-brand/edit')({
  component: BrandComponent,
  validateSearch: z.object({ id: z.string().min(1) }),
  head: () => ({
    meta: [
      {
        title: "Editar marca",
      },
    ],
  }),
});

function BrandComponent() {
  const search = useSearch({ from: '/_app/product-brand/edit' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const brandQuery = useQuery({
    queryKey: ['product-brand', search.id],
    queryFn: () => fetchProductBrandById(Number(search.id)),
    enabled: Boolean(search.id),
  })

  const updateMutation = useMutation({
    mutationFn: updateProductBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-brands'] })
      navigate({ to: '/product-brand' })
    },
  })

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, value }: { id: number; value: boolean }) => {
      if (value) {
        await restoreProductBrand(id)
      } else {
        await deleteProductBrand(id)
      }
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['product-brand', String(id)] })
      queryClient.invalidateQueries({ queryKey: ['product-brands'] })
    },
  })

  if (!search.id) {
    return <div>Marca inválida</div>
  }

  if (brandQuery.isLoading) {
    return <div>Carregando...</div>
  }

  if (!brandQuery.data) {
    return <div>Marca não encontrada</div>
  }

  return (
    <CreateView
      formId="product-brand-form"
      recordId={brandQuery.data.id}
      logEntity="product-brand"
      active={brandQuery.data.isActive ?? brandQuery.data.deletedAt == null}
      onActiveChange={(value) =>
        toggleActiveMutation.mutate({ id: brandQuery.data.id, value })
      }
    >
      <ProductBrandForm
        initialName={brandQuery.data.name}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync({ id: brandQuery.data.id, name: values.name })
        }}
      />
    </CreateView>
  )
}
