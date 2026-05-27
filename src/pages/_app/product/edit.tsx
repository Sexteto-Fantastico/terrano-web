import { useSearch, useNavigate, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { CreateView } from '@/components/views/create-view'
import { ProductForm } from './-components/product-form'
import { fetchProductById, updateProduct } from '@/api/products'

export const Route = createFileRoute('/_app/product/edit')({
  component: ProductEditComponent,
  validateSearch: z.object({ id: z.string().min(1) }),
  head: () => ({
    meta: [
      {
        title: "Editar produto",
      },
    ],
  }),
});

function ProductEditComponent() {
  const search = useSearch({ from: '/_app/product/edit' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const productQuery = useQuery({
    queryKey: ['product', search.id],
    queryFn: () => fetchProductById(Number(search.id)),
    enabled: Boolean(search.id),
  })

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      navigate({ to: '/product' })
    },
  })

  if (!search.id) {
    return <div>Produto inválido</div>
  }

  if (productQuery.isLoading) {
    return <div>Carregando...</div>
  }

  if (!productQuery.data) {
    return <div>Produto não encontrado</div>
  }

  const product = productQuery.data

  return (
    <CreateView formId="product-form">
      <ProductForm
        initialName={product.name}
        initialCode={product.code}
        initialDescription={product.description}
        initialCategoryId={product.category?.id}
        initialBrandId={product.brand?.id}
        initialMeasurementUnitId={product.measurementUnit?.id}
        initialMinStock={product.minStock}
        initialMaxStock={product.maxStock}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync({ id: product.id, ...values })
        }}
      />
    </CreateView>
  )
}
