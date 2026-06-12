import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useCreateView } from "@/components/views/create-view";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { StockLocation, StockLocationAddress } from "@/api/stock-locations";

export type StockLocationFormValues = {
  name: string;
  description?: string;
  address: StockLocationAddress;
};

interface StockLocationFormProps {
  initialName?: string;
  initialDescription?: string | null;
  initialAddress?: StockLocation["address"];
  onSubmit: (values: StockLocationFormValues) => Promise<void>;
}

function createEmptyAddress(): StockLocationAddress {
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
  address?: StockLocation["address"]
): StockLocationAddress {
  return {
    ...createEmptyAddress(),
    ...address,
    complement: address?.complement ?? "",
  };
}

export function StockLocationForm({
  initialName = "",
  initialDescription = "",
  initialAddress,
  onSubmit,
}: StockLocationFormProps) {
  const { setIsSaving } = useCreateView();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [address, setAddress] = useState<StockLocationAddress>(
    normalizeAddress(initialAddress)
  );

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription ?? "");
    setAddress(normalizeAddress(initialAddress));
  }, [initialName, initialDescription, initialAddress]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    try {
      setIsSaving(true);
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        address: {
          street: address.street.trim(),
          number: address.number.trim(),
          neighborhood: address.neighborhood.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          country: address.country.trim(),
          complement: address.complement?.trim() || undefined,
        },
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      id="stock-location-form"
      className="w-full max-w-4xl"
      onSubmit={handleSubmit}
    >
      <FieldSet className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="stock-location-name">Nome</FieldLabel>
            <Input
              id="stock-location-name"
              name="name"
              type="text"
              placeholder="Nome do estoque"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="stock-location-description">
              Descrição
            </FieldLabel>
            <Textarea
              id="stock-location-description"
              name="description"
              placeholder="Breve descrição do estoque"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-24 resize-none"
            />
          </Field>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div>
            <h3 className="text-sm font-semibold">Endereço</h3>
            <p className="text-sm text-muted-foreground">
              Preencha o endereço completo do estoque.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="stock-location-street">Rua</FieldLabel>
              <Input
                id="stock-location-street"
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
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="stock-location-number">Número</FieldLabel>
              <Input
                id="stock-location-number"
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
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="stock-location-neighborhood">
                Bairro
              </FieldLabel>
              <Input
                id="stock-location-neighborhood"
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
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="stock-location-city">Cidade</FieldLabel>
              <Input
                id="stock-location-city"
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
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="stock-location-state">Estado</FieldLabel>
              <Input
                id="stock-location-state"
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
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="stock-location-country">País</FieldLabel>
              <Input
                id="stock-location-country"
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
                required
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="stock-location-complement">
              Complemento
            </FieldLabel>
            <Input
              id="stock-location-complement"
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