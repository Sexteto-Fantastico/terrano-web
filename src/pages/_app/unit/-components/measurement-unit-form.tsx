import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useCreateView } from "@/components/views/create-view";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MEASUREMENT_UNIT_SYMBOL_LABELS,
  MeasurementUnitSymbol,
} from "@/api/measurement-units";

export type MeasurementUnitFormValues = {
  name: string;
  symbol: MeasurementUnitSymbol;
};

interface MeasurementUnitFormProps {
  initialName?: string;
  initialSymbol?: MeasurementUnitSymbol;
  onSubmit: (values: MeasurementUnitFormValues) => Promise<void>;
}

const SYMBOL_OPTIONS = Object.values(MeasurementUnitSymbol);

export function MeasurementUnitForm({
  initialName = "",
  initialSymbol = MeasurementUnitSymbol.UN,
  onSubmit,
}: MeasurementUnitFormProps) {
  const { setIsSaving } = useCreateView();
  const [name, setName] = useState(initialName);
  const [symbol, setSymbol] = useState<MeasurementUnitSymbol>(initialSymbol);

  useEffect(() => {
    setName(initialName);
    setSymbol(initialSymbol);
  }, [initialName, initialSymbol]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    try {
      setIsSaving(true);
      await onSubmit({ name: name.trim(), symbol });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      id="measurement-unit-form"
      className="w-full max-w-lg"
      onSubmit={handleSubmit}
    >
      <FieldSet className="space-y-4">
        <Field>
          <FieldLabel htmlFor="measurement-unit-name">Nome</FieldLabel>
          <Input
            id="measurement-unit-name"
            name="name"
            type="text"
            placeholder="Nome da unidade de medida"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="measurement-unit-symbol">
            Conformidade
          </FieldLabel>
          <Select
            value={symbol}
            onValueChange={(value) => setSymbol(value as MeasurementUnitSymbol)}
          >
            <SelectTrigger id="measurement-unit-symbol" className="w-full">
              <SelectValue placeholder="Selecione a conformidade" />
            </SelectTrigger>
            <SelectContent>
              {SYMBOL_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {MEASUREMENT_UNIT_SYMBOL_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldSet>
    </form>
  );
}
