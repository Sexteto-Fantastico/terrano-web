import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useCreateView } from "@/components/views/create-view";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type BrandFormValues = {
  name: string;
};

interface BrandFormProps {
  initialName?: string;
  onSubmit: (values: BrandFormValues) => Promise<void>;
}

export function BrandForm({ initialName = "", onSubmit }: BrandFormProps) {
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
    <form id="brand-form" className="w-full max-w-lg" onSubmit={handleSubmit}>
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
    </form>
  );
}
