import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useCreateView } from "@/components/views/create-view";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type AccessProfileFormValues = {
  name: string;
  description?: string;
};

interface AccessProfileFormProps {
  initialName?: string;
  initialDescription?: string;
  onSubmit: (values: AccessProfileFormValues) => Promise<void>;
}

export function AccessProfileForm({
  initialName = "",
  initialDescription = "",
  onSubmit,
}: AccessProfileFormProps) {
  const { setIsSaving } = useCreateView();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
  }, [initialName, initialDescription]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    try {
      setIsSaving(true);
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      id="access-profile-form"
      className="w-full max-w-lg"
      onSubmit={handleSubmit}
    >
      <FieldSet className="space-y-4">
        <Field>
          <FieldLabel htmlFor="profile-name">Nome do perfil</FieldLabel>
          <Input
            id="profile-name"
            name="name"
            type="text"
            placeholder="Nome do perfil"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="profile-description">Descrição</FieldLabel>
          <Textarea
            id="profile-description"
            name="description"
            placeholder="Breve descrição"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Field>
      </FieldSet>
    </form>
  );
}
