import type { FormEvent } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreateView } from "@/components/views/create-view";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchAllProductCategories } from "@/api/product-categories";
import { fetchAllProductBrands } from "@/api/product-brands";
import { fetchAllMeasurementUnits } from "@/api/measurement-units";

export type ProductFormValues = {
  name: string;
  code: string;
  description?: string;
  categoryId: number;
  brandId: number;
  measurementUnitId: number;
  minStock?: number;
  maxStock?: number;
};

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => Promise<void>;
}

function toSelectValue(value?: number): string {
  return value != null ? String(value) : "";
}

function toNumberInput(value?: number): string {
  return value != null ? String(value) : "";
}

export function ProductForm({ initialValues = {}, onSubmit }: ProductFormProps) {
  const { setIsSaving } = useCreateView();

  const [name, setName] = useState(initialValues.name ?? "");
  const [code, setCode] = useState(initialValues.code ?? "");
  const [description, setDescription] = useState(
    initialValues.description ?? ""
  );
  const [categoryId, setCategoryId] = useState(
    toSelectValue(initialValues.categoryId)
  );
  const [brandId, setBrandId] = useState(toSelectValue(initialValues.brandId));
  const [measurementUnitId, setMeasurementUnitId] = useState(
    toSelectValue(initialValues.measurementUnitId)
  );
  const [minStock, setMinStock] = useState(
    toNumberInput(initialValues.minStock)
  );
  const [maxStock, setMaxStock] = useState(
    toNumberInput(initialValues.maxStock)
  );

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: () => fetchAllProductCategories(),
  });

  const { data: brands = [], isLoading: isLoadingBrands } = useQuery({
    queryKey: ["product-brands"],
    queryFn: fetchAllProductBrands,
  });

  const { data: measurementUnits = [], isLoading: isLoadingUnits } = useQuery({
    queryKey: ["measurement-units"],
    queryFn: fetchAllMeasurementUnits,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!categoryId || !brandId || !measurementUnitId) {
      return;
    }

    try {
      setIsSaving(true);
      await onSubmit({
        name: name.trim(),
        code: code.trim(),
        description: description.trim() || undefined,
        categoryId: Number(categoryId),
        brandId: Number(brandId),
        measurementUnitId: Number(measurementUnitId),
        minStock: minStock !== "" ? Number(minStock) : undefined,
        maxStock: maxStock !== "" ? Number(maxStock) : undefined,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form id="product-form" className="w-full max-w-2xl" onSubmit={handleSubmit}>
      <FieldSet className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="product-name">Nome do produto</FieldLabel>
            <Input
              id="product-name"
              name="name"
              type="text"
              placeholder="Digite o nome do produto"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="product-code">Código interno</FieldLabel>
            <Input
              id="product-code"
              name="code"
              type="text"
              placeholder="Digite o código interno"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="product-category">Categoria</FieldLabel>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              disabled={isLoadingCategories}
            >
              <SelectTrigger id="product-category" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="product-brand">Marca</FieldLabel>
            <Select
              value={brandId}
              onValueChange={setBrandId}
              disabled={isLoadingBrands}
            >
              <SelectTrigger id="product-brand" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={String(brand.id)}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="product-unit">Unidade de medida</FieldLabel>
            <Select
              value={measurementUnitId}
              onValueChange={setMeasurementUnitId}
              disabled={isLoadingUnits}
            >
              <SelectTrigger id="product-unit" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {measurementUnits.map((unit) => (
                  <SelectItem key={unit.id} value={String(unit.id)}>
                    {unit.name} ({unit.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="product-min-stock">Estoque mínimo</FieldLabel>
            <Input
              id="product-min-stock"
              name="minStock"
              type="number"
              min={0}
              placeholder="Mínimo"
              value={minStock}
              onChange={(event) => setMinStock(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="product-max-stock">Estoque máximo</FieldLabel>
            <Input
              id="product-max-stock"
              name="maxStock"
              type="number"
              min={0}
              placeholder="Máximo"
              value={maxStock}
              onChange={(event) => setMaxStock(event.target.value)}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="product-description">Descrição</FieldLabel>
          <Textarea
            id="product-description"
            name="description"
            placeholder="Descreva o produto"
            className="h-24 resize-none"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Field>
      </FieldSet>
    </form>
  );
}
