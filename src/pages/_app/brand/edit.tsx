import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CreateView } from '@/components/views/create-view'
import { Field, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/_app/brand/edit')({
  component: BrandComponent,
  head: () => ({
    meta: [
      {
        title: "Editar marca",
      },
    ],
  }),
});

function BrandComponent() {
  const [brandName, setBrandName] = useState('')

  return (
    <CreateView>
      <FieldSet className="space-y-4">
        <Field>
          <FieldLabel htmlFor="brand-name">Nome da marca</FieldLabel>
          <Input
            id="brand-name"
            name="brand"
            type="text"
            placeholder="Nome da marca"
            autoComplete="brand-name"
            value={brandName}
            onChange={(event) => setBrandName(event.target.value)}
          />
        </Field>
      </FieldSet>
    </CreateView>
  )
}
