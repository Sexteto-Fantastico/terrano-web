import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreateView } from "@/components/views/create-view";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { fetchRoles } from "@/api/roles";

type UserFormValues = {
  name: string;
  email: string;
  username: string;
  roleId: number;
  cpf?: string;
  phone?: string;
};

interface UserFormProps {
  initialValues?: Partial<UserFormValues>;
  initialRoleId?: number;
  onSubmit: (values: UserFormValues) => Promise<void>;
}

export function UserForm({
  initialValues = {},
  initialRoleId,
  onSubmit,
}: UserFormProps) {
  const { setIsSaving } = useCreateView();
  const [name, setName] = useState(initialValues.name ?? "");
  const [email, setEmail] = useState(initialValues.email ?? "");
  const [username, setUsername] = useState(initialValues.username ?? "");
  const [roleId, setRoleId] = useState<number>(initialRoleId ?? 0);
  const [cpf, setCpf] = useState(initialValues.cpf ?? "");
  const [phone, setPhone] = useState(initialValues.phone ?? "");

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => fetchRoles({}),
  });

  useEffect(() => {
    setName(initialValues.name ?? "");
    setEmail(initialValues.email ?? "");
    setUsername(initialValues.username ?? "");
    setCpf(initialValues.cpf ?? "");
    setPhone(initialValues.phone ?? "");
  }, [initialValues]);

  useEffect(() => {
    if (initialRoleId !== undefined) {
      setRoleId(initialRoleId);
    }
  }, [initialRoleId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    try {
      setIsSaving(true);
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        username: username.trim(),
        roleId,
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
          <FieldLabel htmlFor="user-role">Perfil de acesso</FieldLabel>
          <NativeSelect
            id="user-role"
            value={roleId}
            onChange={(event) => setRoleId(Number(event.target.value))}
            required
          >
            <NativeSelectOption value={0} disabled>
              Selecione um perfil
            </NativeSelectOption>
            {roles?.result?.map((role) => (
              <NativeSelectOption key={role.id} value={role.id}>
                {role.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
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
