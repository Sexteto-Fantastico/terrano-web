import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useCreateView } from "@/components/views/create-view";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type ProductBrandFormValues = {
  name: string;
};

interface ProductBrandFormProps {
  initialName?: string;
  onSubmit: (values: ProductBrandFormValues) => Promise<void>;
}

export function ProductBrandForm({
  initialName = "",
  onSubmit,
}: ProductBrandFormProps) {
  const { setIsSaving } = useCreateView();
  const [brandName, setBrandName] = useState(initialName);

  useEffect(() => {
    setBrandName(initialName);
  }, [initialName]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    try {
      setIsSaving(true);
      await onSubmit({ name: brandName.trim() });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      id="product-brand-form"
      className="w-full max-w-lg"
      onSubmit={handleSubmit}
    >
      <FieldSet className="space-y-4">
        <Field>
          <FieldLabel htmlFor="product-brand-name">Nome da marca</FieldLabel>
          <Input
            id="product-brand-name"
            name="product-brand"
            type="text"
            placeholder="Nome da marca"
            autoComplete="product-brand-name"
            value={brandName}
            onChange={(event) => setBrandName(event.target.value)}
          />
        </Field>
      </FieldSet>
    </form>
  );
}
