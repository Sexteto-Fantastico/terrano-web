import type { FormEvent } from "react";
import { useState } from "react";
import { useCreateView } from "@/components/views/create-view";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MovementExitCategory, type CreateMovementExitRequest } from "@/api/movement-exit";
import { MOVEMENT_EXIT_CATEGORY_LABELS } from "./stock-out-filter-config";
import { ProductCombobox } from "./product-combobox";
import type { StockLocation } from "@/api/stock-locations";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export type StockOutFormValues = CreateMovementExitRequest;

interface StockOutFormProps {
  stockLocations: StockLocation[];
  onSubmit: (values: StockOutFormValues) => Promise<void>;
}

const availableCategories = Object.values(MovementExitCategory);

export function StockOutForm({
  stockLocations,
  onSubmit,
}: StockOutFormProps) {
  const { setIsSaving } = useCreateView();
  const [stockLocationId, setStockLocationId] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [internalNotes, setInternalNotes] = useState<string>("");
  const [stockRequisitionId, setStockRequisitionId] = useState<string>("");
  const [items, setItems] = useState<Array<{ id: string, productId: string, quantity: string, unitCost: string }>>([
    { id: "1", productId: "", quantity: "1", unitCost: "0" }
  ]);

  const displayedStockLocationId = stockLocationId || (stockLocations.length > 0 ? String(stockLocations[0].id) : "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    try {
      setIsSaving(true);
      await onSubmit({
        stockLocationId: Number(displayedStockLocationId) || 0,
        category: category as MovementExitCategory,
        internalNotes: internalNotes || null,
        stockRequisitionId: stockRequisitionId ? Number(stockRequisitionId) : undefined,
        items: items.map(i => ({
          productId: Number(i.productId) || 0,
          quantity: Number(i.quantity) || 0,
          unitCost: Number(i.unitCost) || 0,
        })),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      id="stock-out-form"
      className="w-full max-w-3xl"
      onSubmit={handleSubmit}
      noValidate
    >
      <FieldSet className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="stockLocationId">Local de Estoque (Origem)</FieldLabel>
            <Select value={displayedStockLocationId} onValueChange={setStockLocationId} required>
              <SelectTrigger id="stockLocationId" className="bg-background w-full">
                <SelectValue placeholder="Selecione o local" />
              </SelectTrigger>
              <SelectContent>
                {stockLocations.map((loc) => (
                  <SelectItem key={loc.id} value={String(loc.id)}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="category">Categoria da Saída</FieldLabel>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category" className="bg-background w-full">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {MOVEMENT_EXIT_CATEGORY_LABELS[cat] || cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {category === "MATERIAL_REQUEST" && (
            <Field>
              <FieldLabel htmlFor="stockRequisitionId">ID da Requisição Interna</FieldLabel>
              <Input
                id="stockRequisitionId"
                type="number"
                min="1"
                value={stockRequisitionId}
                onChange={(e) => setStockRequisitionId(e.target.value)}
                required
              />
            </Field>
          )}
        </div>

        <Field>
          <FieldLabel htmlFor="internalNotes">Observações Internas (Opcional)</FieldLabel>
          <Textarea
            id="internalNotes"
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </Field>

        <div className="space-y-4 border-t pt-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Itens da Saída</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setItems([...items, { id: Date.now().toString(), productId: "", quantity: "1", unitCost: "0" }])}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-[1fr_100px_120px_auto] gap-4 items-end border p-4 rounded-md">
                <Field>
                  <FieldLabel>Produto</FieldLabel>
                  <ProductCombobox
                    value={item.productId}
                    onValueChange={(val) => {
                      const newItems = [...items];
                      newItems[index].productId = val;
                      setItems(newItems);
                    }}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Qtd.</FieldLabel>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].quantity = e.target.value;
                      setItems(newItems);
                    }}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Custo Unit.</FieldLabel>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitCost}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].unitCost = e.target.value;
                      setItems(newItems);
                    }}
                    required
                  />
                </Field>
                {items.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setItems(items.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : <div className="w-10"></div>}
              </div>
            ))}
          </div>
        </div>
      </FieldSet>
    </form>
  );
}
