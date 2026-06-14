import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useCreateView } from "@/components/views/create-view";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatCnpj } from "@/utils/format-cnpj";
import { formatPhone } from "@/utils/format-phone";

export type SupplierAddress = {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  complement?: string;
};

export type SupplierFormValues = {
  corporateName: string;
  tradeName: string;
  cnpj: string;
  email: string;
  phone: string;
  address?: SupplierAddress;
};

interface SupplierFormProps {
  initialCorporateName?: string;
  initialTradeName?: string;
  initialCnpj?: string;
  initialEmail?: string;
  initialPhone?: string;
  initialAddress?: Partial<SupplierAddress> | null;
  onSubmit: (values: SupplierFormValues) => Promise<void>;
}

function createEmptyAddress(): SupplierAddress {
  return {
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "",
    complement: "",
  };
}

function normalizeAddress(
  address?: Partial<SupplierAddress> | null
): SupplierAddress {
  const safeAddress = address ?? {};

  return {
    ...createEmptyAddress(),
    ...safeAddress,
    complement: safeAddress.complement ?? "",
  };
}

export function SupplierForm({
  initialCorporateName = "",
  initialTradeName = "",
  initialCnpj = "",
  initialEmail = "",
  initialPhone = "",
  initialAddress,
  onSubmit,
}: SupplierFormProps) {
  const { setIsSaving } = useCreateView();
  const [corporateName, setCorporateName] = useState(initialCorporateName);
  const [tradeName, setTradeName] = useState(initialTradeName);
  const [cnpj, setCnpj] = useState(initialCnpj ? formatCnpj(initialCnpj) : "");
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(
    initialPhone ? formatPhone(initialPhone) : ""
  );
  const [address, setAddress] = useState<SupplierAddress>(
    normalizeAddress(initialAddress)
  );

  useEffect(() => {
    setCorporateName(initialCorporateName);
    setTradeName(initialTradeName);
    setCnpj(initialCnpj ? formatCnpj(initialCnpj) : "");
    setEmail(initialEmail);
    setPhone(initialPhone ? formatPhone(initialPhone) : "");
    setAddress(normalizeAddress(initialAddress));
  }, [
    initialCorporateName,
    initialTradeName,
    initialCnpj,
    initialEmail,
    initialPhone,
    initialAddress,
  ]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    const hasAddressData =
      address.street.trim() !== "" ||
      address.number.trim() !== "" ||
      address.city.trim() !== "";

    try {
      setIsSaving(true);
      await onSubmit({
        corporateName: corporateName.trim(),
        tradeName: tradeName.trim(),
        cnpj: cnpj.replace(/\D/g, ""),
        email: email.trim(),
        phone: phone.replace(/\D/g, ""),
        address: hasAddressData
          ? {
              street: address.street.trim(),
              number: address.number.trim(),
              neighborhood: address.neighborhood.trim(),
              city: address.city.trim(),
              state: address.state.trim(),
              country: address.country.trim(),
              complement: address.complement?.trim() || undefined,
            }
          : undefined,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      id="supplier-form"
      className="w-full max-w-4xl"
      onSubmit={handleSubmit}
    >
      <FieldSet className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="supplier-corporate-name">
              Razão Social
            </FieldLabel>
            <Input
              id="supplier-corporate-name"
              name="corporateName"
              type="text"
              placeholder="Razão social"
              value={corporateName}
              onChange={(e) => setCorporateName(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="supplier-trade-name">
              Nome Fantasia
            </FieldLabel>
            <Input
              id="supplier-trade-name"
              name="tradeName"
              type="text"
              placeholder="Nome"
              value={tradeName}
              onChange={(e) => setTradeName(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="supplier-cnpj">CNPJ</FieldLabel>
            <Input
              id="supplier-cnpj"
              name="cnpj"
              type="text"
              placeholder="00.000.000/0000-00"
              maxLength={18}
              value={cnpj}
              onChange={(e) => setCnpj(formatCnpj(e.target.value))}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="supplier-email">E-mail</FieldLabel>
            <Input
              id="supplier-email"
              name="email"
              type="email"
              placeholder="email@empresa.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="supplier-phone">Telefone</FieldLabel>
            <Input
              id="supplier-phone"
              name="phone"
              type="text"
              placeholder="(11) 99999-9999"
              maxLength={15}
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              required
            />
          </Field>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div>
            <h3 className="text-sm font-semibold">Endereço</h3>
            <p className="text-sm text-muted-foreground">
              Preencha o endereço completo do fornecedor (opcional).
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="supplier-street">Rua</FieldLabel>
              <Input
                id="supplier-street"
                name="street"
                type="text"
                placeholder="Rua"
                value={address.street}
                onChange={(event) =>
                  setAddress((current) => ({
                    ...current,
                    street: event.target.value,
                  }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="supplier-number">Número</FieldLabel>
              <Input
                id="supplier-number"
                name="number"
                type="text"
                placeholder="Número"
                value={address.number}
                onChange={(event) =>
                  setAddress((current) => ({
                    ...current,
                    number: event.target.value,
                  }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="supplier-neighborhood">Bairro</FieldLabel>
              <Input
                id="supplier-neighborhood"
                name="neighborhood"
                type="text"
                placeholder="Bairro"
                value={address.neighborhood}
                onChange={(event) =>
                  setAddress((current) => ({
                    ...current,
                    neighborhood: event.target.value,
                  }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="supplier-city">Cidade</FieldLabel>
              <Input
                id="supplier-city"
                name="city"
                type="text"
                placeholder="Cidade"
                value={address.city}
                onChange={(event) =>
                  setAddress((current) => ({
                    ...current,
                    city: event.target.value,
                  }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="supplier-state">Estado</FieldLabel>
              <Input
                id="supplier-state"
                name="state"
                type="text"
                placeholder="Estado"
                value={address.state}
                onChange={(event) =>
                  setAddress((current) => ({
                    ...current,
                    state: event.target.value,
                  }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="supplier-country">País</FieldLabel>
              <Input
                id="supplier-country"
                name="country"
                type="text"
                placeholder="País"
                value={address.country}
                onChange={(event) =>
                  setAddress((current) => ({
                    ...current,
                    country: event.target.value,
                  }))
                }
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="supplier-complement">Complemento</FieldLabel>
            <Input
              id="supplier-complement"
              name="complement"
              type="text"
              placeholder="Complemento"
              value={address.complement ?? ""}
              onChange={(event) =>
                setAddress((current) => ({
                  ...current,
                  complement: event.target.value,
                }))
              }
            />
          </Field>
        </div>
      </FieldSet>
    </form>
  );
}