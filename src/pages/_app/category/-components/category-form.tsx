import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useCreateView } from "@/components/views/create-view";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export type CategoryFormValues = {
  name: string;
  description?: string;
  parentId?: number | null;
};

interface CategoryFormProps {
  initialName?: string;
  initialDescription?: string;
  initialParentId?: number | null;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
}

export function CategoryForm({
  initialName = "",
  initialDescription = "",
  initialParentId = null,
  onSubmit,
}: CategoryFormProps) {
  const { setIsSaving } = useCreateView();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [parentId, setParentId] = useState<string>("");

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
    setParentId(initialParentId !== null && initialParentId !== undefined ? String(initialParentId) : "");
  }, [initialName, initialDescription, initialParentId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    const parsedParentId = parentId.trim() === "" ? null : Number(parentId);

    if (parsedParentId !== null && isNaN(parsedParentId)) {
      return;
    }

    try {
      setIsSaving(true);
      await onSubmit({ 
        name: name.trim(),
        description: description.trim() || undefined,
        parentId: parsedParentId,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      id="category-form"
      className="w-full max-w-lg"
      onSubmit={handleSubmit}
    >
      <FieldSet className="space-y-4">
        <Field>
          <FieldLabel htmlFor="category-name">Nome da categoria</FieldLabel>
          <Input
            id="category-name"
            name="category"
            type="text"
            placeholder="Nome da categoria"
            autoComplete="category-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Field>
        
        <Field>
          <FieldLabel htmlFor="category-description">Descrição</FieldLabel>
          <Input
            id="category-description"
            name="description"
            type="text"
            placeholder="Breve descrição"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Field>
        
        <Field>
          <FieldLabel htmlFor="category-parent">ID Categoria Pai (Opcional)</FieldLabel>
          <Input
            id="category-parent"
            name="parentId"
            type="number"
            placeholder="Ex: 1"
            value={parentId}
            onChange={(event) => setParentId(event.target.value)}
          />
        </Field>
      </FieldSet>
    </form>
  );
}