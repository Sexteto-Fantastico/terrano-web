import { useSearch, useNavigate, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { CreateView } from '@/components/views/create-view'
import { BrandForm } from './-components/brand-form'
import { fetchProductBrandById, updateProductBrand } from '@/api/brand'

export const Route = createFileRoute('/_app/brand/edit')({
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
  const search = useSearch({ from: '/_app/brand/edit' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const brandQuery = useQuery({
    queryKey: ['brand', search.id],
    queryFn: () => fetchProductBrandById(Number(search.id)),
    enabled: Boolean(search.id),
  })

  const updateMutation = useMutation({
    mutationFn: updateProductBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      navigate({ to: '/brand' })
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
    <CreateView formId="brand-form">
      <BrandForm
        initialName={brandQuery.data.name}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync({ id: brandQuery.data.id, name: values.name })
        }}
      />
    </CreateView>
  )
}
