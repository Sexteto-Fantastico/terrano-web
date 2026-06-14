import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { useCreateView } from "@/components/views/create-view";

import {
  Field,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

export type SupplierFormValues = {
  corporateName: string;
  tradeName: string;
  cnpj: string;
  email: string;
  phone: string;
};

interface SupplierFormProps {
  initialValues?: Partial<SupplierFormValues>;

  onSubmit: (
    values: SupplierFormValues
  ) => Promise<void>;
}

export function SupplierForm({
  initialValues,
  onSubmit,
}: SupplierFormProps) {
  const { setIsSaving } =
    useCreateView();

  const [corporateName, setCorporateName] =
    useState("");

  const [tradeName, setTradeName] =
    useState("");

  const [cnpj, setCnpj] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  useEffect(() => {
    setCorporateName(
      initialValues?.corporateName ??
        ""
    );

    setTradeName(
      initialValues?.tradeName ?? ""
    );

    setCnpj(
      initialValues?.cnpj ?? ""
    );

    setEmail(
      initialValues?.email ?? ""
    );

    setPhone(
      initialValues?.phone ?? ""
    );
  }, [initialValues]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    try {
      setIsSaving(true);

      await onSubmit({
        corporateName:
          corporateName.trim(),

        tradeName:
          tradeName.trim(),

        cnpj:
          cnpj.replace(/\D/g, ""),

        email: email.trim(),

        phone: phone.trim(),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      id="supplier-form"
      className="w-full max-w-2xl"
      onSubmit={handleSubmit}
    >
      <FieldSet className="space-y-4">
        <Field>
          <FieldLabel>
            Razão Social
          </FieldLabel>

          <Input
            value={corporateName}
            onChange={(e) =>
              setCorporateName(
                e.target.value
              )
            }
            placeholder="Razão social"
          />
        </Field>

        <Field>
          <FieldLabel>
            Nome
          </FieldLabel>

          <Input
            value={tradeName}
            onChange={(e) =>
              setTradeName(
                e.target.value
              )
            }
            placeholder="Nome"
          />
        </Field>

        <Field>
          <FieldLabel>
            CNPJ
          </FieldLabel>

          <Input
            value={cnpj}
            onChange={(e) =>
              setCnpj(
                e.target.value
              )
            }
            placeholder="00.000.000/0000-00"
          />
        </Field>

        <Field>
          <FieldLabel>
            E-mail
          </FieldLabel>

          <Input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder="email@empresa.com.br"
          />
        </Field>

        <Field>
          <FieldLabel>
            Telefone
          </FieldLabel>

          <Input
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            placeholder="(11) 99999-9999"
          />
        </Field>
      </FieldSet>
    </form>
  );
}