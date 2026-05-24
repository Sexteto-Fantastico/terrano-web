import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useCreateView } from "@/components/views/create-view";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type UserFormValues = {
  name: string;
  email: string;
  username: string;
  cpf?: string;
  phone?: string;
};

interface UserFormProps {
  initialValues?: Partial<UserFormValues>;
  onSubmit: (values: UserFormValues) => Promise<void>;
}

export function UserForm({
  initialValues = {},
  onSubmit,
}: UserFormProps) {
  const { setIsSaving } = useCreateView();
  const [name, setName] = useState(initialValues.name ?? "");
  const [email, setEmail] = useState(initialValues.email ?? "");
  const [username, setUsername] = useState(initialValues.username ?? "");
  const [cpf, setCpf] = useState(initialValues.cpf ?? "");
  const [phone, setPhone] = useState(initialValues.phone ?? "");

  useEffect(() => {
    setName(initialValues.name ?? "");
    setEmail(initialValues.email ?? "");
    setUsername(initialValues.username ?? "");
    setCpf(initialValues.cpf ?? "");
    setPhone(initialValues.phone ?? "");
  }, [initialValues]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    try {
      setIsSaving(true);
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        username: username.trim(),
        cpf: cpf.trim() || undefined,
        phone: phone.trim() || undefined,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form id="user-form" className="w-full max-w-lg" onSubmit={handleSubmit}>
      <FieldSet className="space-y-4">
        <Field>
          <FieldLabel htmlFor="user-name">Nome</FieldLabel>
          <Input
            id="user-name"
            name="name"
            type="text"
            placeholder="Nome do usuário"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="user-email">E-mail</FieldLabel>
          <Input
            id="user-email"
            name="email"
            type="email"
            placeholder="email@exemplo.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="user-username">Usuário</FieldLabel>
          <Input
            id="user-username"
            name="username"
            type="text"
            placeholder="Nome de usuário"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="user-cpf">CPF</FieldLabel>
          <Input
            id="user-cpf"
            name="cpf"
            type="text"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(event) => setCpf(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="user-phone">Telefone</FieldLabel>
          <Input
            id="user-phone"
            name="phone"
            type="text"
            placeholder="(00) 00000-0000"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </Field>
      </FieldSet>
    </form>
  );
}
