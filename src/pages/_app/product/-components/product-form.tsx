import type { FormEvent } from "react";
import { useEffect, useState } from "react";
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
import { fetchMeasurementUnits } from "@/api/measurement-units";

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
  initialName?: string;
  initialCode?: string;
  initialDescription?: string;
  initialCategoryId?: number;
  initialBrandId?: number;
  initialMeasurementUnitId?: number;
  initialMinStock?: number;
  initialMaxStock?: number;
  onSubmit: (values: ProductFormValues) => Promise<void>;
}

export function ProductForm({
  initialName = "",
  initialCode = "",
  initialDescription = "",
  initialCategoryId,
  initialBrandId,
  initialMeasurementUnitId,
  initialMinStock,
  initialMaxStock,
  onSubmit,
}: ProductFormProps) {
  const { setIsSaving } = useCreateView();

  const [name, setName] = useState(initialName);
  const [code, setCode] = useState(initialCode);
  const [description, setDescription] = useState(initialDescription);
  const [categoryId, setCategoryId] = useState(initialCategoryId?.toString() ?? "");
  const [brandId, setBrandId] = useState(initialBrandId?.toString() ?? "");
  const [measurementUnitId, setMeasurementUnitId] = useState(initialMeasurementUnitId?.toString() ?? "");
  const [minStock, setMinStock] = useState(initialMinStock?.toString() ?? "");
  const [maxStock, setMaxStock] = useState(initialMaxStock?.toString() ?? "");

  const { data: categories = [] } = useQuery({
    queryKey: ["product-categories"],
    queryFn: () => fetchAllProductCategories(),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["product-brands"],
    queryFn: fetchAllProductBrands,
  });

  const { data: measurementUnits = [] } = useQuery({
    queryKey: ["measurement-units"],
    queryFn: fetchMeasurementUnits,
  });

  useEffect(() => {
    setName(initialName);
    setCode(initialCode);
    setDescription(initialDescription);
    setCategoryId(initialCategoryId?.toString() ?? "");
    setBrandId(initialBrandId?.toString() ?? "");
    setMeasurementUnitId(initialMeasurementUnitId?.toString() ?? "");
    setMinStock(initialMinStock?.toString() ?? "");
    setMaxStock(initialMaxStock?.toString() ?? "");
  }, [
    initialName,
    initialCode,
    initialDescription,
    initialCategoryId,
    initialBrandId,
    initialMeasurementUnitId,
    initialMinStock,
    initialMaxStock,
  ]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    const parsedMinStock = minStock.trim() === "" ? undefined : Number(minStock);
    const parsedMaxStock = maxStock.trim() === "" ? undefined : Number(maxStock);

    if (parsedMinStock !== undefined && isNaN(parsedMinStock)) return;
    if (parsedMaxStock !== undefined && isNaN(parsedMaxStock)) return;

    try {
      setIsSaving(true);
      await onSubmit({
        name: name.trim(),
        code: code.trim(),
        description: description.trim() || undefined,
        categoryId: Number(categoryId),
        brandId: Number(brandId),
        measurementUnitId: Number(measurementUnitId),
        minStock: parsedMinStock,
        maxStock: parsedMaxStock,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      id="product-form"
      className="w-full max-w-lg"
      onSubmit={handleSubmit}
    >
      <FieldSet className="space-y-4">
        <Field>
          <FieldLabel htmlFor="product-name">Nome do Produto</FieldLabel>
          <Input
            id="product-name"
            name="name"
            type="text"
            placeholder="Digite o nome do produto"
            autoComplete="off"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="product-code">Código Interno do Produto</FieldLabel>
          <Input
            id="product-code"
            name="code"
            type="text"
            placeholder="Digite o código interno do produto"
            autoComplete="off"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="product-category">Categoria</FieldLabel>
          <Select
            value={categoryId}
            onValueChange={setCategoryId}
            required
          >
            <SelectTrigger id="product-category" className="w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
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
            required
          >
            <SelectTrigger id="product-brand" className="w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="product-unit">Unidade de Medida</FieldLabel>
          <Select
            value={measurementUnitId}
            onValueChange={setMeasurementUnitId}
            required
          >
            <SelectTrigger id="product-unit" className="w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {measurementUnits.map((unit) => (
                <SelectItem key={unit.id} value={unit.id.toString()}>
                  {unit.name} ({unit.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="product-min-stock">Estoque Mínimo</FieldLabel>
          <Input
            id="product-min-stock"
            name="minStock"
            type="number"
            placeholder="Mínimo"
            autoComplete="off"
            value={minStock}
            onChange={(event) => setMinStock(event.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="product-max-stock">Estoque Máximo</FieldLabel>
          <Input
            id="product-max-stock"
            name="maxStock"
            type="number"
            placeholder="Máximo"
            autoComplete="off"
            value={maxStock}
            onChange={(event) => setMaxStock(event.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="product-description">Descrição do Produto</FieldLabel>
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
